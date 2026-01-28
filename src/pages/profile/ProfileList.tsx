import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

type KeywordCategory = "PERSONALITY" | "HOBBY" | "TOPIC";

type KeywordItem = {
  id: number;
  category: KeywordCategory;
  name: string;
};
export interface ProfileCardItem {
  userId: number;
  nickname: string;
  campus: Campus | null;
  country: CountryCode | null;
  mbti: string | null;
  profileImageUrl: string | null;
  nativeLanguages: Language[];
  learnLanguages: Language[];
  keywords: KeywordItem[];
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

const FilterPlaceholder = styled.div<{ $isEnglish?: boolean }>`
  display: flex;
  gap: 1.5rem;
  align-items: ${({ $isEnglish }) => ($isEnglish ? "flex-start" : "center")};
  color: var(--black);
  font-size: 0.9rem;
  justify-content: space-between;
  flex-wrap: ${({ $isEnglish }) => ($isEnglish ? "wrap" : "nowrap")};

  span {
    padding: 8px 12px;
    background-color: var(--gray-100);
    border-radius: 8px;
    white-space: ${({ $isEnglish }) => ($isEnglish ? "normal" : "nowrap")};
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

const FilterWraaper = styled.div<{ $isEnglish?: boolean }>`
  display: flex;
  gap: 1.5rem;
  flex-wrap: ${({ $isEnglish }) => ($isEnglish ? "wrap" : "nowrap")};
  flex: 1;
`

const FilterContainer = styled.div<{ $isEnglish?: boolean }>`
  min-width: ${({ $isEnglish }) => ($isEnglish ? "10rem" : "8.38rem")};
  width: ${({ $isEnglish }) => ($isEnglish ? "auto" : "8.38rem")};
  flex: ${({ $isEnglish }) => ($isEnglish ? "1 1 auto" : "0 0 auto")};
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isEnglish = i18n.language === 'en';
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

  const currentUserIdRaw = localStorage.getItem("userId");
  const currentUserId = currentUserIdRaw ? Number(currentUserIdRaw) : null;
  
  const useDefaultProfile =
    localStorage.getItem("useDefaultProfileImage") === "true";


  // 프로필 조회 (필터 적용)l  
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
    if (currentUserId !== null && userId === currentUserId) {
      navigate("/mypage");
      return;
    }
    navigate(`/profile/${userId}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchProfiles(currentPage);
  }, [currentPage]);

  return (
    <PageContainer>
      <HeaderSection>
        <HeaderTextArea>
          <HeaderTitle className="H1">{t("profile.list.title")}</HeaderTitle>
        </HeaderTextArea>
      </HeaderSection>

      <FilterSection>
        <ContentTitle>
          <HeaderImage src={HeaderImg} alt={t("profile.list.title")} />
          <SubText className="H4">{t("profile.list.subtitle")}</SubText>
        </ContentTitle>

        <FilterPlaceholder className="H5" $isEnglish={isEnglish}>
          <FilterWraaper $isEnglish={isEnglish}>

            <FilterContainer $isEnglish={isEnglish}>
              <span>{t("profile.list.filters.campus")}</span>
              <FilterSelect
                value={filters.campus}
                onChange={(e) => handleFilterChange("campus", e.target.value)}
              >
                <option value="">
                  {t("profile.list.filters.all")}
                </option>
                <option value="global">{t("profile.list.filters.global")}</option>
                <option value="seoul">{t("profile.list.filters.seoul")}</option>
              </FilterSelect>
            </FilterContainer>

            <FilterContainer $isEnglish={isEnglish}>
              <span>{t("profile.list.filters.nativeLanguage")}</span>
              <FilterSelect
                value={filters.nativeLang}
                onChange={(e) => handleFilterChange("nativeLang", e.target.value)}
              >
                <option value="">
                  {t("profile.list.filters.all")}
                </option>
                <option value="Korean">{t("profile.list.languages.korean")}</option>
                <option value="English">{t("profile.list.languages.english")}</option>
                <option value="Chinese">{t("profile.list.languages.chinese")}</option>
                <option value="Arabic">{t("profile.list.languages.arabic")}</option>
                <option value="Italian">{t("profile.list.languages.italian")}</option>
              </FilterSelect>
            </FilterContainer>

            <FilterContainer $isEnglish={isEnglish}>
              <span>{t("profile.list.filters.personalityKeyword")}</span>
              <FilterSelect
                value={filters.personalityKeyword}
                onChange={(e) => handleFilterChange("personalityKeyword", e.target.value)}
              >
                <option value="">
                  {t("profile.list.filters.all")}
                </option>
                <option value="1">{t("profile.list.keywords.personality.1")}</option>
                <option value="2">{t("profile.list.keywords.personality.2")}</option>
                <option value="3">{t("profile.list.keywords.personality.3")}</option>
                <option value="4">{t("profile.list.keywords.personality.4")}</option>
                <option value="5">{t("profile.list.keywords.personality.5")}</option>
                <option value="6">{t("profile.list.keywords.personality.6")}</option>
                <option value="7">{t("profile.list.keywords.personality.7")}</option>
                <option value="8">{t("profile.list.keywords.personality.8")}</option>
                <option value="9">{t("profile.list.keywords.personality.9")}</option>
                <option value="10">{t("profile.list.keywords.personality.10")}</option>
              </FilterSelect>
            </FilterContainer>

            <FilterContainer $isEnglish={isEnglish}>
              <span>{t("profile.list.filters.hobbyKeyword")}</span>
              <FilterSelect
                value={filters.hobbyKeyword}
                onChange={(e) => handleFilterChange("hobbyKeyword", e.target.value)}
              >
                <option value="">
                  {t("profile.list.filters.all")}
                </option>
                <option value="11">{t("profile.list.keywords.hobby.11")}</option>
                <option value="12">{t("profile.list.keywords.hobby.12")}</option>
                <option value="13">{t("profile.list.keywords.hobby.13")}</option>
                <option value="14">{t("profile.list.keywords.hobby.14")}</option>
                <option value="15">{t("profile.list.keywords.hobby.15")}</option>
                <option value="16">{t("profile.list.keywords.hobby.16")}</option>
                <option value="17">{t("profile.list.keywords.hobby.17")}</option>
                <option value="18">{t("profile.list.keywords.hobby.18")}</option>
                <option value="19">{t("profile.list.keywords.hobby.19")}</option>
                <option value="20">{t("profile.list.keywords.hobby.20")}</option>
              </FilterSelect>
            </FilterContainer>

            <FilterContainer $isEnglish={isEnglish}>
              <span>{t("profile.list.filters.topicKeyword")}</span>
              <FilterSelect
                value={filters.topicKeyword}
                onChange={(e) => handleFilterChange("topicKeyword", e.target.value)}
              >
                <option value="">
                  {t("profile.list.filters.all")}
                </option>
                <option value="21">{t("profile.list.keywords.topic.21")}</option>
                <option value="22">{t("profile.list.keywords.topic.22")}</option>
                <option value="23">{t("profile.list.keywords.topic.23")}</option>
                <option value="24">{t("profile.list.keywords.topic.24")}</option>
                <option value="25">{t("profile.list.keywords.topic.25")}</option>
                <option value="26">{t("profile.list.keywords.topic.26")}</option>
                <option value="27">{t("profile.list.keywords.topic.27")}</option>
                <option value="28">{t("profile.list.keywords.topic.28")}</option>
                <option value="29">{t("profile.list.keywords.topic.29")}</option>
                <option value="30">{t("profile.list.keywords.topic.30")}</option>
              </FilterSelect>
            </FilterContainer>

          </FilterWraaper>

          <SearchButton onClick={() => fetchProfiles(0)}>{t("profile.list.filters.search")}</SearchButton>

        </FilterPlaceholder>
      </FilterSection>


      <ContentContainer>
        <SectionTitle className="H4">{t("profile.list.sectionTitle")}</SectionTitle>
        <ProfileGrid>
  {profiles.map((profile) => {
    let effectiveProfileImageUrl = profile.profileImageUrl;
    if (effectiveProfileImageUrl) {
      effectiveProfileImageUrl = effectiveProfileImageUrl.replace(
        /([^:]\/)\/+/g,
        "$1"
      );
    }
    if (profile.userId === currentUserId && useDefaultProfile) {
      effectiveProfileImageUrl = null;
    }

    return (
      <ProfileBanner
        key={profile.userId}
        userId={profile.userId}
        nickname={profile.nickname}
        campus={profile.campus}
        country={profile.country}
        mbti={profile.mbti}
        profileImageUrl={effectiveProfileImageUrl}
        languages={{
          native: profile.nativeLanguages.map((l) => l.code),
          learn: profile.learnLanguages.map((l) => l.code),
        }}
        keywords={profile.keywords}
        intro={
          profile.infoTitle && profile.infoContent
            ? `${profile.infoTitle}\n${profile.infoContent}`
            : ""
        }
        onClick={() => handleProfileClick(profile.userId)}
      />
    );
  })}
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
