import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ProfileBanner from "../../components/ProfileBanner";
import HeaderImg from "../../assets/img-miniBoo.svg";
import axiosInstance from "../../../axiosInstance";

type Campus = "SEOUL" | "GLOBAL";
type LanguageCode = string;
type CountryCode = string;

interface Language {
  code: string;
  name: string;
}

export interface ProfileCardItem {
  userId: number;
  nickname: string;
  campus: Campus | null;
  country: CountryCode | null;
  mbti: string | null;
  profileImage: string | null;
  nativeLanguages: Language[];
  learnLanguages: Language[];
  keywords: { id: number; name: string }[];
  infoTitle: string | null;
  infoContent: string | null;
}

const PageContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 3rem 6.38rem;
  box-sizing: border-box;
  background-color: var(--gray-text-filled);
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
`;

const HeaderTextArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderImage = styled.img`
  width: 2.31794rem;
  height: 1.58788rem;
  object-fit: contain;
  padding-top: 0.8rem;
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

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--gray-400);
  padding-left: 2rem;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  padding-left: 2.38rem;
  padding-right: 2.38rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  box-sizing: border-box;
  margin: 0 auto;
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
  border: 1px solid ${(props) => (props.$active ? "var(--primary)" : "var(--gray-300)")};
  background-color: ${(props) => (props.$active ? "var(--primary)" : "var(--white)")};
  color: ${(props) => (props.$active ? "var(--white)" : "var(--primary)")};
  border-radius: 6px;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  transition: all 0.2s;
`;

const ContentTitle = styled.div`
  display: flex;
  gap: 1rem;
`

const ContentContainer = styled.div`

  border-radius: 0.75rem;
  border: 1px solid var(--gray, #E0E0E0);
  background: var(--white, #FFFEFB);
`

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

const ProfileList: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileCardItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const profilesPerPage = 8;
  const [filters, setFilters] = useState({
    campus: "",
    nativeLang: "",
    learnLang: "",
    personalityKeyword: "",
    hobbyKeyword: "",
    topicKeyword: "",
  });


  // 프로필 조회 (필터 적용)
  const fetchProfiles = async (page = 0) => {
    try {
      const params: any = { page, size: profilesPerPage };

      if (filters.campus) params.campus = filters.campus.toUpperCase();
      if (filters.nativeLang) params.nativeLang = filters.nativeLang;
      if (filters.learnLang) params.learnLang = filters.learnLang;

      const keywordArray = [
        filters.personalityKeyword,
        filters.hobbyKeyword,
        filters.topicKeyword,
      ]
        .filter((v) => v) 
        .map((v) => Number(v)); 

      if (keywordArray.length > 0) params.keywordId = keywordArray;

      const res = await axiosInstance.get("/api/profiles", { params });
      setProfiles(res.data.content);
      setTotalPages(res.data.totalPages);
      console.log("프로필 조회 성공:", res.data);
    } catch (error) {
      console.error("프로필 조회 실패:", error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleProfileClick = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchProfiles(0); 
  }, []);

  return (
    <PageContainer>
      <HeaderSection>
        <HeaderTextArea>
          <HeaderTitle className="H1">프로필 조회</HeaderTitle>
        </HeaderTextArea>
      </HeaderSection>

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
                value={filters.campus}
                onChange={(e) => handleFilterChange("campus", e.target.value)}
              >
                <option value="">
                  전체
                </option>
                <option value="global">글로벌캠퍼스</option>
                <option value="seoul">서울캠퍼스</option>
              </FilterSelect>
            </FilterContainer>

            <FilterContainer>
              <span>사용 언어</span>
              <FilterSelect
                value={filters.nativeLang}
                onChange={(e) => handleFilterChange("nativeLang", e.target.value)}
              >
                <option value="">
                  전체
                </option>
                <option value="Korean">한국어</option>
                <option value="English">영어</option>
                <option value="Chinese">중국어</option>
                <option value="Arabic">아랍어</option>
                <option value="Italian">이탈리아어</option>
              </FilterSelect>
            </FilterContainer>

            <FilterContainer>
              <span>성격 키워드</span>
              <FilterSelect
                value={filters.personalityKeyword}
                onChange={(e) => handleFilterChange("personalityKeyword", e.target.value)}
              >
                <option value="">
                  전체
                </option>
                <option value="1">활발한</option>
                <option value="2">솔직한</option>
                <option value="3">차분한</option>
                <option value="4">유쾌한</option>
                <option value="5">친절한</option>
                <option value="6">도전적</option>
                <option value="7">신중한</option>
                <option value="8">긍정적</option>
                <option value="9">냉정한</option>
                <option value="10">열정적인</option>
              </FilterSelect>
            </FilterContainer>

            <FilterContainer>
              <span>취미 키워드</span>
              <FilterSelect
                value={filters.hobbyKeyword}
                onChange={(e) => handleFilterChange("hobbyKeyword", e.target.value)}
              >
                <option value="">
                  전체
                </option>
                <option value="11">영화 시청</option>
                <option value="12">음악 감상</option>
                <option value="13">요리</option>
                <option value="14">독서</option>
                <option value="15">카페가기</option>
                <option value="16">운동</option>
                <option value="17">산책</option>
                <option value="18">사진 촬영</option>
                <option value="19">게임</option>
                <option value="20">여행</option>
              </FilterSelect>
            </FilterContainer>

            <FilterContainer>
              <span>주제 키워드</span>
              <FilterSelect
                value={filters.topicKeyword}
                onChange={(e) => handleFilterChange("topicKeyword", e.target.value)}
              >
                <option value="">
                  전체
                </option>
                <option value="21">음악</option>
                <option value="22">아이돌</option>
                <option value="23">패션/뷰티</option>
                <option value="24">스포츠</option>
                <option value="25">영화/드라마</option>
                <option value="26">공부</option>
                <option value="27">자기계발</option>
                <option value="28">책</option>
                <option value="29">환경</option>
                <option value="30">동물</option>
              </FilterSelect>
            </FilterContainer>

          </FilterWraaper>

          <SearchButton onClick={() => fetchProfiles(0)}>조회</SearchButton>

        </FilterPlaceholder>
      </FilterSection>


      <ContentContainer>
        <SectionTitle className="H4">친구들의 프로필 보기</SectionTitle>
        <ProfileGrid>
          {profiles.map((profile) => (
            <ProfileBanner
              key={profile.userId}
              userId={profile.userId}
              nickname={profile.nickname}
              campus={profile.campus}
              country={profile.country}
              mbti={profile.mbti}
              profileImage={profile.profileImage}
              languages={{
                native: profile.nativeLanguages.map((l) => l.code),
                learn: profile.learnLanguages.map((l) => l.code),
              }}
              keywords={profile.keywords.map((k) => k.name)}
              intro={
                profile.infoTitle && profile.infoContent
                  ? `${profile.infoTitle}\n${profile.infoContent}`
                  : ""
              }
              onClick={() => handleProfileClick(profile.userId)}
            />
          ))}
        </ProfileGrid>
      </ContentContainer>

      {totalPages > 1 && (
        <PaginationContainer>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton
              key={i}
              $active={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </PageButton>
          ))}
        </PaginationContainer>
      )}
    </PageContainer>
  );
};

export default ProfileList;
