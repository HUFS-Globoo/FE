/**
 * 지원 국가 코드 목록
 * 데이터베이스의 CountryList enum과 동기화되어야 합니다.
 * 
 * 새로운 국가를 추가할 때는:
 * 1. 이 배열에 국가 코드 추가
 * 2. i18n/locales/ko.json과 en.json에 번역 추가
 * 3. 데이터베이스에 국가 추가
 */

/* =========================
   🇰🇷 동아시아 (한국 포함)
========================= */
const EAST_ASIA = ["KR", "CN", "JP", "MN"] as const;

/* =========================
   🇺🇸 영어권
========================= */
const ENGLISH_SPEAKING = ["US", "UK"] as const;

/* =========================
   🇪🇺 서유럽
========================= */
const WESTERN_EUROPE = ["FR", "DE", "ES", "IT", "PT", "GR"] as const;

/* =========================
   🇷🇺 동유럽·유라시아
========================= */
const EASTERN_EUROPE = ["RU", "PL", "CZ", "SK", "RO", "BG"] as const;

/* =========================
   🇻🇳 동남아시아
========================= */
const SOUTHEAST_ASIA = ["VN", "TH", "ID", "MY"] as const;

/* =========================
   🇮🇳 남아시아
========================= */
const SOUTH_ASIA = ["IN"] as const;

/* =========================
   🇮🇷 중동·이슬람권
========================= */
const MIDDLE_EAST = ["IR", "TR", "IL", "SA"] as const;

/* =========================
   🇰🇿 중앙아시아
========================= */
const CENTRAL_ASIA = ["KZ", "UZ"] as const;

/* =========================
   아프리카
========================= */
const AFRICA = ["EG"] as const;

/**
 * 지원 국가 코드 목록 (백엔드 CountryList enum과 동일한 순서)
 */
export const SUPPORTED_COUNTRY_CODES = [
  ...EAST_ASIA,
  ...ENGLISH_SPEAKING,
  ...WESTERN_EUROPE,
  ...EASTERN_EUROPE,
  ...SOUTHEAST_ASIA,
  ...SOUTH_ASIA,
  ...MIDDLE_EAST,
  ...CENTRAL_ASIA,
  ...AFRICA,
] as const;

/**
 * 국가 코드 타입
 */
export type CountryCode = typeof SUPPORTED_COUNTRY_CODES[number];

/**
 * 국가 코드가 지원되는지 확인하는 함수
 */
export function isSupportedCountry(code: string): code is CountryCode {
  return (SUPPORTED_COUNTRY_CODES as readonly string[]).includes(code);
}
