import axiosInstance from '../../axiosInstance';
import { 
  StudyRequest, 
  StudyListResponse, 
  StudyDetailResponse, 
  StudyFilter 
} from '../types/study.types';

// GET /api/studies - 스터디 목록 조회 (필터링 포함시킴  - 필요없으면 빼기)
export const getStudies = async (filters: StudyFilter): Promise<StudyListResponse> => {
  const params = {
    page: filters.page,
    size: filters.size,
    status: filters.status,
    searchKeyword: filters.searchKeyword,
    campus: filters.campus, 
    language: filters.language,
  };

  const response = await axiosInstance.get<StudyListResponse>('/api/studies', { 
    params 
  });
  return response.data;
};

// GET /api/studies/{postId} - 스터디 상세 조회
export const getStudyDetail = async (postId: number): Promise<StudyDetailResponse> => {
  try {
    const response = await axiosInstance.get(`/api/studies/${postId}`);
    return response.data;
  } catch (error) {
    console.error('스터디 상세 조회 실패:', error);
    throw error;
  }
};

// POST /api/studies - 스터디 생성
export const createStudy = async (studyData: StudyRequest): Promise<StudyDetailResponse> => {
  try {
    const payload = {
      title: studyData.title,
      content: studyData.content,
      status: studyData.status,
      campuses: [studyData.campus],    
      languages: [studyData.language], 
      capacity: studyData.capacity,
    };

    const response = await axiosInstance.post('/api/studies', payload);
    return response.data;
  } catch (error) {
    console.error('스터디 생성 실패:', error);
    throw error;
  }
};

// PATCH /api/studies/{postId} - 스터디 수정
export const updateStudy = async (postId: number, studyData: Partial<StudyRequest>): Promise<StudyDetailResponse> => {
  try {
    const response = await axiosInstance.patch(`/api/studies/${postId}`, studyData);
    return response.data;
  } catch (error) {
    console.error('스터디 수정 실패:', error);
    throw error;
  }
};

// DELETE /api/studies/{postId} - 스터디 삭제
export const deleteStudy = async (postId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/studies/${postId}`);
  } catch (error) {
    console.error('스터디 삭제 실패:', error);
    throw error;
  }
};

// ===== 에러 처리 =====
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
};