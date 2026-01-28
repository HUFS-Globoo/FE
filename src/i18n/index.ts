import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 번역 파일 import
import koTranslations from './locales/ko.json';
import enTranslations from './locales/en.json';

i18n
  // 언어 감지 플러그인
  .use(LanguageDetector)
  // React 통합
  .use(initReactI18next)
  .init({
    // 지원 언어
    resources: {
      ko: {
        translation: koTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    // 기본 언어
    fallbackLng: 'ko',
    // 감지할 언어 저장 위치 (localStorage)
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    // 개발 모드 설정
    debug: false,
    // React 옵션
    react: {
      useSuspense: false, // Suspense 사용 안 함
    },
    // 인터폴레이션 설정
    interpolation: {
      escapeValue: false, // React는 XSS 방지가 내장되어 있음
    },
  });

export default i18n;
