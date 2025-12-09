# 컨설팅 신청 이메일 전송 기능 설정 가이드

## 방법 1: Netlify Functions (권장)

### 1. Netlify에 배포
- GitHub 저장소를 Netlify에 연결
- Netlify가 자동으로 빌드 및 배포

### 2. SendGrid 계정 생성 및 API 키 발급
1. [SendGrid](https://sendgrid.com/) 가입 (무료 플랜: 100 이메일/일)
2. Settings > API Keys에서 API 키 생성
3. API 키 복사

### 3. Netlify 환경 변수 설정
Netlify 대시보드 > Site settings > Environment variables에서 다음 변수 추가:

```
SENDGRID_API_KEY=your_sendgrid_api_key_here
RECIPIENT_EMAIL=aicansmile8@gmail.com
SENDER_EMAIL=noreply@aicansmile.com (또는 SendGrid에서 인증한 이메일)
```

### 4. SendGrid 발신자 이메일 인증
- SendGrid 대시보드 > Settings > Sender Authentication
- Single Sender Verification에서 발신자 이메일 인증

### 5. 의존성 설치
```bash
npm install
```

## 방법 2: EmailJS (대안 - 서버리스 함수 불가능한 경우)

### 1. EmailJS 계정 생성
1. [EmailJS](https://www.emailjs.com/) 가입 (무료 플랜 제공)
2. Email Service 추가 (Gmail, Outlook 등)
3. Email Template 생성

### 2. EmailJS 템플릿 설정
템플릿에 다음 변수 추가:
- `{{business_type}}`
- `{{business_number}}`
- `{{company_name}}`
- `{{contact_name}}`
- `{{mobile_phone}}`
- `{{phone}}`
- `{{email}}`
- `{{address}}`
- `{{consulting_content}}`
- `{{source}}`
- `{{privacy_agree}}`
- `{{submit_time}}`

### 3. consulting.html 수정
```html
<!-- EmailJS SDK 추가 -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

### 4. consulting.js 교체
`consulting.js` 대신 `consulting-emailjs.js` 사용하거나, `consulting-emailjs.js`의 코드를 `consulting.js`에 복사

### 5. EmailJS 설정 값 입력
`consulting-emailjs.js`에서 다음 값 수정:
- `YOUR_PUBLIC_KEY`: EmailJS Public Key
- `YOUR_SERVICE_ID`: EmailJS Service ID
- `YOUR_TEMPLATE_ID`: EmailJS Template ID

## 테스트

### Netlify Functions 테스트
1. 로컬 테스트:
```bash
npm install -g netlify-cli
netlify dev
```

2. 배포 후 실제 폼 제출 테스트

### EmailJS 테스트
1. EmailJS 대시보드에서 테스트 이메일 전송
2. 실제 폼 제출 테스트

## 문제 해결

### Netlify Functions 오류
- 환경 변수가 제대로 설정되었는지 확인
- SendGrid API 키가 유효한지 확인
- Netlify Functions 로그 확인 (Netlify 대시보드 > Functions)

### EmailJS 오류
- Public Key, Service ID, Template ID가 올바른지 확인
- EmailJS 대시보드에서 서비스 연결 상태 확인
- 브라우저 콘솔에서 에러 메시지 확인

## 보안 고려사항

1. **API 키 보호**: 환경 변수로 관리, 절대 코드에 하드코딩하지 않음
2. **CORS 설정**: Netlify Functions에서 허용된 도메인만 요청 가능하도록 설정
3. **Rate Limiting**: 스팸 방지를 위한 요청 제한 고려
4. **입력 검증**: 서버 사이드에서도 데이터 검증 수행

