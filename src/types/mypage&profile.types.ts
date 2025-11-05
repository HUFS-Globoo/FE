// 마이페이지 & 프로필(상단 컴포넌트 해당) 관련 타입 정의 파일
export interface UserMeResponse {
  id: number;
  email: string;
  username: string;
  profile: {
    nickname: string;
    campus: 'SEOUL' | 'GLOBAL';
    mbti: string;
    country: string;
    profileImage: string | null;
    infoTitle: string | null;
    infoContent: string | null;
  };
  languages: Language[];
  keywords: Keyword[];
}

export interface Language {
  code: string;
  type: 'NATIVE' | 'LEARN';
}

export interface Keyword {
  id: number;
  name: string;
}

// 언어 조회/수정 타입
export interface LanguagesResponse {
  native: string[];
  learn: string[];
}

export interface LanguagesUpdateRequest {
  native: string[];
  learn: string[];
}

// 키워드 조회 타입
export interface KeywordsResponse {
  PERSONALITY: Keyword[];
  HOBBY: Keyword[];
  TOPIC: Keyword[];
}

export interface KeywordsUpdateRequest {
  keywordIds: number[];
}

// 프로필 수정 요청 타입
export interface ProfileUpdateRequest {
  nickname: string;
  campus: 'SEOUL' | 'GLOBAL';
  mbti: string;
  infoTitle: string;
  infoContent: string;
}

// 프로필 이미지 업로드 응답
export interface ProfileImageResponse {
  profileImage: string;
}

// 게시물 타입 (다른 api 확인하고 필요없으면 삭제할 예정)
export interface Post {
  id: string;
  status: '모집중' | '마감';
  currentParticipants: number;
  maxParticipants: number;
  title: string;
  tags: string[];
  createdAt: string;
}

// ------메타데이터 타입 

// 키워드 그룹 조회
export interface KeywordItem {
  id: number;
  name: string;
  active: boolean;
  sortOrder: number;
}

export interface GroupedKeywordsResponse {
  personality: KeywordItem[];
  hobby: KeywordItem[];
  topic: KeywordItem[];
}

// 언어 목록
export interface LanguageItem {
  code: string;
  name: string;
}

// 국가 목록
export interface CountryItem {
  code: string;
  name: string;
}

//------타인 프로필 타입(프로필 탐색,상세)
//마이페이지, 타인 프로필 페이지 상단에 공통된 컴포넌트 사용되어
//해당 컴포넌트는 공통 ui 디자인 사용 -> 대신 별도 타입 정의 필요 + 공통 props
// 프로필 카드 리스트 아이템
export interface ProfileCardItem {
  userId: number;
  nickname: string;
  campus: 'GLOBAL' | 'SEOUL';
  languages: {
    native: string[];
    learn: string[];
  };
  keywords: string[];
  mbti: string;
  intro: string;
  profileImage: string | null;
}

// 프로필 리스트 응답
export interface ProfileListResponse {
  content: ProfileCardItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// 프로필 상세 정보
export interface ProfileDetailResponse {
  userId: number;
  nickname: string;
  campus: 'GLOBAL' | 'SEOUL';
  country: string;
  mbti: string;
  keywords: string[];
  profileImage: string | null;
  introTitle: string;
  introContent: string;
  languages: {
    native: string[];
    learn: string[];
  };
  email?: string; // 이메일 필드 추가(마스킹 형태여도 백엔드에서 넘겨줄 경우 대비)
}

// 작성한 댓글 타입
export type Comment = {
  id: number;
  postId: number;
  postTitle: string;
  content: string;
};