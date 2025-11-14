import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { StudyRequest } from "../../types/study.types";
import { createStudy, handleApiError, getStudyDetail, updateStudy } from "../../api/studyAPI";
import type {UserMeResponse } from "../../types/mypage&profile.types";
import axiosInstance from "../../../axiosInstance";

const fetchUserMe = async (): Promise<UserMeResponse | null> => {
    try {
        const response = await axiosInstance.get<UserMeResponse>('/api/users/me');
        return response.data;
    } catch (error) {
        console.error("내 정보 조회 실패 (인증 문제일 수 있으니 확인하셔요):", error);
        return null;
    }
};
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: var(--gray-text-filled);
  padding: 3rem 0;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 2rem;
`;

const LeftPanel = styled.div`
  width: 350px;
  flex-shrink: 0;
`;

const RightPanel = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  margin-bottom: 2.5rem;
`;

// 기존 StudyList/StudyDetail과 동일한 사용자 프로필 카드
const UserProfileCard = styled.div`
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--gray);
`;

const UserInfo = styled.div`
  text-align: center;
`;

const UserName = styled.div`
  color: var(--black);
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.div`
  color: var(--gray-400);
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: 1px solid ${props => props.$variant === 'primary' ? 'var(--primary)' : 'var(--skyblue)'};
  border-radius: 0.75rem;
  background-color: ${props => props.$variant === 'primary' ? 'var(--primary)' : 'var(--white)'};
  color: ${props => props.$variant === 'primary' ? 'var(--white)' : 'var(--skyblue)'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$variant === 'primary' ? 'var(--primary)' : 'var(--skyblue)'};
    color: var(--white);
  }
`;

// 게시글 작성 폼
const PostFormCard = styled.div`
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 1rem;
  padding: 2rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Label = styled.label`
  color: var(--black);
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--gray);
  border-radius: 0.75rem;
  background-color: var(--white);
  color: var(--gray-700);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--skyblue);
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--gray);
  border-radius: 0.75rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--skyblue);
  }
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--gray);
  border-radius: 0.75rem;
  font-size: 1rem;
  font-family: inherit;
  min-height: 10rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--skyblue);
  }
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.75rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: var(--skyblue);
  color: var(--white);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: var(--primary);
  }

  &:disabled {
    background-color: var(--gray);
    cursor: not-allowed;
  }
`;

const StudyPost = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id?: string}>(); // url에서 id 갖고옴(수정모드에 필요)
  const isEditMode = !!id; // id 있으면 수정모드로
  const studyId = isEditMode ? Number(id) : null; // 숫자로 변환
  const [userMe, setUserMe] = useState<UserMeResponse | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  
  const [formData, setFormData] = useState<StudyRequest>({
    title: "",
    content: "",
    status: "모집중",
    campus: "" as 'SEOUL' | 'GLOBAL' | '',
    language: "",
    capacity: 2
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUserMe = async () => {
        setIsUserLoading(true);
        const data = await fetchUserMe();
        setUserMe(data);
        setIsUserLoading(false);
    };
    loadUserMe();
  }, []);

  // 수정 모드 -> 기존 글 데이터 가져와서 post 텍스트 폼에 채워져 있음
  // getStudyDetail api 사용
  // useEffect로 컴포넌트 마운트 시점에 불러옴
  // /study/post/3 일 경우 isEditMode는 true, getStudyDetail(3) 호출함
  useEffect(() => {
    const loadStudyForEdit = async () => {
      if (!isEditMode || !studyId) return;

      try {
        const res = await getStudyDetail(studyId);
        const data = res.data;

        setFormData({
          title: data.title,
          content: data.content,
          status: data.status,
          campus: (data.campuses?.[0] as 'SEOUL' | 'GLOBAL' | '') ?? "",
          language: data.languages?.[0] ?? "",
          capacity: data.capacity,
        });
      } catch (error) {
        console.error("수정용 스터디 데이터 불러오기 실패:", error);
        alert("게시글 정보를 불러오지 못했습니다.");
        navigate(`/study/${studyId}`);
      }
    };

    loadStudyForEdit();
  }, [isEditMode, studyId, navigate]);


  const handleInputChange = (field: keyof StudyRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "게시글 제목을 입력해주세요";
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "모집 상세내용을 입력해주세요";
    }
    
    if (!formData.campus) {
      newErrors.campus = "캠퍼스를 선택해주세요";
    }
    
    if (!formData.language) {
      newErrors.language = "사용언어를 선택해주세요";
    }
    
    if (formData.capacity < 2 || formData.capacity > 6) {
      newErrors.capacity = "최대인원은 2~6명 사이여야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  if (!userMe) {
    alert('게시글 작성을 위해 로그인이 필요합니다.');
    navigate('/login'); 
    return;
  }

  setIsSubmitting(true);

  try {
    if (isEditMode && studyId) {
      // 수정 모드 > PATCH /api/studies/{postId}
      const response = await updateStudy(studyId, formData);
      console.log("게시글 수정 성공:", response);
      alert(`"${formData.title}" 게시글이 수정되었습니다!`);
      navigate(`/study/${studyId}`);
    } else {
      // 작성 모드 -> POST /api/studies
      const response = await createStudy(formData);
      console.log("게시글 작성 성공:", response);
      const newPostId = response.data?.id;
      alert(`"${formData.title}" 게시글이 성공적으로 작성되었습니다!`);
      if (newPostId) {
        navigate(`/study/${newPostId}`);
      } else {
        console.error("API 응답에서 새로운 게시글 ID를 찾을 수 없습니다:", response);
        navigate('/study');
      }
    }

  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error(isEditMode ? '게시글 수정 실패:' : '게시글 작성 실패:', error);
    alert(`${isEditMode ? '게시글 수정' : '게시글 작성'}에 실패했습니다: ${errorMessage}`);
  } finally {
    setIsSubmitting(false);
  }
};


  const handleMyPostsClick = () => {
    navigate("/mypage");
  };

  const handleMyCommentsClick = () => {
  navigate("/mypage", { state: { activeTab: "comments" } });
};

  const handleBackToList = () => {
    navigate("/study");
  };

  const isFormValid = formData.title.trim() && 
                     formData.content.trim() && 
                     formData.campus && 
                     formData.language &&
                     formData.capacity >= 2 && 
                     formData.capacity <= 6;

  return (
    <Container>
      <ContentWrapper>
        <LeftPanel>
          <UserProfileCard>
            {isUserLoading ? (
                <p>사용자 정보 로딩 중...</p>
            ) : userMe ? (
                <>
                <ProfileImage 
                    src={userMe.profileImageUrl || "/placeholder-profile.png"} 
                    alt="프로필"
                />
                <UserInfo>
                    <UserName className="H4">
                        {userMe.name} / {userMe.nickname}
                    </UserName>
                    <UserEmail className="Body2">
                        {userMe.email}
                    </UserEmail>
                </UserInfo>
                </>
            ) : (
                <p>로그인이 필요합니다.</p>
            )}

            <ButtonGroup>
              <ActionButton 
                $variant="secondary" 
                className="Button1"
                onClick={handleMyPostsClick}
              >
                작성한 게시글
              </ActionButton>
              <ActionButton 
                $variant="secondary" 
                className="Button1"
                onClick={handleMyCommentsClick}
              >
                작성한 댓글
              </ActionButton>
              <ActionButton 
                $variant="primary" 
                className="Button1"
                onClick={handleBackToList}
              >
                스터디 목록
              </ActionButton>
            </ButtonGroup>
          </UserProfileCard>
        </LeftPanel>

        <RightPanel>
          <PageTitle className="H1">{isEditMode ? "게시글 수정" : "게시글 작성"}</PageTitle>
          
          <PostFormCard>
            <FormRow>
              <FormGroup>
                <Label className="H5">캠퍼스</Label>
                <Select
                  value={formData.campus}
                  onChange={(e) => handleInputChange('campus', e.target.value)}
                >
                  <option value="">캠퍼스 선택</option>
                  <option value="SEOUL">서울캠퍼스</option>
                  <option value="GLOBAL">글로벌캠퍼스</option>
                </Select>
                {errors.campus && <ErrorMessage>{errors.campus}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label className="H5">사용언어</Label>
                <Select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                >
                  <option value="">언어 선택</option>
                  <option value="한국어">한국어</option>
                  <option value="영어">영어</option>
                  <option value="일본어">이탈리아어</option>
                  <option value="중국어">중국어</option>
                  <option value="아랍어">아랍어</option>
                </Select>
                {errors.language && <ErrorMessage>{errors.language}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label className="H5">최대인원</Label>
                <Select
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)} 
                >
                  <option value="" disabled>최대 인원 선택</option>
                  <option value={2}>2명</option>
                  <option value={3}>3명</option>
                  <option value={4}>4명</option>
                  <option value={5}>5명</option>
                  <option value={6}>6명</option>
                  </Select>
                  {errors.capacity && <ErrorMessage>{errors.capacity}</ErrorMessage>}
                  </FormGroup>
            </FormRow>

            <FormGroup style={{ marginBottom: '2rem' }}>
              <Label className="H5">게시글 제목</Label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="예) 영어 회화 스터디 모집합니다"
                maxLength={100}
              />
              {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
            </FormGroup>

            <FormGroup style={{ marginBottom: '2rem' }}>
              <Label className="H5">모집 상세내용</Label>
              <p className="Body2" style={{ color: 'var(--gray-700)', margin: '0.5rem 0 1rem 0' }}>
                스터디의 목적, 진행방식 등을 자유롭게 작성해주세요.
              </p>
              <TextArea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder={`예) 스터디 목표와 진행방식

목표: 
진행일시: 
모집대상: 
기타사항:`}
              />
              {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
            </FormGroup>

            <SubmitButton 
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting || !userMe}
            >
              {isSubmitting 
              ? (isEditMode ? "게시글 수정 중..." : "게시글 작성 중...")
              : (isEditMode ? "수정완료" : "게시글 올리기")}
            </SubmitButton>
          </PostFormCard>
        </RightPanel>
      </ContentWrapper>
    </Container>
  );
};

export default StudyPost;