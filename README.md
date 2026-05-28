# Gwangsan Client V2

광산구 시민 화폐 광산 어드민 콘솔의 차세대 버전.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS — 기존 V1 색 팔레트 유지
- [zaemoru](https://github.com/zaewc/zaemoru) — 디자인 시스템 (`zm-*` Web Components)
- TanStack Query
- Axios (쿠키 기반 토큰 갱신)
- Zod (폼/응답 검증)
- Chart.js + react-chartjs-2 (통계 그래프)

## Getting started

```bash
cp .env.example .env.local
# NEXT_PUBLIC_API_URL 채워넣기
npm install
npm run dev
```

## Routes

- `/signin` 로그인
- `/password` 비밀번호 재설정 (전화번호 → 인증코드 → 새 비밀번호)
- `/main` 대시보드 (알림 + 회원 목록)
- `/gwangsan` 광산 포인트 관리
- `/notice` 공지 목록 + 작성
- `/detail/[id]` 공지 상세
- `/profile/[id]` 회원 상세
- `/graph` 거래 통계
