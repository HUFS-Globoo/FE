// 스터디 모집 게시물 타입 정의 - Swagger API 명세서 기준(연동시 오류나면 수정,,)

export interface ApiResponse<T> {
  success: boolean;
  errorCode: string;
  message: string;
  data: T;
}

// ===== 스터디 관련 타입 =====

export type StudyStatus = string; 
export type Campus = string; // 😭"SEOUL" | "GLOBAL" (프로필, 마이페이지 타입 확인 필요)
export type Language = string; // "한국어" | "영어" | ...

// 스터디 게시글 기본 정보
export interface StudyItem {
  id: number;
  title: string;
  content: string;
  status: string;
  campus: string; 
  language: string;
  capacity: number; // 😭최대 인원(연동시 잘 되는지 확인 필요)
  createdAt: string;
  updatedAt: string;
}

// 스터디 리스트 응답 (GET /api/studies)
export interface StudyListResponse {
  success: boolean;
  errorCode: string;
  message: string;
  data: StudyItem[];
}

// 스터디 상세 응답 (GET /api/studies/{postId})
export interface StudyDetailResponse {
  success: boolean;
  errorCode: string;
  message: string;
  data: StudyItem;
}

// ===== Comments 타입 =====

// 댓글 작성자 
export interface CommentAuthor {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

// 댓글 
export interface StudyComment {
  id: number;
  postId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
}

// 댓글 리스트 응답 (GET /api/study/posts/{postId}/comments)
export interface CommentListResponse {
  content: StudyComment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: string;
  order: string;
}

// ===== 요청 관ㄹ련 =====

// 스터디 생성/수정 요청 (POST/PATCH /api/studies)
export interface StudyRequest {
  title: string;
  content: string;
  status: string;
  campus: string;
  language: string;
  capacity: number;
}

// 댓글 생성/수정 요청 (POST/PATCH comments)
export interface CommentRequest {
  content: string;
}

// 😭===== UI 전용 타입들 (목데이터 - 삭제) =====

export interface StudyCardItem extends StudyItem {
  // 😭현재 참여 인원 (별도 API에서 조회해야 할 수도 있음)
  currentParticipants?: number;
  // 😭작성자 정보 (별도 API나 추가 정보)
  authorId?: number;
  authorNickname?: string;
  authorProfileImage?: string | null;
  authorCountry?: string;
  // 😭UI용 태그들 - 게시글 모집 상태, 언어, 캠퍼스(마이페이지, 프로필 리스트 keywords랑 꼬이지 않도록 주의)
  tags?: string[];
}

// 스터디 필터링()
export interface StudyFilterParams {
  campus?: string;
  language?: string;
  status?: string;
  page?: number;
  size?: number;
}

// 😭사용자 프로필 카드 정보(목데이터-삭제 / 마이페이지 관련 api 연결 필요)
export interface UserProfileCard {
  id: number;
  username: string;
  nickname: string;
  email: string;
  profileImage: string | null;
  country: string;
}