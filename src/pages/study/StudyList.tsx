import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import StudyCard from "../../components/StudyCard";
import type { StudyItem, StudyFilter, StudyListResponse } from "../../types/study.types";
import { getStudies } from "../../api/studyAPI";
import type {UserMeResponse } from "../../types/mypage&profile.types";
import axiosInstance from "../../../axiosInstance";
import HeaderImg from "../../assets/img-miniBoo.svg";

import AmericaProfileImg from "../../assets/img-profile1-America.svg";
import KoreaProfileImg from "../../assets/img-profile1-Korea.svg";
import ItalyProfileImg from "../../assets/img-profile1-Italy.svg";
import EgyptProfileImg from "../../assets/img-profile1-Egypt.svg";
import ChinaProfileImg from "../../assets/img-profile1-China.svg";

const countryCharacterImages: { [key: string]: string } = {
  US: AmericaProfileImg,
  KR: KoreaProfileImg,
  IT: ItalyProfileImg,
  EG: EgyptProfileImg,
  CN: ChinaProfileImg,
};

const initialFilters: StudyFilter = {
  page: 0,
  campus: undefined,
  language: undefined,
  status: undefined,
  // keyword: '', // 필요시 추가(확인ㄴ 필요)
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



const StudyListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContentTitle = styled.div`
  display: flex;
  gap: 1rem;
`
const HeaderTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 8px;
`;

const SubText = styled.p`
  font-size: 1rem;
  color: var(--gray-600);
`;

const FilterSection = styled.div`
  background-color: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
`;

const FilterPlaceholder = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  color: var(--black);
  font-size: 0.9rem;
  justify-content: space-between;

  span {
    padding: 8px 12px;
    background-color: var(--gray-100);
    border-radius: 8px;
  }
`;
const SearchButton = styled.button`
  padding: 10px 24px;
  background-color: var(--skyblue);
  color: var(--white);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary);
  }
`;

const FilterWraaper = styled.div`
  display: flex;
  gap: 1.5rem;
`

const FilterContainer = styled.div`
  width: 8.38rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`

const FilterSelect = styled.select`
  width: 100%;
  border: none;
  font-family: 'SchoolSafetyRoundedSmile';
  cursor: pointer;

  &:focus {

    outline: none;
  }

  &:hover {
    border-color: var(--Primary-400);
  }

  &:disabled {
    background-color: var(--gray-light);
    color: var(--gray-dark);
    cursor: not-allowed;
  }

  option {
    color: var(--black);
    background: var(--white);
  }
`

const HeaderImage = styled.img`
  width: 2.31794rem;
  height: 1.58788rem;
  object-fit: contain;
  padding-top: 0.8rem;
`;

const StudyList = () => {
  const navigate = useNavigate();
  const [studies, setStudies] = useState<StudyItem[]>([]); // API 응답의 실제 목록 데이터
  const [filters, setFilters] = useState<StudyFilter>(initialFilters); // 필터 및 페이지 상태
  const [userMe, setUserMe] = useState<UserMeResponse | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true); // 
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  const fetchStudies = useCallback(async (customFilter?: StudyFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: any = await getStudies(filters); 
      
      setStudies(response.data || []); 
      
      setTotalPages(1); 
      
    } catch (err) {
      console.error('스터디 목록 조회 실패:', err);
      const status = (err as any)?.response?.status;
      setError(`목록을 불러오지 못했습니다. (오류 코드: ${status || 'API 통신 오류'})`);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchUserMe = async () => {
    try {
      setIsProfileLoading(true);
      // 내 정보 조회 API 호출
      const res = await axiosInstance.get('/api/users/me'); 
      const data: UserMeResponse = res.data; 
      
      let cleanedUrl = data.profileImageUrl;
        if (cleanedUrl) {
          cleanedUrl = cleanedUrl
            .replace(/([^:]\/)\/+/g, "$1")
            + `?t=${Date.now()}`;         
        }

    setUserMe({
      ...data,
      profileImageUrl: cleanedUrl ?? null,
    });
    } catch (error) {
      console.error("내 정보 조회 실패 (로그인 필요):", error);
      setUserMe(null); 
    } finally {
      setIsProfileLoading(false);
    }
  };

useEffect(() => {
  fetchStudies();
  fetchUserMe();
}, []);


  const handleFilterChange = (key: keyof Omit<StudyFilter, 'page' | 'size'>, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value, // '전체' 선택 시 undefined로 설정
      page: 0, 
    }));
  };

  const handleSearch = () => {
    console.log("필터 적용 조회:", filters);
    fetchStudies(filters); 
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };


  const handleStudyClick = (studyId: number) => {
    navigate(`/study/${studyId}`);
  };

  const handleMyPostsClick = () => {
    navigate("/mypage");
  };

  const handleMyCommentsClick = () => {
    navigate("/mypage", { state: { activeTab: "comments" } });
  };

  const handleCreatePostClick = () => {
    navigate("/study/post");
  };


  if (isLoading || isProfileLoading) {
    return (
      <Container>
        <ContentWrapper>
          <RightPanel>
            <PageTitle className="H1">스터디 모집</PageTitle>
            <div style={{ padding: '4rem', textAlign: 'center' }}>데이터를 불러오는 중입니다...</div>
          </RightPanel>
        </ContentWrapper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ContentWrapper>
          <RightPanel>
            <PageTitle className="H1">스터디 모집</PageTitle>
            <div style={{ padding: '4rem', textAlign: 'center', color: 'red' }}>{error}</div>
          </RightPanel>
        </ContentWrapper>
      </Container>
    );
  }


  return (
    <Container>
      <ContentWrapper>
        <LeftPanel>
          {userMe ? (
          <UserProfileCard>
            <ProfileImage 
              src={
                userMe.profileImageUrl ||
                (userMe.country && countryCharacterImages[userMe.country]) ||
                  KoreaProfileImg
              }
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
               게시글 작성
              </ActionButton>
            </ButtonGroup>
          </UserProfileCard>
          ) : (
            <UserProfileCard>
              <div className="Body1">로그인 후 내 정보를 볼 수 있습니다.</div>
            </UserProfileCard>
          )}
        </LeftPanel>

        <RightPanel>
          <PageTitle className="H1">스터디 모집</PageTitle>
          <FilterSection>
        <ContentTitle>
          <HeaderImage src={HeaderImg} alt="프로필 조회" />
          <SubText className="H4">나와 Fit이 맞는 친구 찾기</SubText>
        </ContentTitle>

        <FilterPlaceholder className="H5">
          <FilterWraaper>

          <FilterContainer>
            <span>캠퍼스</span>
            <FilterSelect
              value={filters.campus ?? ""}
              onChange={(e) => handleFilterChange("campus", e.target.value)}
            >
              <option value="">전체</option>
              <option value="글로벌">글로벌캠퍼스</option>
              <option value="서울">서울캠퍼스</option>
            </FilterSelect>
          </FilterContainer>

          <FilterContainer>
            <span>사용 언어</span>
            <FilterSelect
              value={filters.language ?? ""}  
              onChange={(e) => handleFilterChange("language", e.target.value)}
            >
              <option value="">전체</option>  
              <option value="한국어">한국어</option>
              <option value="영어">영어</option>
              <option value="중국어">중국어</option>
              <option value="아랍어">아랍어</option>
              <option value="이탈리아어">이탈리아어</option>
              ...
            </FilterSelect>
          </FilterContainer>

            <FilterContainer>
              <span>모집중/마감</span>
              <FilterSelect
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">전체</option>
                <option value="모집중">모집중</option>
                <option value="마감">모집마감</option>
              </FilterSelect>
            </FilterContainer>

          </FilterWraaper>

          <SearchButton onClick={handleSearch} >조회</SearchButton>

        </FilterPlaceholder>
      </FilterSection>



          <StudyListContainer>
            {studies.length === 0 && !isLoading ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>검색 결과가 없습니다.</div>
            ) : (
              studies.map((study) => (
                <StudyCard 
                  key={study.id} 
                  study={study}
                  onClick={() => handleStudyClick(study.id)}
                />
              ))
            )}
          </StudyListContainer>

          {totalPages > 1 && ( 
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
{/*토탈 페이지가 1이면 렌더링 안하게끔 설정함*/}
        </RightPanel>
      </ContentWrapper>
    </Container>
  );
};

export default StudyList;


const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
      <SearchButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>이전</SearchButton>
      <span>페이지 {currentPage + 1} / {totalPages}</span>
      <SearchButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>다음</SearchButton>
    </div>
  );
};