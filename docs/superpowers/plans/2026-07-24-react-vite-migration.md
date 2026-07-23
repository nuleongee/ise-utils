# 금요일 퇴근시간 계산기 React + Vite 마이그레이션 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** SvelteKit 기반 금요일 퇴근시간 계산기를 React 19 + Vite 7 + TypeScript SPA로 전면 재작성하고, Tailwind 4 디자인 재설계·PWA·Vercel 배포까지 완료한다.

**Architecture:** 계산 로직을 `src/lib/`의 순수 TypeScript 모듈(테스트 가능, 이후 출근시간 계산기가 재사용)로 분리하고, UI는 `src/components/`의 작은 React 컴포넌트로 조립한다. 라우터 없음(단일 화면).

**Tech Stack:** React 19, Vite 7, TypeScript(strict), Tailwind CSS 4(`@tailwindcss/vite`), Vitest, vite-plugin-pwa, pnpm.

**Spec:** `docs/superpowers/specs/2026-07-24-react-vite-migration-design.md`

## Global Constraints

- Node 20.19+ 필요(Vite 7), 패키지 매니저는 pnpm.
- **기존 계산 동작 보존이 최우선 성공 기준**: 동일 입력 → 동일 출력. 계산식은 Task 3의 코드가 유일한 진실이며 임의 "개선" 금지.
- 사용자 문구는 아래 원문 그대로 유지 (변경 금지):
  - 헤더 `🍳 금요일 퇴근시간 계산기` (클릭 시 `https://ehr.i-screamedu.co.kr` 새 탭)
  - 라벨: `이번주 쉬는 날` / `*e-HR의 총근로시간 입력` / `*e-HR의 출근기록 입력` / `반차 사용` / `코어 타임 제거` / `사용법 🤔`
  - placeholder: `0.5 단위로 입력` / `31:50` / `07:57`
  - 결과: `오후 5시 7분 퇴근!` 형식 (`{오전|오후} {h}시 {m}분 퇴근!`, h는 12시간제, m은 패딩 없음)
  - 경고: `총근로시간 확인 필요! 😡`
  - footer: `Nuleongee's ISE Utils`
  - 버튼: `오전` / `오후`, 코어타임 `on` / `off`
- Google Analytics ID `G-LV3LKYB1D1` 유지. AdSense(`ca-pub-4782898835259697`) 스니펫은 제거하고 다시 넣지 않는다.
- Prettier 스타일 유지: useTabs, singleQuote, semi, trailingComma all, printWidth 120, arrowParens avoid, bracketSameLine.
- 커밋 메시지는 기존 컨벤션(`feat:`, `fix:`, `chore:`, `docs:` + 한국어 요약)을 따르고 `-m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"`을 두 번째 메시지로 추가.
- 테스트 실행 명령: `pnpm test` (vitest run).

## File Structure (최종)

```
index.html                  # 루트 엔트리 (GA, OG 메타 포함)
vite.config.ts              # react + tailwindcss + PWA 플러그인, vitest 설정
tsconfig.json               # 단일 tsconfig (strict)
eslint.config.js            # ESLint 9 flat config
public/                     # (구 static/) favicon.ico, robots.txt, images/, icons/
src/
  main.tsx                  # ReactDOM 엔트리
  App.tsx                   # 상태 보유 + 조립
  index.css                 # 폰트 셀프호스팅 import + Tailwind 4 + @theme 토큰
  lib/
    time.ts / time.test.ts            # HH:MM 포맷·파싱·한국어 시각 포맷
    calculator.ts / calculator.test.ts # 퇴근시간 계산 + 입력 클램프 규칙
  components/
    LaborInputs.tsx         # 쉬는날/총근로시간/출근기록 입력 3종
    HalfDayToggle.tsx       # 반차 오전/오후
    CoreTimeToggle.tsx      # 코어타임 제거 on/off
    ResultCard.tsx          # 결과/경고 표시 + bye.gif
    GuideTooltip.tsx        # 사용법 이미지 (hover/탭)
```

삭제 대상: `svelte.config.js`, `src/routes/`, `src/app.html`, `src/app.d.ts`, `src/app.css`, `src/lib/images/`, `playwright.config.ts`, `tests/`, `.eslintrc.cjs`, `.eslintignore`, `postcss.config.js`, `tailwind.config.js`(Tailwind 4는 CSS-first 설정), `static/`(→ `public/`으로 이동).

---

### Task 1: SvelteKit 제거 + React/Vite 스캐폴드

**Files:**
- Delete: 위 "삭제 대상" 전체
- Create: `index.html`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Modify: `package.json`(전면 재작성), `.prettierrc`, `.prettierignore`, `.gitignore`
- Move: `static/` → `public/`

**Interfaces:**
- Produces: 빌드 가능한 React 앱 스켈레톤. `src/index.css`의 테마 토큰(`--color-cream-50`, `--color-grape-500` 등)과 `pnpm dev/build/test/lint` 스크립트를 이후 태스크가 사용.

- [ ] **Step 1: Svelte 관련 파일 삭제 및 static 이동**

```bash
git rm -r src/routes src/app.html src/app.d.ts src/app.css src/lib/images \
  svelte.config.js playwright.config.ts tests .eslintrc.cjs .eslintignore \
  postcss.config.js tailwind.config.js
git mv static public
rm -rf node_modules pnpm-lock.yaml .svelte-kit build
```

- [ ] **Step 2: package.json 재작성 (의존성은 다음 스텝에서 추가)**

```json
{
	"name": "ise-utils",
	"version": "1.0.0",
	"private": true,
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc --noEmit && vite build",
		"preview": "vite preview",
		"test": "vitest run",
		"test:watch": "vitest",
		"lint": "eslint .",
		"format": "prettier --write ."
	}
}
```

- [ ] **Step 3: 의존성 설치**

```bash
pnpm add react react-dom
pnpm add -D typescript @types/react @types/react-dom @vitejs/plugin-react \
  vite vitest tailwindcss @tailwindcss/vite \
  eslint @eslint/js typescript-eslint eslint-plugin-react-hooks \
  prettier @fontsource/gamja-flower
```

Expected: 에러 없이 설치 완료, `pnpm-lock.yaml` 재생성.

- [ ] **Step 4: 설정 파일 작성**

`vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [react(), tailwindcss()],
	test: {
		include: ['src/**/*.test.ts'],
	},
});
```

`tsconfig.json`:

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"lib": ["ES2022", "DOM", "DOM.Iterable"],
		"module": "ESNext",
		"moduleResolution": "bundler",
		"jsx": "react-jsx",
		"strict": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"noEmit": true,
		"skipLibCheck": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"types": ["vite/client"]
	},
	"include": ["src", "vite.config.ts"]
}
```

`eslint.config.js`:

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
	{ ignores: ['dist', 'dev-dist'] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		plugins: { 'react-hooks': reactHooks },
		rules: reactHooks.configs.recommended.rules,
	},
);
```

`.prettierrc` (svelte 플러그인 제거):

```json
{
	"useTabs": true,
	"singleQuote": true,
	"semi": true,
	"trailingComma": "all",
	"printWidth": 120,
	"arrowParens": "avoid",
	"bracketSameLine": true
}
```

`.prettierignore`:

```
dist
dev-dist
pnpm-lock.yaml
```

`.gitignore`:

```
node_modules
dist
dev-dist
.DS_Store
*.local
.env
```

- [ ] **Step 5: 엔트리 파일 작성**

`index.html` (GA 유지, AdSense 제거, OG 메타 이전):

```html
<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta charset="UTF-8" />
		<link rel="icon" href="/favicon.ico" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>🍳 금요일 퇴근시간 계산기</title>
		<meta name="description" content="🍦아이스크림에듀 퇴근시간 계산기" />
		<meta property="og:title" content="🍦아이스크림에듀 퇴근시간 계산기" />
		<meta property="og:image" content="/images/bye.gif" />
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-LV3LKYB1D1"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());
			gtag('config', 'G-LV3LKYB1D1');
		</script>
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="/src/main.tsx"></script>
	</body>
</html>
```

`src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
```

`src/index.css` (Tailwind 4 CSS-first 테마 — 이후 태스크가 이 토큰을 사용):

```css
@import '@fontsource/gamja-flower';
@import 'tailwindcss';

@theme {
	--font-display: 'Gamja Flower', cursive, sans-serif;
	--color-cream-50: #fffaf3;
	--color-cream-100: #fff3e0;
	--color-egg-300: #ffd66b;
	--color-egg-400: #ffc93c;
	--color-grape-400: #b47ef5;
	--color-grape-500: #a15ff3;
	--color-grape-600: #8b46e0;
	--color-ink-700: #4a4442;
}

body {
	font-family: var(--font-display);
	color: var(--color-ink-700);
	background-color: var(--color-cream-50);
}
```

`src/App.tsx` (임시 스켈레톤 — Task 4에서 교체):

```tsx
export default function App() {
	return <h1>🍳 금요일 퇴근시간 계산기</h1>;
}
```

- [ ] **Step 6: 빌드·린트 검증**

```bash
pnpm build && pnpm lint
```

Expected: 둘 다 성공. `dist/`에 index.html 생성.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: SvelteKit 제거 및 React 19 + Vite 7 + Tailwind 4 스캐폴드 전환" \
  -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: time.ts — 시간 문자열 유틸 (TDD)

**Files:**
- Create: `src/lib/time.ts`, Test: `src/lib/time.test.ts`

**Interfaces:**
- Produces (Task 3, 4가 사용):
  - `formatTimeInput(raw: string): string` — 숫자만 남기고 4자리째에 콜론 삽입, 최대 5자
  - `parseTimeToMinutes(value: string): number | null` — `"HH:MM"` → 분, 형식이 아니면 null
  - `formatKoreanTime(totalMinutes: number): string` — `"오후 5시 7분"` (h는 12시간제, 24h 초과분은 %24 래핑)

- [ ] **Step 1: 실패하는 테스트 작성** — `src/lib/time.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { formatKoreanTime, formatTimeInput, parseTimeToMinutes } from './time';

describe('formatTimeInput', () => {
	it('4자리 숫자에 콜론을 삽입한다', () => {
		expect(formatTimeInput('0757')).toBe('07:57');
	});
	it('숫자가 아닌 문자를 제거한다', () => {
		expect(formatTimeInput('07a5b7')).toBe('07:57');
	});
	it('5자를 초과하면 자른다', () => {
		expect(formatTimeInput('075712')).toBe('07:57');
	});
	it('3자리 이하는 콜론 없이 그대로 둔다', () => {
		expect(formatTimeInput('075')).toBe('075');
	});
	it('빈 문자열은 빈 문자열', () => {
		expect(formatTimeInput('')).toBe('');
	});
});

describe('parseTimeToMinutes', () => {
	it('HH:MM을 분으로 변환한다', () => {
		expect(parseTimeToMinutes('07:57')).toBe(477);
	});
	it('형식이 아니면 null', () => {
		expect(parseTimeToMinutes('0757')).toBeNull();
		expect(parseTimeToMinutes('7:57')).toBeNull();
		expect(parseTimeToMinutes('')).toBeNull();
	});
});

describe('formatKoreanTime', () => {
	it('오후 시각을 12시간제로 표시한다', () => {
		expect(formatKoreanTime(17 * 60 + 7)).toBe('오후 5시 7분');
	});
	it('정오는 오후 12시', () => {
		expect(formatKoreanTime(12 * 60)).toBe('오후 12시 0분');
	});
	it('오전 시각', () => {
		expect(formatKoreanTime(9 * 60 + 10)).toBe('오전 9시 10분');
	});
	it('24시간을 넘으면 래핑한다', () => {
		expect(formatKoreanTime(25 * 60 + 59)).toBe('오전 1시 59분');
	});
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm test`
Expected: FAIL — `Cannot find module './time'` 또는 함수 미정의.

- [ ] **Step 3: 구현** — `src/lib/time.ts`

```ts
export function formatTimeInput(raw: string): string {
	let digits = raw.replace(/\D/g, '');
	if (digits.length > 0) {
		digits = digits.replace(/(\d{2})(\d{2})/, '$1:$2');
		digits = digits.slice(0, 5);
	}
	return digits;
}

export function parseTimeToMinutes(value: string): number | null {
	if (!/^\d{2}:\d{2}$/.test(value)) return null;
	const [hours, minutes] = value.split(':').map(Number);
	return hours * 60 + minutes;
}

export function formatKoreanTime(totalMinutes: number): string {
	const hour24 = Math.floor(totalMinutes / 60) % 24;
	const minute = totalMinutes % 60;
	const meridiem = hour24 < 12 ? '오전' : '오후';
	const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
	return `${meridiem} ${hour12}시 ${minute}분`;
}
```

- [ ] **Step 4: 통과 확인**

Run: `pnpm test`
Expected: PASS (time.test.ts 전체).

- [ ] **Step 5: Commit**

```bash
git add src/lib/time.ts src/lib/time.test.ts
git commit -m "feat: 시간 문자열 유틸 모듈 추가 (HH:MM 포맷/파싱/한국어 표시)" \
  -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: calculator.ts — 퇴근시간 계산 로직 (TDD)

기존 Svelte 구현(`git show aaac04c:src/routes/+page.svelte`)의 동작을 그대로 보존한다. 원본 식: 퇴근시각 = 금 00:00 + (41 − 쉬는날×8 − (근로h + 반차시 4) − (오전반차 1))h − 근로m + 출근시각. 최소 퇴근 16:00(오전 반차 시 00:00) 클램핑은 코어타임 제거 off일 때만.

**Files:**
- Create: `src/lib/calculator.ts`, Test: `src/lib/calculator.test.ts`

**Interfaces:**
- Consumes: 없음 (순수 모듈)
- Produces (Task 4가 사용):
  - `type Half = 0 | 1 | 2` (0: 없음, 1: 오전 반차, 2: 오후 반차)
  - `calcQuittingTime(input: { workMinutes: number; arrivalMinutes: number; offDays: number; half: Half; noCoreTime: boolean }): { quittingMinutes: number; error?: 'workTimeError' }`
  - `sanitizeOffDays(value: string, prev: string): string` — 0~4, 0.5 단위·중간 입력(`1.`) 허용, 그 외엔 prev로 복원, 빈값 허용
  - `clampWorkTime(value: string, offDays: number): string` — 5자 완성 시 시간부를 [27−8×offDays, 39−8×offDays]로 클램프, 분은 최대 59. 미완성 입력은 그대로 반환
  - `clampArrivalTime(value: string, half: Half): string` — 5자 완성 시 시간부 최대 11(오후 반차면 16), 분 최대 59. 미완성 입력은 그대로 반환
- 이후 계획된 출근시간 계산기(`calcArrivalTime` 역산)가 이 모듈에 추가될 예정 — 이번 범위 아님.

- [ ] **Step 1: 실패하는 테스트 작성** — `src/lib/calculator.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { calcQuittingTime, clampArrivalTime, clampWorkTime, sanitizeOffDays } from './calculator';

describe('calcQuittingTime', () => {
	it('기본 케이스: 31:50 근무, 07:57 출근 → 17:07 퇴근', () => {
		const r = calcQuittingTime({
			workMinutes: 31 * 60 + 50,
			arrivalMinutes: 7 * 60 + 57,
			offDays: 0,
			half: 0,
			noCoreTime: false,
		});
		expect(r.quittingMinutes).toBe(17 * 60 + 7);
		expect(r.error).toBeUndefined();
	});

	it('최소 퇴근 16:00으로 클램핑한다', () => {
		const r = calcQuittingTime({ workMinutes: 35 * 60, arrivalMinutes: 8 * 60, offDays: 0, half: 0, noCoreTime: false });
		expect(r.quittingMinutes).toBe(16 * 60);
	});

	it('코어타임 제거 시 16:00 클램핑을 하지 않는다', () => {
		const r = calcQuittingTime({ workMinutes: 35 * 60, arrivalMinutes: 8 * 60, offDays: 0, half: 0, noCoreTime: true });
		expect(r.quittingMinutes).toBe(14 * 60);
	});

	it('오전 반차: 근무시간 +4h, 점심 1h 차감, 최소퇴근 클램핑 없음', () => {
		const r = calcQuittingTime({ workMinutes: 28 * 60, arrivalMinutes: 11 * 60, offDays: 0, half: 1, noCoreTime: false });
		// 41 - (28+4) - 1 = 8h → 08:00 + 11:00 = 19:00
		expect(r.quittingMinutes).toBe(19 * 60);
	});

	it('오후 반차: 근무시간 +4h만 반영', () => {
		const r = calcQuittingTime({ workMinutes: 27 * 60, arrivalMinutes: 8 * 60, offDays: 0, half: 2, noCoreTime: false });
		// 41 - (27+4) = 10h → 10:00 + 08:00 = 18:00
		expect(r.quittingMinutes).toBe(18 * 60);
	});

	it('쉬는 날 0.5일은 4시간으로 차감한다', () => {
		const r = calcQuittingTime({ workMinutes: 27 * 60, arrivalMinutes: 9 * 60, offDays: 0.5, half: 0, noCoreTime: false });
		// 41 - 4 - 27 = 10h → 10:00 + 09:00 = 19:00
		expect(r.quittingMinutes).toBe(19 * 60);
	});

	it('총근로시간이 하한(27h - 쉬는날×8) 미만이면 workTimeError', () => {
		const r = calcQuittingTime({ workMinutes: 20 * 60, arrivalMinutes: 8 * 60, offDays: 0, half: 0, noCoreTime: false });
		expect(r.error).toBe('workTimeError');
	});

	it('반차 시 하한은 31h(반차 4h 포함 기준)', () => {
		const ok = calcQuittingTime({ workMinutes: 27 * 60, arrivalMinutes: 8 * 60, offDays: 0, half: 2, noCoreTime: false });
		expect(ok.error).toBeUndefined();
		const bad = calcQuittingTime({ workMinutes: 26 * 60 + 59, arrivalMinutes: 8 * 60, offDays: 0, half: 2, noCoreTime: false });
		expect(bad.error).toBe('workTimeError');
	});
});

describe('sanitizeOffDays', () => {
	it('0.5 단위 값을 허용한다', () => {
		expect(sanitizeOffDays('1.5', '')).toBe('1.5');
	});
	it('중간 입력(소수점까지)을 허용한다', () => {
		expect(sanitizeOffDays('1.', '1')).toBe('1.');
	});
	it('허용되지 않는 값은 이전 값으로 복원한다', () => {
		expect(sanitizeOffDays('1.7', '1.')).toBe('1.');
		expect(sanitizeOffDays('5', '')).toBe('');
	});
	it('빈값을 허용한다', () => {
		expect(sanitizeOffDays('', '2')).toBe('');
	});
});

describe('clampWorkTime', () => {
	it('시간부를 하한 27로 올린다', () => {
		expect(clampWorkTime('20:00', 0)).toBe('27:00');
	});
	it('시간부를 상한 39로 내린다', () => {
		expect(clampWorkTime('45:00', 0)).toBe('39:00');
	});
	it('쉬는 날만큼 범위가 내려간다 (offDays=1 → 19~31)', () => {
		expect(clampWorkTime('35:00', 1)).toBe('31:00');
		expect(clampWorkTime('10:00', 1)).toBe('19:00');
	});
	it('분은 59로 클램프한다', () => {
		expect(clampWorkTime('31:99', 0)).toBe('31:59');
	});
	it('미완성 입력은 그대로 반환한다', () => {
		expect(clampWorkTime('31:5', 0)).toBe('31:5');
		expect(clampWorkTime('', 0)).toBe('');
	});
});

describe('clampArrivalTime', () => {
	it('시간부 최대 11', () => {
		expect(clampArrivalTime('13:00', 0)).toBe('11:00');
	});
	it('오후 반차면 최대 16', () => {
		expect(clampArrivalTime('13:00', 2)).toBe('13:00');
		expect(clampArrivalTime('17:30', 2)).toBe('16:30');
	});
	it('분은 59로 클램프한다', () => {
		expect(clampArrivalTime('07:99', 0)).toBe('07:59');
	});
	it('미완성 입력은 그대로 반환한다', () => {
		expect(clampArrivalTime('07:5', 0)).toBe('07:5');
	});
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm test`
Expected: FAIL — `Cannot find module './calculator'`.

- [ ] **Step 3: 구현** — `src/lib/calculator.ts`

```ts
export type Half = 0 | 1 | 2; // 0: 반차 없음, 1: 오전 반차, 2: 오후 반차

export interface CalcInput {
	workMinutes: number; // e-HR 총근로시간 (분)
	arrivalMinutes: number; // 금요일 출근시각 (자정 기준 분)
	offDays: number; // 이번주 쉬는 날 (0~4, 0.5 단위)
	half: Half;
	noCoreTime: boolean; // 코어 타임 제거
}

export interface CalcResult {
	quittingMinutes: number; // 금요일 자정 기준 분 (24h 초과 가능)
	error?: 'workTimeError';
}

const WEEKLY_HOURS = 41; // 주 40h + 점심 등 보정 1h (기존 구현 기준)

export function calcQuittingTime({ workMinutes, arrivalMinutes, offDays, half, noCoreTime }: CalcInput): CalcResult {
	const workHours = Math.floor(workMinutes / 60) + (half !== 0 ? 4 : 0);
	const workMins = workMinutes % 60;

	const minWorkHours = (half !== 0 ? 31 : 27) - offDays * 8;
	const error = workHours < minWorkHours ? ('workTimeError' as const) : undefined;

	let quittingMinutes =
		(WEEKLY_HOURS - offDays * 8 - workHours - (half === 1 ? 1 : 0)) * 60 - workMins + arrivalMinutes;

	const minQuittingMinutes = (half === 1 ? 0 : 16) * 60;
	if (!noCoreTime && quittingMinutes < minQuittingMinutes) {
		quittingMinutes = minQuittingMinutes;
	}

	return error ? { quittingMinutes, error } : { quittingMinutes };
}

const OFF_DAYS_PATTERN = /^(0|0\.|0\.5|1|1\.|1\.5|2|2\.|2\.5|3|3\.|3\.5|4)$/;

export function sanitizeOffDays(value: string, prev: string): string {
	let next: string;
	if (OFF_DAYS_PATTERN.test(value)) {
		next = value;
	} else if (value === '') {
		next = '';
	} else {
		next = prev;
	}

	if (Number(next) > 4) next = '4';
	else if (Number(next) < 0) next = '0';
	return next;
}

function clampCompleteTime(value: string, maxHours: number, minHours: number): string {
	if (value.length !== 5) return value;
	const hours = Math.max(Math.min(parseInt(value.split(':')[0], 10), maxHours), minHours);
	const minutes = Math.min(Number(value.split(':')[1]), 59);
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function clampWorkTime(value: string, offDays: number): string {
	return clampCompleteTime(value, 39 - offDays * 8, 27 - offDays * 8);
}

export function clampArrivalTime(value: string, half: Half): string {
	return clampCompleteTime(value, half === 2 ? 16 : 11, 0);
}
```

- [ ] **Step 4: 통과 확인**

Run: `pnpm test`
Expected: PASS (calculator.test.ts + time.test.ts 전체).

- [ ] **Step 5: Commit**

```bash
git add src/lib/calculator.ts src/lib/calculator.test.ts
git commit -m "feat: 퇴근시간 계산 로직을 순수 모듈로 분리 (기존 동작 보존)" \
  -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: UI 컴포넌트 + App 조립

기능 완성이 목표. 세부 디자인 폴리시는 Task 5. 원본과의 동작 차이 주의점: (1) 쉬는 날 변경 시 총근로시간을 다시 클램프, (2) 반차 변경 시 출근기록을 다시 클램프 — Svelte 반응성이 하던 일을 핸들러에서 명시적으로 수행한다.

**Files:**
- Create: `src/components/LaborInputs.tsx`, `src/components/HalfDayToggle.tsx`, `src/components/CoreTimeToggle.tsx`, `src/components/ResultCard.tsx`, `src/components/GuideTooltip.tsx`
- Modify: `src/App.tsx` (스켈레톤 교체)

**Interfaces:**
- Consumes: Task 2의 `formatTimeInput`, `parseTimeToMinutes`, `formatKoreanTime`; Task 3의 `calcQuittingTime`, `sanitizeOffDays`, `clampWorkTime`, `clampArrivalTime`, `Half`, `CalcResult`
- Produces: 완동작 앱. Task 5가 className만 다듬는다.

- [ ] **Step 1: 컴포넌트 작성**

`src/components/LaborInputs.tsx`:

```tsx
interface Props {
	offDays: string;
	workTime: string;
	arrivalTime: string;
	onOffDaysChange: (value: string) => void;
	onWorkTimeChange: (value: string) => void;
	onArrivalTimeChange: (value: string) => void;
}

const inputClass = 'w-36 rounded-lg border border-egg-300 bg-white px-3 py-1 focus:outline-grape-400';

export default function LaborInputs({
	offDays,
	workTime,
	arrivalTime,
	onOffDaysChange,
	onWorkTimeChange,
	onArrivalTimeChange,
}: Props) {
	return (
		<div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3">
			<label htmlFor="offDays" className="text-right">
				이번주 쉬는 날
			</label>
			<input
				id="offDays"
				type="text"
				inputMode="decimal"
				value={offDays}
				onChange={e => onOffDaysChange(e.target.value)}
				placeholder="0.5 단위로 입력"
				className={inputClass}
			/>
			<label htmlFor="workTime" className="text-right">
				<span className="text-red-500">*</span>e-HR의 총근로시간 입력
			</label>
			<input
				id="workTime"
				type="text"
				inputMode="numeric"
				value={workTime}
				onChange={e => onWorkTimeChange(e.target.value)}
				placeholder="31:50"
				className={inputClass}
			/>
			<label htmlFor="arrivalTime" className="text-right">
				<span className="text-red-500">*</span>e-HR의 출근기록 입력
			</label>
			<input
				id="arrivalTime"
				type="text"
				inputMode="numeric"
				value={arrivalTime}
				onChange={e => onArrivalTimeChange(e.target.value)}
				placeholder="07:57"
				className={inputClass}
			/>
		</div>
	);
}
```

`src/components/HalfDayToggle.tsx`:

```tsx
import type { Half } from '../lib/calculator';

interface Props {
	half: Half;
	onToggle: (type: 1 | 2) => void;
}

function buttonClass(active: boolean): string {
	return `px-3 py-1 transition-colors ${active ? 'bg-grape-500 text-white' : 'bg-cream-100 hover:bg-egg-300'}`;
}

export default function HalfDayToggle({ half, onToggle }: Props) {
	return (
		<div className="flex overflow-hidden rounded-lg border border-egg-300">
			<button type="button" aria-pressed={half === 1} onClick={() => onToggle(1)} className={buttonClass(half === 1)}>
				오전
			</button>
			<button type="button" aria-pressed={half === 2} onClick={() => onToggle(2)} className={buttonClass(half === 2)}>
				오후
			</button>
		</div>
	);
}
```

`src/components/CoreTimeToggle.tsx`:

```tsx
interface Props {
	noCoreTime: boolean;
	onToggle: () => void;
}

export default function CoreTimeToggle({ noCoreTime, onToggle }: Props) {
	return (
		<button
			type="button"
			aria-pressed={noCoreTime}
			onClick={onToggle}
			className={`min-w-16 rounded-lg border border-egg-300 px-3 py-1 transition-colors ${
				noCoreTime ? 'bg-grape-500 text-white' : 'bg-cream-100 hover:bg-egg-300'
			}`}>
			{noCoreTime ? 'on' : 'off'}
		</button>
	);
}
```

`src/components/ResultCard.tsx`:

```tsx
import type { CalcResult } from '../lib/calculator';
import { formatKoreanTime } from '../lib/time';

interface Props {
	result: CalcResult | null;
}

export default function ResultCard({ result }: Props) {
	if (!result) return null;

	const hour = Math.floor(result.quittingMinutes / 60) % 24;
	if (hour < 10) {
		return <p className="text-xl">총근로시간 확인 필요! 😡</p>;
	}
	if (result.error) return null;

	return (
		<p className="flex items-center gap-2 text-2xl">
			{formatKoreanTime(result.quittingMinutes)} 퇴근!
			<img src="/images/bye.gif" alt="bye" className="h-8 w-8" />
		</p>
	);
}
```

`src/components/GuideTooltip.tsx` (데스크톱 hover, 모바일 탭 토글 — 뷰포트 기준 이미지 선택). 주의: mouse 이벤트와 click을 섞으면 모바일 탭에서 열림·닫힘이 연달아 발생하므로 pointer 이벤트로 분기한다:

```tsx
import { useState } from 'react';

export default function GuideTooltip() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative flex justify-center">
			<button
				type="button"
				className="cursor-pointer text-gray-500"
				onPointerEnter={e => e.pointerType === 'mouse' && setIsOpen(true)}
				onPointerLeave={e => e.pointerType === 'mouse' && setIsOpen(false)}
				onPointerUp={e => e.pointerType !== 'mouse' && setIsOpen(open => !open)}>
				사용법 🤔
			</button>
			{isOpen && (
				<picture className="pointer-events-none absolute top-8 z-10 w-full max-w-2xl">
					<source media="(max-width: 640px)" srcSet="/images/guide-m.webp" />
					<img src="/images/guide.webp" alt="사용법 안내" className="w-full" />
				</picture>
			)}
		</div>
	);
}
```

- [ ] **Step 2: App.tsx 조립**

```tsx
import { useState } from 'react';
import { calcQuittingTime, clampArrivalTime, clampWorkTime, sanitizeOffDays, type Half } from './lib/calculator';
import { formatTimeInput, parseTimeToMinutes } from './lib/time';
import CoreTimeToggle from './components/CoreTimeToggle';
import GuideTooltip from './components/GuideTooltip';
import HalfDayToggle from './components/HalfDayToggle';
import LaborInputs from './components/LaborInputs';
import ResultCard from './components/ResultCard';

export default function App() {
	const [offDays, setOffDays] = useState('');
	const [workTime, setWorkTime] = useState('');
	const [arrivalTime, setArrivalTime] = useState('');
	const [half, setHalf] = useState<Half>(0);
	const [noCoreTime, setNoCoreTime] = useState(false);

	const offDaysNumber = Number(offDays) || 0;

	function handleOffDaysChange(value: string) {
		const next = sanitizeOffDays(value, offDays);
		setOffDays(next);
		setWorkTime(prev => clampWorkTime(prev, Number(next) || 0));
	}

	function handleWorkTimeChange(value: string) {
		setWorkTime(clampWorkTime(formatTimeInput(value), offDaysNumber));
	}

	function handleArrivalTimeChange(value: string) {
		setArrivalTime(clampArrivalTime(formatTimeInput(value), half));
	}

	function handleHalfToggle(type: 1 | 2) {
		const next: Half = half === type ? 0 : type;
		setHalf(next);
		setArrivalTime(prev => clampArrivalTime(prev, next));
	}

	const workMinutes = parseTimeToMinutes(workTime);
	const arrivalMinutes = parseTimeToMinutes(arrivalTime);
	const result =
		workMinutes !== null && arrivalMinutes !== null
			? calcQuittingTime({ workMinutes, arrivalMinutes, offDays: offDaysNumber, half, noCoreTime })
			: null;

	return (
		<div className="flex min-h-dvh flex-col">
			<a href="https://ehr.i-screamedu.co.kr" target="_blank" rel="noreferrer noopener">
				<header className="mt-8 text-center text-4xl">🍳 금요일 퇴근시간 계산기</header>
			</a>

			<main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 p-4">
				<GuideTooltip />
				<LaborInputs
					offDays={offDays}
					workTime={workTime}
					arrivalTime={arrivalTime}
					onOffDaysChange={handleOffDaysChange}
					onWorkTimeChange={handleWorkTimeChange}
					onArrivalTimeChange={handleArrivalTimeChange}
				/>
				<div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3">
					<span className="text-right">반차 사용</span>
					<HalfDayToggle half={half} onToggle={handleHalfToggle} />
					<span className="text-right">코어 타임 제거</span>
					<CoreTimeToggle noCoreTime={noCoreTime} onToggle={() => setNoCoreTime(v => !v)} />
				</div>
				<ResultCard result={result} />
			</main>

			<footer className="p-3 text-center font-bold">Nuleongee's ISE Utils</footer>
		</div>
	);
}
```

- [ ] **Step 3: 검증 — 테스트·빌드·수동 동작 확인**

```bash
pnpm test && pnpm build && pnpm lint
```

Expected: 전부 성공.

`pnpm dev` 후 브라우저에서 골든 케이스 확인 (기존 배포본 https://nuleongee.github.io/ise-utils/ 와 비교):
1. 총근로시간 `31:50`, 출근기록 `07:57` → **오후 5시 7분 퇴근!** + bye.gif
2. `35:00` / `08:00` → **오후 4시 0분 퇴근!** (16시 클램핑)
3. 2번 상태에서 코어 타임 제거 on → **오후 2시 0분 퇴근!**
4. 쉬는 날 `1.7` 입력 → `1.`로 복원됨, `5` 입력 → 무시됨
5. 출근기록에 `1300` 입력 → `11:00`으로 클램프, 오후 반차 on 후 `1300` → `13:00` 허용

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components
git commit -m "feat: React 컴포넌트로 퇴근시간 계산기 UI 재구성" \
  -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: 디자인 재설계 — 귀여운 톤 + 카드 레이아웃

톤 유지(Gamja Flower·🍳·bye.gif·파스텔), `&nbsp;` 정렬 시대의 흔적을 카드 UI로 대체. 이 태스크는 스타일(className/CSS)과 레이아웃 래퍼만 변경하고 로직·문구·이벤트 핸들러는 건드리지 않는다.

**Files:**
- Modify: `src/App.tsx`, `src/index.css`, `src/components/*.tsx` (className만)

**Interfaces:**
- Consumes: Task 1의 `@theme` 토큰(cream/egg/grape/ink)
- Produces: 최종 시각 디자인. 이후 태스크는 스타일을 변경하지 않는다.

- [ ] **Step 1: 배경·타이포 폴리시** — `src/index.css`의 body 규칙을 아래로 교체

```css
body {
	font-family: var(--font-display);
	color: var(--color-ink-700);
	background-color: var(--color-cream-50);
	background-image: radial-gradient(circle at 20% 20%, rgba(255, 214, 107, 0.25) 0%, transparent 40%),
		radial-gradient(circle at 80% 70%, rgba(180, 126, 245, 0.18) 0%, transparent 45%);
	background-attachment: fixed;
}
```

- [ ] **Step 2: 카드 레이아웃 적용** — `src/App.tsx`의 `<main>` 내부를 카드로 감싼다

입력 영역(LaborInputs + 토글 그리드)을 카드 하나로:

```tsx
<section className="w-full rounded-3xl border-2 border-egg-300 bg-white/80 p-6 shadow-[4px_4px_0_0_var(--color-egg-300)] backdrop-blur-sm">
	{/* 기존 LaborInputs + 토글 그리드 */}
</section>
```

결과 영역(ResultCard)을 별도 카드로 (결과가 있을 때만 렌더):

```tsx
{result && (
	<section className="w-full rounded-3xl border-2 border-grape-400 bg-white/80 p-6 text-center shadow-[4px_4px_0_0_var(--color-grape-400)]">
		<ResultCard result={result} />
	</section>
)}
```

헤더 폰트 크기 반응형: `text-4xl` → `text-[clamp(1.8rem,8dvw,3.2rem)]`. 본문 폰트: main에 `text-[clamp(1rem,4.3dvw,1.4rem)]`.

- [ ] **Step 3: 컴포넌트 폴리시**

- `ResultCard`: 결과 문구를 `text-3xl text-grape-600`으로 강조, 경고는 `text-red-500`
- 입력 focus 시 `focus:ring-2 focus:ring-grape-400` 통일
- 버튼 active 시 `active:translate-y-px` (기존 눌림 효과 유지)
- 모바일(≤640px)에서 카드 패딩 `p-4`, 그리드 `gap-x-2`

- [ ] **Step 4: 검증 — 데스크톱/모바일 육안 확인**

```bash
pnpm dev
```

확인 항목: 데스크톱 1280px·모바일 375px 폭에서 (1) 카드 정렬·여백, (2) 라벨/인풋 정렬(구 `&nbsp;` 흔적 없이), (3) 사용법 hover/탭 동작, (4) 결과 카드 강조. `pnpm build && pnpm lint` 성공 확인.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/index.css src/components
git commit -m "feat: 파스텔 카드 레이아웃 디자인 적용" \
  -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: PWA 적용

**Files:**
- Modify: `vite.config.ts`, `index.html`
- Create: `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/icons/apple-touch-icon.png`

**Interfaces:**
- Consumes: Task 1의 vite.config.ts
- Produces: 오프라인 동작 + 설치 가능한 PWA

- [ ] **Step 1: 아이콘 생성** (기존 favicon은 48px라 부적합 — Noto Emoji 🍳 사용, 라이선스 OFL)

```bash
mkdir -p public/icons
curl -sL https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f373.png -o public/icons/icon-512.png
sips -z 192 192 public/icons/icon-512.png --out public/icons/icon-192.png
sips -z 180 180 public/icons/icon-512.png --out public/icons/apple-touch-icon.png
```

Expected: 3개 PNG 생성 (`file public/icons/*.png`로 크기 확인).

- [ ] **Step 2: vite-plugin-pwa 설치 및 설정**

```bash
pnpm add -D vite-plugin-pwa
```

`vite.config.ts`에 플러그인 추가:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'robots.txt', 'images/*.webp', 'images/*.gif'],
			manifest: {
				name: '금요일 퇴근시간 계산기',
				short_name: '퇴근계산기',
				description: '아이스크림에듀 금요일 퇴근시간 계산기',
				lang: 'ko',
				display: 'standalone',
				theme_color: '#fffaf3',
				background_color: '#fffaf3',
				icons: [
					{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
					{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
				],
			},
		}),
	],
	test: {
		include: ['src/**/*.test.ts'],
	},
});
```

`index.html`의 `<head>`에 추가:

```html
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
<meta name="theme-color" content="#fffaf3" />
```

- [ ] **Step 3: 오프라인 동작 검증**

```bash
pnpm build && pnpm preview
```

브라우저에서: (1) `dist/manifest.webmanifest`와 서비스워커 등록 확인 (DevTools → Application), (2) 새로고침 후 DevTools Network를 Offline으로 전환 → 재새로고침해도 앱·이미지·폰트가 정상 표시, (3) 주소창 설치 아이콘 표시 확인.

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts index.html public/icons package.json pnpm-lock.yaml
git commit -m "feat: PWA 적용 (오프라인 지원, 홈 화면 설치)" \
  -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: README 정리 + Vercel 배포 + GitHub Pages 리다이렉트

**Files:**
- Modify: `README.md` (전면 재작성)
- Create (gh-pages 브랜치에만): 리다이렉트 `index.html`

**Interfaces:**
- Consumes: 완성된 앱 전체
- Produces: 운영 배포

- [ ] **Step 1: README 재작성**

~~~markdown
# 🍳 ISE Utils — 금요일 퇴근시간 계산기

아이스크림에듀 e-HR 기준으로 금요일 퇴근 가능 시각을 계산하는 도구.

## 개발

```bash
pnpm install
pnpm dev      # 개발 서버
pnpm test     # 단위 테스트 (vitest)
pnpm build    # 타입체크 + 프로덕션 빌드
```

## 스택

React 19 · Vite 7 · TypeScript · Tailwind CSS 4 · vite-plugin-pwa

## 배포

`main` 브랜치 push 시 Vercel이 자동 배포한다.
구 GitHub Pages URL(https://nuleongee.github.io/ise-utils/)은 리다이렉트 페이지만 유지.
~~~

```bash
git add README.md
git commit -m "docs: README를 React + Vite 스택 기준으로 재작성" \
  -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 2: main push + Vercel 프로젝트 연결 (사용자 수동 단계)**

```bash
git push origin main
```

사용자에게 안내: vercel.com → Add New Project → `nuleongee/ise-utils` import → Framework Preset: **Vite** (Build `pnpm build`, Output `dist` 자동 감지) → Deploy. 완료 후 **실제 배포 URL**(예: `https://ise-utils.vercel.app`)을 확인받는다. 배포된 URL에서 Task 4 Step 3의 골든 케이스 1·2번을 재확인한다.

- [ ] **Step 3: gh-pages 브랜치를 리다이렉트 페이지로 교체**

Step 2에서 확인한 실제 URL로 `<VERCEL_URL>`을 치환해 실행:

```bash
TMP=$(mktemp -d)
cat > "$TMP/index.html" <<'EOF'
<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta charset="UTF-8" />
		<title>🍳 금요일 퇴근시간 계산기 — 이사했어요</title>
		<meta http-equiv="refresh" content="0; url=<VERCEL_URL>" />
		<link rel="canonical" href="<VERCEL_URL>" />
		<script>
			location.replace('<VERCEL_URL>');
		</script>
	</head>
	<body>
		<p>계산기가 이사했습니다 → <a href="<VERCEL_URL>"><VERCEL_URL></a></p>
	</body>
</html>
EOF
touch "$TMP/.nojekyll"
cd "$TMP" && git init -b gh-pages && git add -A \
  && git commit -m "chore: Vercel 이전 리다이렉트 페이지" \
  && git push -f https://github.com/nuleongee/ise-utils.git gh-pages
cd - && rm -rf "$TMP"
```

Expected: https://nuleongee.github.io/ise-utils/ 접속 시 Vercel URL로 즉시 이동.

- [ ] **Step 4: 최종 검증**

- [ ] Vercel URL에서 앱 정상 동작 (골든 케이스 1·2)
- [ ] 모바일에서 홈 화면 추가(PWA 설치) 동작
- [ ] 구 GitHub Pages URL 리다이렉트 동작
- [ ] `pnpm test && pnpm build && pnpm lint` 로컬 전체 통과
