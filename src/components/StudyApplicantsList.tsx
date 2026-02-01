import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { StudyMember } from "../../types/study.types";

import { COUNTRY_ASSETS } from "../utils/countryAssets";


// StudyDetail이랑 동일하게 BASE_URL 보정 (상대경로 대비 - 절대경로)
const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL as string;

const toAbsoluteUrl = (url: string | null | undefined) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const normalizedBase = BASE_URL?.endsWith("/")
    ? BASE_URL.slice(0, -1)
    : BASE_URL || "";
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;

  return normalizedBase ? `${normalizedBase}${normalizedPath}` : normalizedPath;
};

const normalizeProfileUrl = (url?: string | null) => {
  if (!url || url.trim() === "") return null;
  return toAbsoluteUrl(url).replace(/([^:]\/)\/+/g, "$1");
};

const getMemberProfileImage = (member: StudyMember) => {
  const countryCode = (member.country || "KR").toUpperCase();

  const fallback =
    COUNTRY_ASSETS[countryCode]?.character ||
    COUNTRY_ASSETS["KR"]?.character || 
    "";

  const profileUrl = normalizeProfileUrl(member.profileImageUrl);
  return profileUrl || fallback;
};


interface Props {
  members: StudyMember[];
  isLoading: boolean;

  //현재 로그인 유저(currentuser)와 작성자 비교 필요
  currentUserId?: number;
  authorId: number;
}

const StudyApplicantsList = ({ members, isLoading, currentUserId, authorId }: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isEnglish = i18n.language === 'en';
  const handleGoProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
  };
  
    return (
    <Card>
      <Header>
        <Title className="H4">{t("study.detail.applicants.title")}</Title>
        <SubTitle className="Body2">
          {isEnglish ? (
            <>
              {t("study.detail.applicants.subtitle")}
              {members.length > 0 && (
                <>
                  <br />
                  ({t("study.detail.applicants.applicantCount")}: {members.length}{t("study.detail.participants")})
                </>
              )}
            </>
          ) : (
            <>
              {t("study.detail.applicants.subtitle")} {members.length > 0 ? `(${t("study.detail.applicants.applicantCount")}: ${members.length}${t("study.detail.participants")})` : ""}
            </>
          )}
        </SubTitle>
      </Header>

      {isLoading ? (
        <StateText className="Body2">{t("study.detail.applicants.loading")}</StateText>
      ) : members.length === 0 ? (
        <StateText className="Body2">{t("study.detail.applicants.empty")}</StateText>
      ) : (
        <List>
          {members.map((member) => {
            const isAuthorRow = member.userId === authorId;
            const isMeRow = currentUserId != null && member.userId === currentUserId;

            // 더보기 버튼 노출 조건
            const showMoreButton = !isMeRow;

            return (
              <Row key={member.userId}>
                <Avatar src={getMemberProfileImage(member)} alt={member.nickname} />
                <Info>
                  <NameLine>
                    <Nickname className="Button1">{member.nickname}</Nickname>
                    {isAuthorRow && <AuthorText className="Button1">· {t("study.detail.author")}</AuthorText>}
                  </NameLine>

                    <Meta className="Body2">
                    {(member.mbti || member.campus) && (
                        <MetaChip className="Body3">
                        {[ 
                            member.mbti,
                            member.campus &&
                            (member.campus === "SEOUL" ? t("profile.campus.seoul") : t("profile.campus.global")),
                        ]
                            .filter(Boolean)
                            .join(" · ")}
                        </MetaChip>
                    )}
                    </Meta>
                </Info>

                {showMoreButton && (
                  <MoreButton
                    type="button"
                    className="Button2"
                    onClick={() => handleGoProfile(member.userId)}
                  >
                    {t("common.more")}
                  </MoreButton>
                )}
              </Row>
            );
          })}
        </List>
      )}
    </Card>
  );
};

export default StudyApplicantsList;

const Card = styled.div`
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 1rem;
  padding: 1.5rem;
`;

const Header = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.div`
  margin-bottom: 0.25rem;
  color: var(--black);
`;

const SubTitle = styled.div`
  color: var(--gray-700);
`;

const StateText = styled.div`
  padding: 1rem 0;
  color: var(--gray-700);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--gray);
  flex-shrink: 0;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const NameLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`;

const Nickname = styled.div`
  color: var(--black);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AuthorText = styled.span`
  color: #2F96B4;
  flex-shrink: 0;
  font-size: 11px;
`;

const Meta = styled.div`
  color: var(--gray-700);
  margin-top: 0.2rem;
`;

const MoreButton = styled.button`
  border: none;
  background: transparent;
  color: var(--gray-700);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  flex-shrink: 0;

  &:hover {
    color: var(--skyblue);
    text-decoration: underline;
  }
`;

const MetaChip = styled.span`
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background-color: var(--gray-text-filled);
  color: var(--gray-700);
  flex-shrink: 0;
`;
