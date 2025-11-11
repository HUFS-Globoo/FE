import axiosInstance from '../../axiosInstance';
import type { 
    StudyComment, 
    CommentRequest,
    CommentListResponse // 댓글 목록 조회 응답 타입
} from "../types/study.types";

const COMMENT_BASE_URL = '/api/comments'; // 댓글 단일 처리 경로

/**
 * GET /api/studies/{studyId}/comments
 * @param studyId 스터디 게시글 ID
 */
export const getCommentsByStudyId = async (studyId: number): Promise<CommentListResponse> => {
  try {
    const response = await axiosInstance.get<CommentListResponse>(`/api/studies/${studyId}/comments`);
    return response.data;
  } catch (error) {
    console.error('댓글 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * POST /api/studies/{studyId}/comments
 * @param studyId 스터디 게시글 ID
 * @param data 댓글 내용 
 */
export const addCommentToStudy = async (studyId: number, data: CommentRequest): Promise<StudyComment> => {
  const response = await axiosInstance.post<StudyComment>(`/api/studies/${studyId}/comments`, data);
  return response.data;
};

/**
 * PATCH /api/comments/{commentId}
 * @param commentId // 댓글 id
 * @param data 수정할 내용
 */
export const updateComment = async (commentId: number, data: CommentRequest): Promise<StudyComment> => {
  const response = await axiosInstance.patch<StudyComment>(`${COMMENT_BASE_URL}/${commentId}`, data);
  return response.data;
};

/**
 * DELETE /api/comments/{commentId}
 * @param commentId 
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  await axiosInstance.delete<void>(`${COMMENT_BASE_URL}/${commentId}`);
};