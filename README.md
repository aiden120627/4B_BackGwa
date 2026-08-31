# 4반 백과 v2

나무위키처럼 **웹에서 로그인 → 문서 작성/수정/삭제**가 가능한 무료 구조입니다.

## 구성
- GitHub Pages: 사이트 호스팅
- Supabase: 무료 범위의 로그인 + 데이터베이스
- 친구: 문서 읽기만 가능
- 관리자: 로그인 후 문서 관리 가능

## 반드시 해야 하는 설정

### 1. Supabase 프로젝트 만들기
https://supabase.com/ 에서 무료 프로젝트를 만드세요.

### 2. 관리자 계정 만들기
Supabase Dashboard → Authentication → Users → Add user에서 관리자 이메일과 비밀번호를 직접 만드세요.

### 3. 데이터베이스 만들기
Supabase → SQL Editor에서 `supabase.sql` 전체를 실행하세요.

실행하기 전에:
`YOUR_ADMIN_EMAIL@example.com`
를 관리자 계정의 정확한 이메일로 바꾸세요.

### 4. 사이트 연결
Supabase → Project Settings → API에서
- Project URL
- anon public key

를 복사해 `config.js`의 두 값에 넣으세요.

### 5. 문서 요청 이메일
`index.html`의
`YOUR_EMAIL@example.com`
을 문서 요청을 받을 이메일로 바꾸세요.

### 6. GitHub Pages
이 폴더의 파일을 GitHub 저장소 root에 업로드하고 Pages를 `main / root`로 배포하세요.

## 보안
Supabase의 RLS 정책으로 관리자 이메일만 문서 추가/수정/삭제가 가능하게 되어 있습니다.
`anon public key`는 브라우저에 들어가도 되지만, **service_role key는 절대로 config.js에 넣으면 안 됩니다.**

비밀번호는 HTML/JS에 저장하지 않고 Supabase Auth에서 관리합니다.
