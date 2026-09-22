# Supabase 설정 가이드

VibeBoard는 이제 Supabase PostgreSQL 데이터베이스를 사용하여 게시글을 저장합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정을 생성하거나 로그인합니다.
2. "New Project" 버튼을 클릭합니다.
3. 프로젝트 이름을 입력합니다 (예: "VibeBoard").
4. 데이터베이스 비밀번호를 설정합니다.
5. 리전을 선택합니다.
6. "Create new project" 버튼을 클릭합니다.

## 2. API 키 복사

1. 프로젝트 대시보드에서 "Settings" → "API" 탭을 엽니다.
2. 다음 값들을 복사합니다:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 3. 환경 변수 설정

`.env.local` 파일을 수정하여 위에서 복사한 값을 붙여넣습니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. 데이터베이스 테이블 생성

1. Supabase 대시보드에서 "SQL Editor" 탭을 엽니다.
2. "New Query" 버튼을 클릭합니다.
3. `supabase_schema.sql` 파일의 내용을 SQL 에디터에 복사합니다.
4. "Run" 버튼을 클릭합니다.

또는 Supabase CLI를 사용하는 경우:

```bash
supabase db push
```

## 5. Row Level Security (RLS) 설정 (선택사항)

더 높은 보안을 위해 RLS를 활성화할 수 있습니다:

1. Supabase 대시보드의 "Authentication" → "Policies" 탭으로 이동합니다.
2. `posts` 테이블에 대해 다음 정책을 추가합니다:
   - SELECT: 모든 사용자가 모든 게시글을 읽을 수 있습니다.
   - INSERT: 인증된 사용자가 게시글을 생성할 수 있습니다.
   - UPDATE: 게시글 작성자만 수정할 수 있습니다.
   - DELETE: 게시글 작성자만 삭제할 수 있습니다.

## 6. 개발 서버 시작

```bash
npm run dev
```

http://localhost:3000에서 VibeBoard를 방문하면, 데이터가 이제 Supabase에 저장됩니다!

## 문제 해결

### 연결 실패
- `.env.local` 파일의 URL과 API 키가 정확한지 확인합니다.
- Supabase 대시보드에서 프로젝트가 실행 중인지 확인합니다.

### 테이블이 없음
- Supabase SQL Editor에서 `supabase_schema.sql` 스크립트를 다시 실행합니다.
- "Table Editor" 탭에서 `posts` 테이블이 보이는지 확인합니다.

### 데이터가 저장되지 않음
- 브라우저 콘솔에서 오류 메시지를 확인합니다.
- Supabase 대시보드의 "Logs" 탭에서 데이터베이스 로그를 확인합니다.
