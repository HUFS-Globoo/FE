import axiosInstance from '../../axiosInstance';
import type { 
  StudyComment, 
  CommentRequest,
  CommentListResponse
} from "../types/study.types";

const COMMENT_BASE_URL = '/api/comments'; // 댓글 단일 처리 경로

/**
 * GET /api/study/posts/{postId}/comments
 */
export const getCommentsByStudyId = async (postId: number): Promise<CommentListResponse> => {
  try {
    const response = await axiosInstance.get<CommentListResponse>(`/api/study/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error('댓글 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * POST /api/study/posts/{postId}/comments
 */
export const addCommentToStudy = async (postId: number, data: CommentRequest): Promise<StudyComment> => {
  const response = await axiosInstance.post<StudyComment>(
    `/api/study/posts/${postId}/comments`,
    data
  );
  return response.data;
};

/**
 * PATCH /api/study/posts/{postId}/comments/{commentId}
 */
export const updateComment = async (
  postId: number,
  commentId: number,
  data: CommentRequest
) => {
  const response = await axiosInstance.patch(
    `/api/study/posts/${postId}/comments/${commentId}`,
    data
  );
  return response.data;
};

/**
 * DELETE /api/study/posts/{postId}/comments/{commentId}
 */
export const deleteComment = async (postId: number, commentId: number): Promise<void> => {
  await axiosInstance.delete<void>(`/api/study/posts/${postId}/comments/${commentId}`);
};