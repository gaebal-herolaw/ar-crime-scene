# 역사 현장 AR — Crime Scene Reconstruction

QR코드(마커) 기반 웹 AR로 과거 사건 현장의 총알 충격 장면을 재현합니다.

## 프로젝트 구조

```
ar-crime-scene/
├── public/
│   ├── index.html           # 메인 AR 페이지
│   ├── ar-marker.png        # AR 마커 이미지 (인쇄용)
│   ├── compile-marker.html  # 마커 → .mind 변환 도구
│   └── targets.mind         # 컴파일된 마커 (아래 단계로 생성)
├── server.js                # 로컬 개발 서버
├── generate-marker.js       # 마커 이미지 생성 스크립트
└── README.md
```

## 설정 순서

### 1. 마커 컴파일 (.mind 파일 생성)

```bash
node server.js
```

브라우저에서 `http://localhost:3000/compile-marker.html` 열기
→ "컴파일 시작" 클릭
→ `targets.mind` 다운로드됨
→ `public/` 폴더에 저장

### 2. AR 테스트

같은 서버에서 `http://localhost:3000/` 접속
→ 카메라 허용
→ `ar-marker.png`를 인쇄하거나 다른 모바일 화면에 띄워서 비춤

### 3. 이펙트 위치 조정

**방법 1: URL 파라미터**
```
http://localhost:3000/?x=0.5&y=0.3&z=0&scale=1.0
```

**방법 2: 실시간 슬라이더**
AR 화면에서 ⚙️ 버튼 → 슬라이더로 X/Y/Z/크기 조정 → 📋 좌표 복사

### 4. 배포

`public/` 폴더를 정적 호스팅에 업로드 (GitHub Pages, Vercel, Netlify 등)
→ HTTPS 필수 (카메라 접근에 필요)

QR코드에 해당 URL 인코딩하여 마커 옆에 부착

## 좌표계

- 마커 중심 = (0, 0, 0)
- X: 양수 = 오른쪽
- Y: 양수 = 위
- Z: 양수 = 카메라 쪽 (마커에서 앞으로)
- 단위: 대략 마커 크기 기준 상대값

## 동작

1. QR 스캔 → 브라우저 오픈
2. 카메라 허용 → 마커 인식
3. 인식 후 0.5초 뒤 첫 이펙트 재생
4. 이후 **20초마다** 반복 (마커가 보이는 동안)
5. 마커를 놓치면 대기, 다시 인식하면 재개

## 이펙트 내용

- 섬광 (0.1초)
- 나무 파편 30개 비산 (1.5초)
- 먼지 구름 15개 (2초)
- 총알 자국 + 균열 표시 (3초 유지 후 페이드)

## 기술 스택

- **MindAR.js** — 이미지 타겟 트래킹
- **Three.js** — 3D 렌더링
- **바닐라 JS** — 앱 설치 불필요
