import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { StudyRequest } from "../../types/study.types";

// 현재 사용자 목데이터
const mockUserData = {
  id: 1,
  username: "홍길동",
  nickname: "멋쟁이",
  email: "likelion@hufs.ac.kr",
  profileImage: null,
  country: "KR"
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
  
  const [formData, setFormData] = useState<StudyRequest>({
    title: "",
    content: "",
    status: "모집중",
    campus: "",
    language: "",
    capacity: 10
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if (formData.capacity < 2 || formData.capacity > 50) {
      newErrors.capacity = "최대인원은 2~50명 사이여야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 😭 실제 API 호출 (POST /api/studies)
      // const response = await fetch('/api/studies', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${accessToken}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      // const result = await response.json();
      
      console.log("게시글 작성:", formData);
      alert(`"${formData.title}" 게시글이 성공적으로 작성되었습니다!`);
      navigate('/study');
      
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMyPostsClick = () => {
    navigate("/mypage");
  };

  const handleMyCommentsClick = () => {
    navigate("/mypage");
  };

  const handleBackToList = () => {
    navigate("/study");
  };

  const isFormValid = formData.title.trim() && 
                     formData.content.trim() && 
                     formData.campus && 
                     formData.language &&
                     formData.capacity >= 2 && 
                     formData.capacity <= 50;

  return (
    <Container>
      <ContentWrapper>
        <LeftPanel>
          <UserProfileCard>
            <ProfileImage 
              src={mockUserData.profileImage || "/placeholder-profile.png"} 
              alt="프로필"
            />
            <UserInfo>
              <UserName className="H4">
                {mockUserData.username} / {mockUserData.nickname}
              </UserName>
              <UserEmail className="Body2">
                {mockUserData.email}
              </UserEmail>
            </UserInfo>
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
{/*StudyPost에서는 게시글ㄹ 작성 버튼이 아닌, 스터디 목록 ㅓ튼으로 변경*/}
        <RightPanel>
          <PageTitle className="H1">게시글 작성</PageTitle>
          
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
                  <option value="일본어">일본어</option>
                  <option value="중국어">중국어</option>
                  <option value="아랍어">아랍어</option>
                </Select>
                {errors.language && <ErrorMessage>{errors.language}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label className="H5">최대인원</Label>
                <Input
                  type="number"
                  min="2"
                  max="50"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                  placeholder="2~50명"
                />
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
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "작성 중..." : "게시글 올리기"}
            </SubmitButton>
          </PostFormCard>
        </RightPanel>
      </ContentWrapper>
    </Container>
  );
};

export default StudyPost;