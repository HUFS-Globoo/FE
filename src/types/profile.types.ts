// Profile List/Detail 페이지 타입 정의
// API 명세서 기준으로 작성

export type Campus = 'SEOUL' | 'GLOBAL';
export type LanguageCode = string; // ISO 639-1 (e.g., "ko", "en")

/** 언어 구조 (native + learn) */
export interface LanguagePair {
  native: LanguageCode[];  // ["ko"]
  learn: LanguageCode[];   // ["en", "ja"]
}

/** 
 * 1. 프로필 카드 리스트 아이템 
 * GET /api/profiles 응답의 content 
 */
export interface ProfileCardItem {
  userId: number;
  nickname: string;
  campus: Campus | null;
  country: string | null;          // ISO 3166-1 alpha-2 (e.g., "KR", "US")
  mbti: string | null;             // ≤ 8 chars
  profileImage: string | null;     // URL or null for default
  languages: LanguagePair;
  keywords: string[];              // 키워드 이름 배열 (e.g., ["긍정적", "운동", "음악"])
  intro: string | null;            // 짧은 한줄 소개
}

/** 
 * 2. 프로필 리스트 전체 응답 (페이지네이션)
 * GET /api/profiles?campus=GLOBAL&languages=ko,en&keywordIds=101,205&page=0&size=12
 */
export interface ProfileListResponse {
  content: ProfileCardItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/**
 * 3. 프로필 상세 정보
 * GET /api/profiles/{userId}
 */
export interface ProfileDetailItem {
  userId: number;
  nickname: string;
  campus: Campus | null;
  country: string | null;          // "KR"
  mbti: string | null;
  profileImage: string | null;
  introTitle: string | null;       // 자기소개 제목 (≤120)
  introContent: string | null;     // 자기소개 본문
  languages: LanguagePair;
  keywords: string[];              // 키워드 이름 배열
}

/**
 * 4. ProfileBanner 컴포넌트 Props
 * ProfileCardItem의 모든 속성을 받음
 */
export interface ProfileBannerProps extends ProfileCardItem {
  onClick?: () => void;  // 클릭 이벤트 핸들러 (선택적)
}

/**
 * 5. 프로필 필터링 쿼리 파라미터
 * GET /api/profiles에 사용
 */
export interface ProfileFilterParams {
  campus?: Campus | Campus[];      // "GLOBAL" or ["GLOBAL", "SEOUL"]
  languages?: LanguageCode[];      // ["ko", "en"]
  keywordIds?: number[];           // [101, 205]
  page?: number;                   // 0부터 시작
  size?: number;                   // 기본 12
}