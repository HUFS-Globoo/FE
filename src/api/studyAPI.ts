import axiosInstance from '../../axiosInstance';
import { 
  StudyRequest, 
  StudyListResponse, 
  StudyDetailResponse, 
  StudyFilterParams 
} from '../types/study.types';

// ===== Study Controller API 함수들 =====

// GET /api/studies - 스터디 목록 조회 (필터링 포함)
export const getStudies = async (filters?: StudyFilterParams): Promise<StudyListResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.campus) params.append('campus', filters.campus);
    if (filters?.language) params.append('language', filters.language);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.size) params.append('size', filters.size.toString());

    const response = await axiosInstance.get(`/studies?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('스터디 목록 조회 실패:', error);
    throw error;
  }
};

// GET /api/studies/{postId} - 스터디 상세 조회
export const getStudyDetail = async (postId: number): Promise<StudyDetailResponse> => {
  try {
    const response = await axiosInstance.get(`/studies/${postId}`);
    return response.data;
  } catch (error) {
    console.error('스터디 상세 조회 실패:', error);
    throw error;
  }
};

// POST /api/studies - 스터디 생성
export const createStudy = async (studyData: StudyRequest): Promise<StudyDetailResponse> => {
  try {
    const response = await axiosInstance.post('/studies', studyData);
    return response.data;
  } catch (error) {
    console.error('스터디 생성 실패:', error);
    throw error;
  }
};

// PATCH /api/studies/{postId} - 스터디 수정
export const updateStudy = async (postId: number, studyData: Partial<StudyRequest>): Promise<StudyDetailResponse> => {
  try {
    const response = await axiosInstance.patch(`/studies/${postId}`, studyData);
    return response.data;
  } catch (error) {
    console.error('스터디 수정 실패:', error);
    throw error;
  }
};

// DELETE /api/studies/{postId} - 스터디 삭제
export const deleteStudy = async (postId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/studies/${postId}`);
  } catch (error) {
    console.error('스터디 삭제 실패:', error);
    throw error;
  }
};

// ===== 에러 처리 헬퍼 =====
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
};