import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import StudyCard from "../../components/StudyCard";
import type { StudyCardItem, StudyFilterParams } from "../../types/study.types";

// 목데이터 - 나중에 API로 교체 (새로운 API 구조에 맞춤)
const mockStudyData: StudyCardItem[] = [
  {
    id: 1,
    title: "2025-2 영어 회화 스터디 참여자 모집합니다.(비대면 가능)",
    content: "영어 회화 실력 향상을 위한 스터디입니다...",
    status: "모집중",
    campus: "GLOBAL", 
    language: "영어", 
    capacity: 15,
    createdAt: "2025-10-20T00:00:00Z",
    updatedAt: "2025-10-20T00:00:00Z",
    // UI용 추가 정보
    currentParticipants: 3,
    authorId: 1,
    authorNickname: "홍길동",
    authorProfileImage: null,
    authorCountry: "KR",
    tags: ["영어", "회화"]
  },
  {
    id: 2,
    title: "Join our free talking class(due to January)",
    content: "Free English conversation class...",
    status: "마감",
    campus: "GLOBAL",
    language: "영어",
    capacity: 15,
    createdAt: "2025-10-18T00:00:00Z",
    updatedAt: "2025-10-18T00:00:00Z",
    currentParticipants: 15,
    authorId: 2,
    authorNickname: "Justin M.",
    authorProfileImage: null,
    authorCountry: "US",
    tags: ["영어"]
  },
  {
    id: 3,
    title: "중인대상과 함께 배우는 아랍어 교실",
    content: "아랍어를 함께 배워봅시다...",
    status: "모집중",
    campus: "GLOBAL",
    language: "아랍어",
    capacity: 15,
    createdAt: "2025-10-15T00:00:00Z",
    updatedAt: "2025-10-15T00:00:00Z",
    currentParticipants: 11,
    authorId: 3,
    authorNickname: "Ramses",
    authorProfileImage: null,
    authorCountry: "EG",
    tags: ["아랍어"]
  },
  {
    id: 4,
    title: "같이 소통해요(간단한 한국어 회화를 배우고 싶어요)",
    content: "한국어 회화를 배우고 싶습니다...",
    status: "모집중",
    campus: "GLOBAL",
    language: "한국어",
    capacity: 13,
    createdAt: "2025-10-12T00:00:00Z",
    updatedAt: "2025-10-12T00:00:00Z",
    currentParticipants: 3,
    authorId: 4,
    authorNickname: "Li Wei",
    authorProfileImage: null,
    authorCountry: "CN",
    tags: ["한국어", "중국어"]
  },
  {
    id: 5,
    title: "2025-2 영어 회화 스터디 참여자 모집합니다.(비대면 가능)",
    content: "추가 영어 스터디 모집...",
    status: "모집중",
    campus: "SEOUL",
    language: "영어",
    capacity: 15,
    createdAt: "2025-10-10T00:00:00Z",
    updatedAt: "2025-10-10T00:00:00Z",
    currentParticipants: 3,
    authorId: 1,
    authorNickname: "홍길동",
    authorProfileImage: null,
    authorCountry: "KR",
    tags: ["영어", "회화"]
  }
];

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

// 사용자 프로필 카드 (좌측)
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

// 필터 
const FilterSection = styled.div`
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const FilterText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--skyblue);
`;

const FilterTitle = styled.span`
  color: var(--black);
  margin-right: 1rem;
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterDropdown = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid var(--gray);
  border-radius: 0.5rem;
  background-color: var(--white);
  color: var(--gray-700);
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--skyblue);
  color: var(--white);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--primary);
  }
`;

const StudyListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StudyList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<StudyFilterParams>({
    campus: undefined,
    language: undefined,
    status: undefined
  });
  
  const [filteredStudies, setFilteredStudies] = useState<StudyCardItem[]>(mockStudyData);

  const handleFilterChange = (key: keyof StudyFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    // 필터링 로직 (나중에 API 호출로 교체)
    let filtered = mockStudyData;

    if (filters.campus && filters.campus !== '') {
      filtered = filtered.filter(study => study.campus === filters.campus);
    }

    if (filters.status && filters.status !== '') {
      filtered = filtered.filter(study => study.status === filters.status);
    }

    if (filters.language && filters.language !== '') {
      filtered = filtered.filter(study => study.language === filters.language);
    }

    setFilteredStudies(filtered);
  };

  const handleStudyClick = (studyId: number) => {
    navigate(`/study/${studyId}`);
  };

  const handleMyPostsClick = () => {
    navigate("/mypage");
  };

  const handleMyCommentsClick = () => {
    navigate("/mypage");
  };

  const handleCreatePostClick = () => {
    navigate("/study/create");
  };

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
                onClick={handleCreatePostClick}
              >
                📝 게시글 작성
              </ActionButton>
            </ButtonGroup>
          </UserProfileCard>
        </LeftPanel>

        <RightPanel>
          <PageTitle className="H1">스터디 모집</PageTitle>
          
          <FilterSection>
            <FilterText>
              <FilterTitle className="H5">📚 나와 Fit이 맞는 스터디 찾기</FilterTitle>
            </FilterText>
            
            <FilterOptions>
              <div>
                <span className="Body2">캠퍼스</span>
                <FilterDropdown 
                  value={filters.campus || ''}
                  onChange={(e) => handleFilterChange('campus', e.target.value)}
                >
                  <option value="">전체</option>
                  <option value="SEOUL">서울캠퍼스</option>
                  <option value="GLOBAL">글로벌캠퍼스</option>
                </FilterDropdown>
              </div>
              
              <div>
                <span className="Body2">사용 언어</span>
                <FilterDropdown 
                  value={filters.language || ''}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                >
                  <option value="">전체</option>
                  <option value="한국어">한국어</option>
                  <option value="영어">영어</option>
                  <option value="일본어">일본어</option>
                  <option value="중국어">중국어</option>
                  <option value="아랍어">아랍어</option>
                </FilterDropdown>
              </div>
              
              <div>
                <span className="Body2">모집중 / 마감</span>
                <FilterDropdown 
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">전체</option>
                  <option value="모집중">모집중</option>
                  <option value="마감">마감</option>
                </FilterDropdown>
              </div>
              
              <SearchButton className="Button1" onClick={handleSearch}>
                조회
              </SearchButton>
            </FilterOptions>
          </FilterSection>

          <StudyListContainer>
            {filteredStudies.map((study) => (
              <StudyCard 
                key={study.id} 
                study={study}
                onClick={() => handleStudyClick(study.id)}
              />
            ))}
          </StudyListContainer>
        </RightPanel>
      </ContentWrapper>
    </Container>
  );
};

export default StudyList;