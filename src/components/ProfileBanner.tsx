import styled from "styled-components";
import AmericaBannerImg from "../assets/img-banner_US.svg";
import KoreaBannerImg from "../assets/img-banner_KR.svg";
import ItalyBannerImg from "../assets/img-banner_IT.svg";
import EgyptBannerImg from "../assets/img-banner_EG.svg";
import ChinaBannerImg from "../assets/img-banner_CN.svg";
import AmericaProfileImg from "../assets/img-profile1-America.svg";
import KoreaProfileImg from "../assets/img-profile1-Korea.svg";
import ItalyProfileImg from "../assets/img-profile1-Italy.svg";
import EgyptProfileImg from "../assets/img-profile1-Egypt.svg";
import ChinaProfileImg from "../assets/img-profile1-China.svg";

// import { ProfileBannerProps } from "../types/profile.types";

// 😭 임시 타입 (API 연동 시 위 주석 해제하고 아래 삭제)
type CountryCode = string;
type LanguageCode = string;
type Campus = 'SEOUL' | 'GLOBAL';

interface LanguagePair {
  native: LanguageCode[];
  learn: LanguageCode[];
}

export interface ProfileBannerProps {
  userId: number;
  nickname: string;
  campus: Campus | null;
  country: CountryCode | null;
  mbti: string | null;
  profileImage: string | null;
  languages: LanguagePair;
  keywords: string[];
  intro: string | null;
  onClick?: () => void;
}

// 국가별 캐릭터 이미지 매핑
const countryCharacterImages: { [key: CountryCode]: string } = {
  US: AmericaProfileImg,
  KR: KoreaProfileImg,
  IT: ItalyProfileImg,
  EG: EgyptProfileImg,
  CN: ChinaProfileImg,
};

// 국가별 배너 이미지 매핑
const bannerWrapper: { [key: CountryCode]: string } = {
  US: AmericaBannerImg,
  KR: KoreaBannerImg,
  IT: ItalyBannerImg,
  EG: EgyptBannerImg,
  CN: ChinaBannerImg,
};

// 피그마 기준: 510px × 250px(aspect-ratio로 설정)
// 왠지 모르겠는데 250px 로 하면 모서리가 이미지랑 안맞아서 220px으로 설정함
const CardWrapper = styled.div<{ $country: CountryCode }>`
  width: 100%;
  aspect-ratio: 510 / 220;
  max-width: 510px;
  height: auto;
  border-radius: 18.61px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background-image: url(${props => bannerWrapper[props.$country] || KoreaBannerImg});
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 1200px) {
    max-width: 100%;
  }
`;

const ContentContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(0.5px);
`;
//배경이미지 위에 블러처리 + 그라데이션 추가(살짝)

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
const Nickname = styled.h3`
  line-height: 1.4;
  color: var(--black);
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
  padding: 4px 2px;
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

const InfoChip = styled.span`
;
  color: var(--gray-700);
`;

const IntroTitle = styled.p`
  color: var(--black);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  max-width: 255px;
`;

const IntroContent = styled.p`
  color: var(--gray-700);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  max-width: 255px
`;

const ProfileBanner = ({ 
  country,
  campus,
  languages,
  nickname, 
  mbti, 
  keywords, 
  intro,
  onClick,
}: ProfileBannerProps) => {
  const validCountry = country || 'KR';
  const characterImgSrc = countryCharacterImages[validCountry] || KoreaProfileImg;
  //기본 국가는 한국(KR)-따라서 캐릭터 이미지도 한국 이미지를 기본으로 설정(배너도)

  // 캠퍼스 표시 텍스트
  // 😭api 확인 후 삭제 결정
  const campusText = campus === 'GLOBAL' ? '글로벌캠퍼스' : campus === 'SEOUL' ? '서울캠퍼스' : null;

  // 언어 텍스트 매핑
  // 😭api 확인 후 삭제 결정

  const languageMap: { [key: string]: string } = {
    'ko': '한국어',
    'en': '영어',
    'ja': '일본어',
    'zh': '중국어',
    'es': '스페인어',
    'fr': '프랑스어',
    'de': '독일어',
    'it': '이탈리아어',
    'ar': '아랍어',
  };

  // native와 learn 언어를 모두 표시
  // 😭api 확인 후 삭제 결정
  const nativeLanguages = languages.native.map(code => languageMap[code] || code);
  const learnLanguages = languages.learn.map(code => languageMap[code] || code);
  const allLanguages = [...nativeLanguages, ...learnLanguages];

  // intro를 제목과 본문으로 분리
  // 😭api 확인 후 삭제 결정
  const introLines = intro ? intro.split('\n').filter(line => line.trim()) : [];
  const introTitle = introLines[0] || '';
  const introContent = introLines.slice(1).join(' ') || introLines[0] || `안녕하세요! ${nickname}입니다.`;

  return (
    <CardWrapper $country={validCountry} onClick={onClick}>
      <ContentContainer>
        <TopKeywordTags>
          {keywords.slice(0, 3).map((keyword, index) => (
            <TopKeywordChip className="Button2" key={`keyword-${index}`}>#{keyword}</TopKeywordChip>
          ))}
        </TopKeywordTags>

        <MainContent>
          <LeftSection>
            <ProfileImage src={characterImgSrc} />
            <Nickname className="H5">{nickname}</Nickname>
            {mbti && <MBTIBadge className="Button1">{mbti}</MBTIBadge>}
          </LeftSection>

          <RightSection>
            <InfoTags>
              {campusText && <InfoChip className="Button2">#{campusText}</InfoChip>}
              {allLanguages.map((lang, index) => (
                <InfoChip className="Button2" key={`lang-${index}`}>#{lang}</InfoChip>
              ))}
            </InfoTags>
            <IntroTitle className="Button1">{introTitle}</IntroTitle>
            <IntroContent className="Body3">{introContent}</IntroContent>
          </RightSection>
        </MainContent>
      </ContentContainer>
    </CardWrapper>
  );
};
// introtitle - CTA로 변경했어요(닉네임(H5)과 구별하기 위해)
// 칩 색도 변경했어요(기본 흰색 배경-카테고리 상관없이)

export default ProfileBanner;
