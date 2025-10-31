import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* 색상 변수 정의 */
  :root {
    --primary: #002D56;
    --yellow1: #FAFDD9;
    --gray: #E1E1E1;
    --gray-text-filled: #F3F4F6;
    --gray-400: #9CA3AF;
    --gray-700: #374151;
    --gray-wf: #E0E0E0;
    --white: #FFFEFB;
    --black: #030712;
    --yellow2: #FFE6A2;
    --skyblue: #66CAE7;
    --chip-skyblue: #B4D6EC;
    --chip-green: #89B6BC;
    }

  /* 폰트 1 : 학교안심 둥근미소 */
  @font-face {
      font-family: 'SchoolSafetyRoundedSmile';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-5@1.0/HakgyoansimDunggeunmisoTTF-R.woff2') format('woff2');
      font-weight: normal;
      font-display: swap;
  }

  @font-face {
      font-family: 'SchoolSafetyRoundedSmile';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-5@1.0/HakgyoansimDunggeunmisoTTF-B.woff2') format('woff2');
      font-weight: 700;
      font-display: swap;
  }

  /* 폰트 2 : 에스코어드림 */
  @font-face {
      font-family: 'Escoredream';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-1Thin.woff') format('woff');
      font-weight: 100;
      font-display: swap;
  }

  @font-face {
      font-family: 'Escoredream';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-2ExtraLight.woff') format('woff');
      font-weight: 200;
      font-display: swap;
  }

  @font-face {
      font-family: 'Escoredream';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff') format('woff');
      font-weight: 300;
      font-display: swap;
  }

  @font-face {
      font-family: 'Escoredream';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-4Regular.woff') format('woff');
      font-weight: normal;
      font-display: swap;
  }

  @font-face {
      font-family: 'Escoredream';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-5Medium.woff') format('woff');
      font-weight: 500;
      font-display: swap;
  }

  @font-face {
      font-family: 'Escoredream';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-6Bold.woff') format('woff');
      font-weight: 600;
      font-display: swap;
  }

  @font-face {
      font-family: 'Escoredream';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-7ExtraBold.woff') format('woff');
      font-weight: 700;
      font-display: swap;
  }

  @font-face {
      font-family: 'Escoredream';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-8Heavy.woff') format('woff');
      font-weight: 800;
      font-display: swap;
  }

  @font-face {
      font-family: 'Escoredream';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-9Black.woff') format('woff');
      font-weight: 900;
      font-display: swap;
  }

  /* 전역 기본 폰트 설정 */
  body {
    font-family: 'Escoredream', sans-serif;
  }

  /* 타이포그래피 스타일 추가 */
    /* H1(큰 타이틀) - 'SchoolSafetyRoundedSmile' 적용 */
    .H1 {
        font-family: 'SchoolSafetyRoundedSmile', sans-serif;
        font-size: 32px;
        font-weight: 700; 
        letter-spacing: -0.01em; 
        line-height: 1.4; 
    }

    /* H2(주요 구역 큰 제목) - 'SchoolSafetyRoundedSmile' 적용 */
    .H2 {
        font-family: 'SchoolSafetyRoundedSmile', sans-serif;
        font-size: 24px;
        font-weight: 700; 
        letter-spacing: -0.01em; 
        line-height: 1.4; 
    }

    /* H3(주요 구역 소 제목) - 'Escoredream' 유지 */
    .H3 {
        font-size: 16px;
        font-weight: 300; 
        letter-spacing: -0.01em; 
        line-height: 1.4; 
    }
    
    /* H4(모달 큰 제목) - 'SchoolSafetyRoundedSmile' 적용 */
    .H4 {
        font-family: 'SchoolSafetyRoundedSmile', sans-serif;
        font-size: 18px;
        font-weight: 700; 
        letter-spacing: -0.01em; 
        line-height: 1.4; 
    }

    /* H5(모달 소 제목) - 'SchoolSafetyRoundedSmile' 적용 */
    .H5 {
        font-family: 'SchoolSafetyRoundedSmile', sans-serif;
        font-size: 16px;
        font-weight: 700; 
        letter-spacing: -0.01em; 
        line-height: 1.4; 
    }

    /* Body1(본문) - 'Escoredream' 유지 */
    .Body1 {
        font-size: 16px;
        font-weight: 300; 
        letter-spacing: 0.02em; 
        line-height: 1.6; 
    }

    /* Body2(카드 내 본문) - 'Escoredream' 유지 */
    .Body2 {
        font-size: 14px;
        font-weight: 300; 
        letter-spacing: 0.02em; 
        line-height: 1.6; 
    }
    
    /* Body3(보조 설명) - 'Escoredream' 유지 */
    .Body3 {
        font-size: 12px;
        font-weight: 300; 
        letter-spacing: -0.01em; 
        line-height: 1.4; 
    }
    
    /* Button1(CTA) - 'SchoolSafetyRoundedSmile' 적용 */
    .Button1 {
        font-family: 'SchoolSafetyRoundedSmile', sans-serif;
        font-size: 14px;
        font-weight: 700; 
        letter-spacing: 0; 
        line-height: 1.5; 
    }

    /* Button2(칩) - 'Escoredream' 유지 */
    .Button2 {
        font-size: 12px;
        font-weight: 500; 
        letter-spacing: 0; 
        line-height: 1.5; 
    }

`;
export default GlobalStyle;