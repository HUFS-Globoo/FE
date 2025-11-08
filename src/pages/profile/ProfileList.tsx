import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ProfileBanner from '../../components/ProfileBanner';
import HeaderImg from "../../assets/img-miniBoo.svg";

// import { ProfileCardItem, ProfileListResponse } from '../../types/profile.types';

// 😭 임시 타입 (API 연동 시 위 주석 해제하고 아래 삭제)
type Campus = 'SEOUL' | 'GLOBAL';
type LanguageCode = string;
type CountryCode = string;

interface LanguagePair {
  native: LanguageCode[];
  learn: LanguageCode[];
}

export interface ProfileCardItem {
  userId: number;
  nickname: string;
  campus: Campus | null;
  country: CountryCode | null;
  mbti: string | null;
  profileImage: string | null;
  languages: LanguagePair;
  keywords: string[];
  intro: string | null;
}

// 목데이터 - API 명세서 형식 (ProfileCardRes)
// 😭 API 연동 시 삭제하기
const BASE_PROFILES: ProfileCardItem[] = [
  { 
    userId: 1, 
    nickname: '왕길동쓰', 
    campus: 'GLOBAL', 
    country: 'KR', 
    languages: { native: ['ko'], learn: ['en'] },
    mbti: 'ENFP', 
    keywords: ['긍정적', '운동', '음악', '여행'], 
    intro: '"저는 운동과 음악을 좋아하는 학생인데 저와 비슷한 분 찾아봐요 ㅎㅎ"\n멋사 친구들과 함께 개발하는 걸 좋아하고, 번개 모임도 대환영합니다 ㅎㅎ 잘 부탁드려요!', 
    profileImage: null 
  },
  { 
    userId: 2, 
    nickname: 'Justin M.', 
    campus: 'SEOUL', 
    country: 'US', 
    languages: { native: ['en'], learn: ['ko'] },
    mbti: 'ISTJ', 
    keywords: ['개발', '독서', '여행'], 
    intro: '"저는 운동과 음악을 좋아하는 학생인데 저와 비슷한 분 찾아봐요 ㅎㅎ"\nA highly motivated individual looking for a study buddy. I enjoy learning new languages and meeting people from different cultures.', 
    profileImage: null 
  },
  { 
    userId: 3, 
    nickname: 'Chiara R.', 
    campus: 'GLOBAL', 
    country: 'IT', 
    languages: { native: ['it'], learn: ['ko', 'en'] },
    mbti: 'INFP', 
    keywords: ['요리', '미술', '커피'], 
    intro: '"저는 운동과 음악을 좋아하는 학생인데 저와 비슷한 분 찾아봐요 ㅎㅎ"\nCiao! 이탈리아 문화에 관심 있는 친구를 찾아요. 함께 언어 교환하며 문화도 나눠요.', 
    profileImage: null 
  },
  { 
    userId: 4, 
    nickname: 'Ramses', 
    campus: 'SEOUL', 
    country: 'EG', 
    languages: { native: ['ar'], learn: ['ko'] },
    mbti: 'ENTP', 
    keywords: ['토론', '역사', '여행'], 
    intro: '"저는 운동과 음악을 좋아하는 학생인데 저와 비슷한 분 찾아봐요 ㅎㅎ"\n한국어 공부에 열심인 이집트 학생입니다. 환영합니다! 역사와 문화 이야기를 나누고 싶어요.', 
    profileImage: null 
  },
  { 
    userId: 5, 
    nickname: 'Li Wei', 
    campus: 'GLOBAL', 
    country: 'CN', 
    languages: { native: ['zh'], learn: ['ko', 'en'] },
    mbti: 'ENFJ', 
    keywords: ['음식', '여행', '사진'], 
    intro: '"저는 운동과 음악을 좋아하는 학생인데 저와 비슷한 분 찾아봐요 ㅎㅎ"\n중국 문화와 한국 문화를 나누고 싶어요! 맛있는 음식과 여행 이야기를 좋아합니다.', 
    profileImage: null 
  },
];

const DUMMY_PROFILES: ProfileCardItem[] = [
  ...BASE_PROFILES,
  ...Array(3).fill(BASE_PROFILES).flat().map((p, i) => ({
    ...p, 
    userId: p.userId + i + 5,
    nickname: `${p.nickname} (${i+1})`
  }))
];

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`;

// 헤더 영역: 텍스트와 이미지를 가로로 배치
const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 30px;
  gap: 20px;
`;

// 왼쪽: 제목 + 부제목
const HeaderTextArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

// 오른쪽: 이미지
const HeaderImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  flex-shrink: 
  `;

const HeaderTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 8px;
`;

const SubText = styled.p`
  font-size: 1rem;
  color: var(--gray-600);
  margin-bottom: 30px;
`;

const FilterSection = styled.div`
  background-color: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterPlaceholder = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  color: var(--gray-500);
  font-size: 0.9rem;

  span {
    padding: 8px 12px;
    background-color: var(--gray-100);
    border-radius: 8px;
  }
`;

const SearchButton = styled.button`
  padding: 10px 24px;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--gray-400);
  margin-bottom: 20px;
`;

// 🔥 핵심 수정: 한 행에 정확히 2개씩 배치
const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 항상 2열 */
  gap: 24px; /* 25px → 24px */
  margin-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 모바일에서는 1열*/
    gap: 20px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  min-width: 36px;
  border: 1px solid ${props => props.$active ? 'var(--primary)' : 'var(--gray-300)'};
  background-color: ${props => props.$active ? 'var(--primary)' : 'var(--white)'};
  color: ${props => props.$active ? 'var(--white)' : 'var(--primary)'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: ${props => props.$active ? '600' : '400'};
  transition: all 0.2s;
`;

const ProfileList: React.FC = () => {
  const navigate = useNavigate();
  const [profiles] = useState<ProfileCardItem[]>(DUMMY_PROFILES);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 8; // 한 페이지에 8개 (2열 × 4행)

  // 페이지네이션 계산(필요없으면 빼기)
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const totalPages = Math.ceil(profiles.length / profilesPerPage);

  const handleProfileClick = (userId: number) => {
    navigate(`/profile/${userId}`); // 프로필 상세 페이지로 이동
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageContainer>
      <HeaderSection>
        <HeaderImage src={HeaderImg} alt="프로필 조회" />        
        <HeaderTextArea>
          <HeaderTitle className="H5">프로필 조회</HeaderTitle>
          <SubText className="H4">나와 Fit이 맞는 친구 찾기</SubText>
        </HeaderTextArea>
      </HeaderSection>

      <FilterSection>
        <FilterPlaceholder className='H5'>
          <span>캠퍼스</span>
          <span>사용 언어</span>
          <span>키워드</span>
        </FilterPlaceholder>
        <SearchButton>조회</SearchButton>
      </FilterSection>

      <SectionTitle className='H4'>친구들의 프로필 보기</SectionTitle>

      <ProfileGrid>
        {currentProfiles.map((profile) => (
          <ProfileBanner 
            key={profile.userId}
            {...profile}
            onClick={() => handleProfileClick(profile.userId)}
          />
        ))}
      </ProfileGrid>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </PageButton>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <PageButton
              key={pageNum}
              $active={currentPage === pageNum}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </PageButton>
          ))}
          
          <PageButton 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </PageButton>
        </PaginationContainer>
      )}
    </PageContainer>
  );
};

export default ProfileList;