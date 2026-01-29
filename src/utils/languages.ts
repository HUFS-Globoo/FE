/**
 * 지원 언어 코드 목록
 * 데이터베이스의 languages 테이블과 동기화되어야 합니다.
 * 
 * 새로운 언어를 추가할 때는:
 * 1. 이 배열에 언어 코드 추가
 * 2. i18n/locales/ko.json과 en.json에 번역 추가
 * 3. 데이터베이스에 언어 추가
 */
export const SUPPORTED_LANGUAGE_CODES = [
  "ko",
  "en",
  "zh",
  "ar",
  "it",
  "fr",
  "de",
  "ja",
  "es",
  "ru",
  "pl",
  "cs",
  "sk",
  "ro",
  "bg",
  "vi",
  "th",
  "id",
  "ms",
  "mn",
  "hi",
  "fa",
  "tr",
  "he",
  "kk",
  "uz",
] as const;

/**
 * 언어 코드 타입
 */
export type LanguageCode = typeof SUPPORTED_LANGUAGE_CODES[number];

/**
 * 언어 코드가 지원되는지 확인하는 함수
 */
export function isSupportedLanguage(code: string): code is LanguageCode {
  return (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(code);
}

/**
 * 언어 코드를 한국어 이름으로 매핑
 * StudyList와 StudyPost에서 사용하는 value 매핑
 * 백엔드 API가 한국어 이름을 기대하는 경우 사용
 */
export const LANGUAGE_CODE_TO_KOREAN_NAME: Record<LanguageCode, string> = {
  ko: "한국어",
  en: "영어",
  zh: "중국어",
  ar: "아랍어",
  it: "이탈리아어",
  fr: "프랑스어",
  de: "독일어",
  ja: "일본어",
  es: "스페인어",
  ru: "러시아어",
  pl: "폴란드어",
  cs: "체코어",
  sk: "슬로바키아어",
  ro: "루마니아어",
  bg: "불가리아어",
  vi: "베트남어",
  th: "태국어",
  id: "인도네시아어",
  ms: "말레이어",
  mn: "몽골어",
  hi: "힌디어",
  fa: "페르시아어",
  tr: "터키어",
  he: "히브리어",
  kk: "카자흐어",
  uz: "우즈베크어",
};
