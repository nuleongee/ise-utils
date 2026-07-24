# 퇴근 알림 캘린더 등록(.ics) 설계

- 날짜: 2026-07-24
- 상태: 승인됨
- 선행: React 마이그레이션 완료 본선(main) 위에 추가

## 목표

계산된 금요일 퇴근시각을 기기 캘린더에 등록해, 브라우저 상태와 무관하게 **10분 전·5분 전** 알람을 받게 한다. 서버·외부 SaaS 없이 `.ics` 파일 다운로드만 사용한다.

## 방식 결정

- Google Calendar 링크는 URL 파라미터로 알림 시점을 지정할 수 없음 → RFC 5545 `VALARM`을 담을 수 있는 `.ics` 파일이 유일한 무서버 방식.
- 알람은 `-PT10M`, `-PT5M` 두 개 고정 (커스터마이즈는 범위 외).

## 구현

### src/lib/ics.ts (신규, 순수 함수 — TDD)

```ts
buildQuittingIcs(quittingMinutes: number, now: Date): string
```

- 이벤트 날짜 = `now` 기준 이번주 금요일 (주 시작 일요일: `date − getDay() + 5`) — 기존 계산 로직의 `startOf('week').add(5,'day')`와 동일 의미.
- `DTSTART` = 금요일 00:00 + `quittingMinutes` (분). 24h 초과 시 자연스럽게 다음날로 넘어감. 로컬 시간(floating, TZID 없음)으로 표기해 기기 로컬 시간으로 해석되게 한다.
- `DTEND` = DTSTART + 5분. `SUMMARY` = `🍳 퇴근!`.
- `VALARM` 2개: `ACTION:DISPLAY`, `TRIGGER:-PT10M` / `-PT5M`.
- `UID` = `{now.getTime()}@ise-utils`, `DTSTAMP` = now의 UTC.
- 줄바꿈은 RFC 5545 규정대로 CRLF(`\r\n`).

### ResultCard 버튼

- 정상 결과(경고·에러 아님)일 때만 결과 문구 아래 `📅 캘린더에 알림 등록` 버튼 표시.
- 클릭 시 `buildQuittingIcs(...)` → `Blob(text/calendar)` → 임시 `<a download="quitting-alarm.ics">` 클릭으로 다운로드.
- 스타일: 기존 필 토글과 동일한 문법(헤어라인 필, hover 시 은은한 배경).

## 테스트 (vitest)

- 고정 `now`(평일/금요일 각각)로 DTSTART 날짜가 이번주 금요일인지
- 17:07 (1027분) → `T170700` 시각 표기
- 24h 초과(1500분) → 토요일 날짜로 넘어가는지
- VALARM 2개(-PT10M/-PT5M) 포함, CRLF 사용

## 범위 제외

알림 시점 커스터마이즈, 등록 취소/수정, 브라우저 Notification(1단계), Web Push(3단계).
