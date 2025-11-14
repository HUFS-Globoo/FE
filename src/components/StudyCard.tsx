import styled from "styled-components";
import type { StudyItem } from "../types/study.types";
import ParticipantImg from "../assets/img-participant.svg";
import AmericaProfileImg from "../assets/img-profile1-America.svg";
import KoreaProfileImg from "../assets/img-profile1-Korea.svg";
import ItalyProfileImg from "../assets/img-profile1-Italy.svg";
import EgyptProfileImg from "../assets/img-profile1-Egypt.svg";
import ChinaProfileImg from "../assets/img-profile1-China.svg";

interface StudyCardProps {
  study: StudyItem;
  onClick?: () => void;
  currentUserId?: number;
  authorCountry?: string;
}

// 국가별 캐릭터 이미지 매핑
const countryCharacterImages: { [key: string]: string } = {
  US: AmericaProfileImg,
  KR: KoreaProfileImg,
  IT: ItalyProfileImg,
  AR: EgyptProfileImg,
  EG: EgyptProfileImg,

  CN: ChinaProfileImg,
};

const CardContainer = styled.div`
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 60px;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const StatusBadge = styled.span<{ $status: '모집중' | '마감' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  background-color: ${props => props.$status === '모집중' ? 'var(--primary)' : 'var(--gray)'};
  color: ${props => props.$status === '모집중' ? 'var(--white)' : 'var(--gray-400)'};
`;

const ParticipantInfo = styled.span`
  color: var(--gray-700);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  background-color: var(--skyblue);
  color: var(--white);
`;

const Title = styled.h3`
  margin: 0;
  color: var(--black);
  line-height: 1.4;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const MoreButton = styled.span`
  color: var(--primary);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    text-decoration: underline;
  }
`;

const StudyCard = ({ study, onClick, currentUserId, authorCountry }: StudyCardProps) => {

  const useDefaultProfile =
    typeof window !== "undefined" &&
    localStorage.getItem("useDefaultProfileImage") === "true";

  const authorCountryCode = authorCountry ?? null;
  const fallbackCharacter =
    (authorCountryCode &&
      countryCharacterImages[
        authorCountryCode as keyof typeof countryCharacterImages
      ]) ||
    KoreaProfileImg;

  let characterImage: string | null = study.authorProfileImageUrl;

  // 🔹 이 카드의 작성자가 "나"인 경우 + 기본이미지 모드면 → 업로드 이미지 무시
  if (
    currentUserId &&
    study.authorId === currentUserId &&
    useDefaultProfile
  ) {
    characterImage = null;
  }

  const finalSrc = characterImage
    ? characterImage.replace(/([^:]\/)\/+/g, "$1")
    : fallbackCharacter;
  
  // 캠퍼스 
  const campusMap: { [key: string]: string } = {
    'GLOBAL': '글로벌캠퍼스',
    'SEOUL': '서울캠퍼스'
  };

  // 언어
  const languageMap: { [key: string]: string } = {
    '한국어': '한국어',
    '영어': '영어',
    '중국어': '중국어',
    '스페인어': '스페인어',
    '프랑스어': '프랑스어',
    '독일어': '독일어',
    '이탈리아어': '이탈리아어',
    '아랍어': '아랍어',
  };

  // 태그 
  // campus, language 필드 수정(배열로 고침)
const tags: string[] = [];

const primaryCampus = study.campuses?.[0];
const primaryLanguage = study.languages?.[0];

  if (primaryCampus) tags.push(campusMap[primaryCampus] || primaryCampus);
  if (primaryLanguage) tags.push(languageMap[primaryLanguage] || primaryLanguage);
  if (study.tags) tags.push(...study.tags);


  return (
    <CardContainer onClick={onClick}>
      <ProfileSection>
        <ProfileImage src={finalSrc} alt={study.authorNickname || "작성자"} />
      </ProfileSection>
      
      <ContentSection>
        <HeaderSection>
          <StatusBadge $status={study.status as '모집중' | '마감'} className="Button2">
            {study.status}
          </StatusBadge>

          <ParticipantInfo className="Body2">
            <img src={ParticipantImg} alt="참여자" />
            {study.currentParticipants || 0}명 / {study.capacity}명
          </ParticipantInfo>

          <TagContainer>
            {tags.map((tag, index) => (
              <Tag key={index} className="Button2"># {tag}</Tag>
            ))}
          </TagContainer>
        </HeaderSection>
        
        <Title className="H4">{study.title}</Title>
        
        <ActionSection>
          <MoreButton className="Body2">더 보기 &gt;</MoreButton>
        </ActionSection>
      </ContentSection>
    </CardContainer>
  );
};

export default StudyCard;