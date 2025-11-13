// 스터디 모집 게시물 타입 정의 - Swagger API 명세서 기준(연동시 오류나면 수정,,)

// 사용자 기본 정보 타입 (작성자, 댓글 작성자 등)
export interface UserBase {
  id: number;
  username: string;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  country: string;
}

export interface ApiResponse<T> {
  success: boolean;
  errorCode: string;
  message: string;
  data: T;
}

// ===== 스터디 관련 타입 =====

export type StudyStatus = '모집중' | '마감';
export type Campus = 'SEOUL' | 'GLOBAL';
export type Language = string;

export interface StudyItem {
  id: number;
  title: string;
  content: string;
  status: StudyStatus;
  campuses: string[];   
  languages: string[]; 
  capacity: number;

  authorId: number;
  authorNickname: string;
  authorProfileImageUrl: string | null;

  createdAt: string;
  updatedAt: string;

  currentParticipants: number;
}

//  StudyDetail에서 authorUsername: string; 해당 부분(현재는 목데이터) 주석처리함


// 스터디 리스트 응답 (GET /api/studies)
export interface StudyListResponse {
  data: StudyItem[];
}

// 스터디 상세 응답 (GET /api/studies/{postId})
export interface StudyDetailResponse extends ApiResponse<StudyItem> {}

// ===== Comments 타입 =====

// 댓글 작성자 
export interface CommentAuthor {
  id: number; 
  nickname: string;
  profileImageUrl: string | null;
}

// 댓글 
// 댓글 
export interface StudyComment {
  id: number; 
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
  status: StudyStatus;
  campus: Campus | '';
  language: Language;
  capacity: number;
}

// 댓글 생성/수정 요청 (POST/PATCH comments)
export interface CommentRequest {
  content: string;
}


// 스터디 필터링()
export interface StudyFilter {
  campus?: string;     
  language?: string;      
  status?: StudyStatus;
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