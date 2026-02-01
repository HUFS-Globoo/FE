import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { COUNTRY_ASSETS } from "../utils/countryAssets";

// import { ProfileBannerProps } from "../types/profile.types";

// 😭 임시 타입 (API 연동 시 위 주석 해제하고 아래 삭제)
type CountryCode = string;
type LanguageCode = string;
type Campus = 'SEOUL' | 'GLOBAL';

interface LanguagePair {
  native: LanguageCode[];
  learn: LanguageCode[];
}

type KeywordCategory = "PERSONALITY" | "HOBBY" | "TOPIC";

type KeywordItem = {
  id: number;
  category: KeywordCategory;
  name: string;
};
export interface ProfileBannerProps {
  userId: number;
  nickname: string;
  campus: Campus | null;
  country: CountryCode | null;
  mbti: string | null;
  profileImageUrl: string | null; 
  languages: LanguagePair;
  keywords: KeywordItem[];
  intro: string | null;
  onClick?: () => void;
}

const ContentContainer = styled.div<{ $iswhiteText?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: none;

  /* 화이트 텍스트일 때 전체 기본 글자색 톤을 흰색으로 맞춤*/
  color: ${({ $iswhiteText }) => ($iswhiteText ? "var(--white)" : "inherit")};
`;
//배경이미지 위에 블러처리(삭제함) + 그라데이션 추가(살짝)

// 피그마 기준: 510px × 250px(aspect-ratio로 설정)
// 왠지 모르겠는데 250px 로 하면 모서리가 이미지랑 안맞아서 220px으로 설정함
const CardWrapper = styled.div<{$banner: string}>`
  width: 100%;
  aspect-ratio: 510 / 220;
  max-width: 510px;
  height: auto;
  border-radius: 18.61px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background-image: url(${(props) => props.$banner});
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }

   &:hover ${ContentContainer} {
    background: rgba(255, 255, 255, 0.25);
  }

  @media (max-width: 1200px) {
    max-width: 100%;
  }
`;

// 상단 키워드 태그 영역 (성격, 취미, 주제 - 3개 표시, 카테고리 구분 없음(색))
const TopKeywordTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const TopKeywordChip = styled.span`
  padding: 6px 12px;
  border-radius: 16px;
  background-color: var(--white);
  backdrop-filter: blur(4px);
  color: var(--gray-700);
  white-space: nowrap;
`;



// 메인 콘텐츠 영역 (프로필 이미지 + 소개글)
const MainContent = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  align-items: flex-start;
`;

// 왼쪽: 프로필 이미지 + 닉네임 + MBTI
const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 82px;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--white);
  background-color: var(--white);
  object-fit: cover;
  flex-shrink: 0;
`;

// 닉네임은 한줄만 표시(더 넘으면 elipsis 처리)
const Nickname = styled.h3<{ $iswhiteText?: boolean }>`
  line-height: 1.4;
  color: ${props => props.$iswhiteText ? "var(--white)" : "var(--black)"};
  margin: 0;
  text-align: center;
  word-break: keep-all;
  display:-webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  max-width: 120px;
`;

const MBTIBadge = styled.div`
  padding: 0.125rem 0.5rem;
  box-sizing: border-box;
  border-radius: 50px;
  background-color: var(--white);
  color: var(--skyblue);
  white-space: nowrap;
`;

// 오른쪽: 캠퍼스/언어 태그 + 소개글
const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

const InfoTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const InfoChip = styled.span<{ $iswhiteText?: boolean }>`
  color: ${props => props.$iswhiteText ? "var(--white)" : "var(--gray-700)"};
`;

const IntroTitle = styled.p<{ $iswhiteText?: boolean }>`
  color: ${props => props.$iswhiteText ? "var(--white)" : "var(--black)"};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  max-width: 255px;
`;

const IntroContent = styled.p<{ $iswhiteText?: boolean }>`
  color: ${props => props.$iswhiteText ? "var(--white)" : "var(--gray-700)"};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  max-width: 255px
`;

export const getCleanImageUrl = (url: string | null, fallback: string) => {  
  if (!url || url.trim() === "") {
    return fallback;
  }

  const base = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

  // 절대경로면 그대로
  if (url.startsWith("http")) {
    return `${url}?t=${Date.now()}`;
  }

  // 상대경로면 BASE_URL 붙이기
  return `${base}/${url.replace(/^\//, "")}?t=${Date.now()}`;
};

//검정 배너 국가 조건 만들기(텍스트 색상 white 적용)
const WHITE_TEXT_COUNTRIES = new Set(["DE", "JP", "SA"]);

const ProfileBanner = ({ 
  userId,
  profileImageUrl,
  country,
  nickname,
  mbti,
  keywords,
  campus,
  languages,
  intro,
  onClick,
}: ProfileBannerProps) => {

  const validCountry = (country || "KR").toUpperCase();
  const isWhiteText = WHITE_TEXT_COUNTRIES.has(validCountry);
  const asset = COUNTRY_ASSETS[validCountry] || COUNTRY_ASSETS["KR"]; // 안전장치(앱 터짐 방지)

  const bannerSrc = asset.banner;
  const defaultCharacter = asset.character;

  const finalProfileImageUrl = profileImageUrl
  ? getCleanImageUrl(profileImageUrl, "")
  : defaultCharacter;

  const pickOne = (cat: "PERSONALITY" | "HOBBY" | "TOPIC") =>
  keywords.find((k) => k.category === cat)?.name;

const top3Keywords = [pickOne("PERSONALITY"), pickOne("HOBBY"), pickOne("TOPIC")]
  .filter(Boolean) as string[];



  const { t } = useTranslation();

  // 캠퍼스 표시 텍스트
  const campusText = campus === 'GLOBAL' 
    ? t("profile.campus.global") 
    : campus === 'SEOUL' 
    ? t("profile.campus.seoul") 
    : null;

  // 언어 텍스트 매핑
  const getLanguageName = (code: string): string => {
    return t(`profile.languages.${code}`) || code;
  };

  // native와 learn 언어를 모두 표시
  const nativeLanguages = languages.native.map(code => getLanguageName(code) || code);
  const learnLanguages = languages.learn.map(code => getLanguageName(code) || code);
  const allLanguages = [...nativeLanguages, ...learnLanguages];

  // ✅ 유저별 고정 랜덤 인덱스 (userId 기반)
const pickIndex = (id: number, length: number) => {
  if (length === 0) return 0;
  return Math.abs(id) % length;
};

// ✅ intro 파싱 (title/content 각각 따로 처리해야 함)
const rawLines = intro ? intro.split("\n") : [];
const parsedTitle = (rawLines[0] ?? "").trim();
// 2번째 줄부터는 content로 합치기 (없으면 "")
const parsedContent = rawLines.slice(1).join(" ").trim();

// ✅ fallback 텍스트 가져오기
const fallbackTitle = t("profile.bannerFallback.title", { nickname });

// returnObjects: true로 배열 가져오기
const fallbackContents = t("profile.bannerFallback.contents", {
  returnObjects: true,
}) as string[];

const fallbackContent =
  fallbackContents[pickIndex(userId, fallbackContents.length)] ?? "";

// ✅ 요구사항 반영:
// - title만 있으면: title 그대로 + content는 랜덤 fallback
// - content만 있으면: title은 fallback + content 그대로
// - 둘 다 없으면: title은 fallback + content는 랜덤 fallback
// - 둘 다 있으면: 둘 다 그대로
const finalIntroTitle = parsedTitle ? parsedTitle : fallbackTitle;
const finalIntroContent = parsedContent ? parsedContent : fallbackContent;


  return (
    <CardWrapper $banner={bannerSrc} onClick={onClick}>
      <ContentContainer $iswhiteText={isWhiteText}>
        <TopKeywordTags>
          {top3Keywords.map((keyword, index) => (
            <TopKeywordChip className="Button2" key={`keyword-${index}`}>
              #{keyword}
            </TopKeywordChip>
          ))}
        </TopKeywordTags>


        <MainContent>
          <LeftSection>
            <ProfileImage src={finalProfileImageUrl} alt="profile" />
            <Nickname className="H5" $iswhiteText={isWhiteText}>{nickname}</Nickname>
            {mbti && <MBTIBadge className="Button1">{mbti}</MBTIBadge>}
          </LeftSection>

          <RightSection>
            <InfoTags>
              {campusText && <InfoChip className="Button2" $iswhiteText={isWhiteText}>#{campusText}</InfoChip>}
              {allLanguages.map((lang, index) => (
                <InfoChip className="Button2" key={`lang-${index}`} $iswhiteText={isWhiteText}>#{lang}</InfoChip>
              ))}
            </InfoTags>
            <IntroTitle className="Button1" $iswhiteText={isWhiteText}>{finalIntroTitle}</IntroTitle>
            <IntroContent className="Body3" $iswhiteText={isWhiteText}>{finalIntroContent}</IntroContent>
          </RightSection>
        </MainContent>
      </ContentContainer>
    </CardWrapper>
  );
};


export default ProfileBanner;
