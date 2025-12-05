![logo.png](public%2Fimg%2Flogo.png)

## 개요

노래방에 갔을 때 무엇을 부를지 고민하거나 매번 노래를 검색하는 번거로움을 해결하기 위해 개발되었습니다.

사용자가 자신의 애창곡을 미리 저장해두고 현장에서 손쉽게 꺼내 볼 수 있는 개인화된 웹 서비스입니다.

사이트 이름은 애창곡을 나타내는 18번으로부터 유래되었습니다.

## 배포 링크
https://eighteen-three.vercel.app/

## 구현 기능

1. 회원 기능: 로그인 및 회원가입
2. 노래방 검색 기능: [외부 api](https://api.manana.kr/karaoke)를 이용하여 제목 및 가수 검색
4. 마이페이지: 자주 부르는 노래를 내 리스트에 저장 및 관리
5. 다크 모드: 노래방 조명 환경에 맞춰 눈의 피로를 줄이는 UI 모드 전환

## 기술 스택
- **Framework**: Next.js 14
- **Auth**: Next-Auth
- **Database**: MongoDB & Mongoose
- **Deployment**: Vercel

## 설치 및 실행
**1. 패키지 설치**
```Bash
git clone https://github.com/hwan-2/eighteen.git
cd eighteen

npm install
```
**2. 환경 변수 설정** 

루트 경로에 .env 파일을 생성하고 다음 값을 입력해야 합니다.
```Bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your secret key
MONGO_URI=your mongodb connection URI
```
**3. 실행**
```Bash
npm run dev
```

## 업데이트 기록
### v.1.1.0 - 2024-12-05
- Update: 비로그인 유저도 검색 기능 사용 가능하도록 접근성 개선

### v 1.0.0 - 2024-03-05
- Release: 서비스 정식 배포

## 컨트리뷰터
|이름|역할|GitHub|
|------|---|---|
|이승환|Backend|[SultanLee](https://github.com/SultanLee)|
|김이환|Frontend|[KimIHwan](https://github.com/KimIHwan)|

## 라이센스
이 프로젝트는 [MIT LICENSE](https://github.com/hwan-2/eighteen/blob/main/LICENSE)를 따릅니다.
