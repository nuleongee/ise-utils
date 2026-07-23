# 금요일 퇴근시간 계산기 — React + Vite 마이그레이션 설계

- 날짜: 2026-07-24
- 상태: 승인됨
- 대상 저장소: `nuleongee/ise-utils` (제자리 전면 재작성)

## 배경 및 목표

Svelte 학습용으로 만든 사내 도구(금요일 퇴근시간 계산기)를 유지보수 편의를 위해 주력 스택인 React로 전환한다. 동시에 디자인 재설계, Vercel 배포 전환, PWA 적용, 이후 기능(금요일 출근시간 계산기) 추가를 위한 로직 분리를 수행한다.

**결정 사항 요약**
| 항목 | 결정 |
|---|---|
| 프레임워크 | React 19 + Vite 7 + TypeScript, SPA (라우터 없음) |
| 마이그레이션 방식 | 제자리 전면 재작성 (접근안 A) |
| 스타일링 | Tailwind CSS 4, 귀여운 톤 유지 + 카드 레이아웃 재설계 |
| 배포 | Vercel (GitHub 연동 자동 배포), AdSense 제거, GA 유지 |
| PWA | vite-plugin-pwa, 완전 오프라인 동작 |
| 테스트 | Vitest 단위 테스트(TDD), Playwright 제거 |

## 1. 아키텍처 & 스택

- React 19 + Vite 7 + TypeScript, 단일 화면 SPA. 라우터를 두지 않는다 — 이후 출근시간 계산기는 화면 내 탭/모드 전환으로 수용하고, 실제로 필요해질 때 라우터를 도입한다.
- 패키지 매니저 pnpm 유지. ESLint 9(flat config) + Prettier 3으로 툴체인 최신화.
- 의존성 제거: `dayjs`(분 단위 정수 연산으로 대체), `svelte-device-info`, `clsx`, `@neoconfetti/svelte`, `gh-pages`, SvelteKit 전체.

## 2. 구조 — 로직/UI 분리

```
src/
  lib/
    time.ts        # "HH:MM" ↔ 분 변환, 입력 자동 포맷(콜론 삽입)
    calculator.ts  # 퇴근시간 계산 — 순수 함수
  components/
    LaborInputs.tsx    # 쉬는날/총근로시간/출근기록 입력
    HalfDayToggle.tsx  # 반차 오전/오후 토글
    CoreTimeToggle.tsx # 코어타임 제거 on/off
    ResultCard.tsx     # 퇴근시간 결과 + bye.gif
    GuideTooltip.tsx   # 사용법 이미지
  App.tsx
  main.tsx
```

계산 로직 시그니처(안):

```ts
calcQuittingTime({
  workMinutes,     // 총근로시간 (분)
  arrivalMinutes,  // 금요일 출근시각 (자정 기준 분)
  offDays,         // 이번주 쉬는 날 (0~4, 0.5 단위)
  half,            // 0: 없음, 1: 오전 반차, 2: 오후 반차
  noCoreTime,      // 코어타임 제거 여부
}): { quittingMinutes: number; error?: 'workTimeError' }
```

UI와 완전히 분리하여 단위 테스트가 가능하고, 이후 출근시간 계산기가 같은 모듈에 역산 함수(`calcArrivalTime`)를 추가하는 방식으로 재사용한다.

## 3. 계산 로직 — 기존 동작 보존

기존 Svelte 구현의 동작을 그대로 보존한다.

- 퇴근시각 = `금요일 00:00 + (41h − 쉬는날×8h − 총근로시간 − 오전반차 1h) + 출근시각`
- 최소 퇴근 16:00 클램핑. 단 오전 반차 시 미적용, 코어타임 제거 on 시 미적용.
- 총근로시간 하한 검증: `총근로시간(+반차 시 4h) < (반차 시 31h, 아니면 27h) − 쉬는날×8h` 이면 `workTimeError`.
- 입력 검증 규칙 유지:
  - 쉬는 날: 0~4, 0.5 단위, 빈값 허용
  - 총근로시간: HH:MM, 시간부는 `27−쉬는날×8` ~ `39−쉬는날×8` 범위로 클램핑
  - 출근기록: HH:MM, 시간부 최대 11시(오후 반차 시 16시)
  - 숫자 4자리 입력 시 자동 콜론 삽입 (`0757` → `07:57`)
- 결과 시각이 10시 미만이면 "총근로시간 확인 필요" 경고 표시.

**성공 기준**: 기존 Svelte 버전과 동일 입력 → 동일 출력. 경계값 케이스를 단위 테스트로 고정한다.

## 4. 디자인 — 귀여운 톤 유지 + 재설계

- 아이덴티티 유지: Gamja Flower 폰트, 🍳 타이틀, bye.gif, e-HR 링크 헤더.
- Google Fonts CDN 대신 셀프호스팅(`@fontsource` 계열)으로 변경 — 오프라인 PWA 대응.
- `&nbsp;` 기반 정렬 제거 → 카드 기반 레이아웃(입력 폼 카드 + 결과 카드), 라벨/인풋 그리드 정렬.
- Tailwind CSS 4 사용, 파스텔 팔레트를 테마 토큰으로 정의. 모바일 우선 반응형(기존 모바일 대응 유지).
- 사용법 안내(guide.webp / guide-m.webp) 유지 — 데스크톱은 hover로 표시, 모바일은 탭으로 표시/숨김 토글. 기기 판별은 `svelte-device-info` 대신 뷰포트 미디어쿼리로 대체.

## 5. PWA

- `vite-plugin-pwa` 사용: manifest(이름·아이콘·테마색) + 서비스워커 자동 업데이트(autoUpdate).
- 전체 정적 애셋 프리캐시로 완전 오프라인 동작. 외부 런타임 의존(폰트 CDN, AdSense) 제거가 전제.
- PWA 아이콘 세트(192/512 등)는 기존 favicon 기반으로 신규 생성.

## 6. 배포 & 전환

- Vercel GitHub 연동 자동 배포. base path(`/ise-utils`) 제거.
- AdSense 제거. Google Analytics(gtag)는 유지 — 도메인 무관하게 동작.
- 기존 GitHub Pages(`gh-pages` 브랜치)에는 새 Vercel URL로 넘어가는 리다이렉트 정적 페이지 1장을 남겨 기존 사용자를 안내한다.

## 7. 테스트

- Vitest: `calculator.ts` / `time.ts` 단위 테스트. 반차(오전/오후)·코어타임·쉬는날(0.5 단위)·최소퇴근 클램핑·총근로시간 하한 경계값 포함. TDD로 진행.
- Playwright 및 관련 설정 제거 — 이 규모에서는 단위 테스트 + 수동 확인으로 충분.

## 8. 이후 계획 (이번 범위 아님)

- **금요일 출근시간 계산기**: 업무시간을 넉넉히 채워둔 경우, 금요일 16:00 퇴근에 딱 맞는 출근시각을 역산. `calculator.ts`에 역산 함수를 추가하고 화면 내 모드 전환으로 제공.
