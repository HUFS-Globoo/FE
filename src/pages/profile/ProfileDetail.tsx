import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ProfileCard from "../../components/ProfileCard";
import { type ProfileDetailResponse } from "../../types/mypage&profile.types";
import axiosInstance from "../../../axiosInstance";

import { COUNTRY_ASSETS } from "../../utils/countryAssets";


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
`;

const PageTitle = styled.h1`
  margin-bottom: 2.5rem;
  color: var(--primary);
`;

const MessageSection = styled.div`
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const MessageTitle = styled.div`
  color: var(--black);
  margin-bottom: 1rem;
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  display: block;
  padding: 1rem;
  border: 1px solid var(--gray);
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: 'Escoredream', sans-serif;
  font-weight: 300;
  min-height: 8rem;
  resize: vertical;
  margin-bottom: 1rem;
  background-color: var(--gray-text-filled);
  color: #121212;
  caret-color: #121212;
  
  &:focus {
    outline: none;
    border-color: var(--skyblue);
  }
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const MessageButton = styled.button`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  background-color: var(--skyblue);
  color: var(--white);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: var(--primary);
  }
`;


const ProfileDetail = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<ProfileDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 영어 언어 이름을 언어 코드로 변환하는 매핑 (대소문자 구분 없이)
  const languageNameToCode: { [key: string]: string } = {
    "korean": "ko",
    "english": "en",
    "chinese": "zh",
    "french": "fr",
    "german": "de",
    "japanese": "ja",
    "spanish": "es",
    "arabic": "ar",
    "italian": "it",
    "russian": "ru",
    "polish": "pl",
    "czech": "cs",
    "slovak": "sk",
    "romanian": "ro",
    "bulgarian": "bg",
    "vietnamese": "vi",
    "thai": "th",
    "indonesian": "id",
    "malay": "ms",
    "mongolian": "mn",
    "hindi": "hi",
    "persian": "fa",
    "turkish": "tr",
    "hebrew": "he",
    "kazakh": "kk",
    "uzbek": "uz",
  };

  const getLanguageName = (codeOrName: string): string => {
    if (!codeOrName) return codeOrName;
    
    // 이미 한국어로 번역된 경우 그대로 반환
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (koreanRegex.test(codeOrName)) {
      return codeOrName;
    }
    
    // 소문자로 정규화
    const normalized = codeOrName.toLowerCase().trim();
    
    // 영어 이름인 경우 언어 코드로 변환
    let langCode = normalized;
    if (languageNameToCode[normalized]) {
      langCode = languageNameToCode[normalized];
    }
    
    // randomMatch.languages에서 먼저 찾기 (더 많은 언어 지원)
    let translated = t(`randomMatch.languages.${langCode}`);
    if (translated && translated !== `randomMatch.languages.${langCode}`) {
      return translated;
    }
    
    // profile.languages에서 찾기
    translated = t(`profile.languages.${langCode}`);
    if (translated && translated !== `profile.languages.${langCode}`) {
      return translated;
    }
    
    // 번역을 찾지 못하면 원본 반환
    return codeOrName;
  };

  useEffect(() => {
    const fetchProfileDetail = async () => {
      try {
        if (!userId) {
          console.warn("userId가 없습니다. useParams() 확인 필요.");
          return;
        }
  
        console.log(`프로필 상세 요청 시작: /api/profiles/${userId}`);
  
        const res = await axiosInstance.get(`/api/profiles/${userId}`);
        const data = res.data;
        console.log("프로필 불러오기 성공:", data);
  
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
        const cleanBaseUrl = BASE_URL.endsWith("/")
          ? BASE_URL.slice(0, -1)
          : BASE_URL;
  
        const countryCode = (data.country || "KR").toUpperCase();
        const fallbackCharacter =
          COUNTRY_ASSETS[countryCode]?.character ||
          COUNTRY_ASSETS["KR"]?.character ||
          "";

        const profileImageUrl =
          data.profileImageUrl && data.profileImageUrl.trim() !== ""
            ? data.profileImageUrl.startsWith("/uploads")
              ? `${cleanBaseUrl}${data.profileImageUrl}`
              : data.profileImageUrl
            : fallbackCharacter;

      

        const formattedData: ProfileDetailResponse = {
          userId: data.userId,
          nickname: data.nickname,
          campus: data.campus,
          country: data.country,
          mbti: data.mbti,
          profileImageUrl: profileImageUrl, 
          introTitle: data.infoTitle,
          introContent: data.infoContent,
          keywords: data.keywords,
          languages: {
            native: data.nativeLanguages.map((l: any) => {
              // code가 있으면 code를 사용, 없으면 name을 사용
              const codeOrName = l.code || l.name;
              return getLanguageName(codeOrName);
            }),
            learn: data.learnLanguages.map((l: any) => {
              // code가 있으면 code를 사용, 없으면 name을 사용
              const codeOrName = l.code || l.name;
              return getLanguageName(codeOrName);
            }),
          },
        };
  
        setUserData(formattedData);
      } catch (error) {
        console.error("프로필 상세 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfileDetail();
  }, [userId]);
  
  

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!userData?.userId) {
      alert(t("profile.detail.alert.partnerInfoError"));
      return;
    }
  
    try {
      console.log("쪽지 전송 요청:", { partnerId: userData.userId, content: message });
  
      const res = await axiosInstance.post("/api/messages", {
        partnerId: userData.userId, 
        content: message,
      });
  
      console.log("쪽지 전송 성공:", res.data);
      alert(`${userData.nickname}${t("profile.detail.alert.sendSuccess")}`);
  
      setMessage("");
    } catch (error: any) {
      console.error("쪽지 전송 실패:", error);
      if (error.response?.status === 403) {
        alert(t("profile.detail.alert.loginRequired"));
      } else if (error.response?.status === 404) {
        alert(t("profile.detail.alert.partnerNotFound"));
      } else {
        alert(t("profile.detail.alert.sendError"));
      }
    }
  };
  
  

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <div className="Body1">{t("profile.detail.loading")}</div>
        </ContentWrapper>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <ContentWrapper>
          <div className="Body1">{t("profile.detail.error")}</div>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <PageTitle className="H1">{t("profile.detail.title")}</PageTitle>
        
        <ProfileCard
          userId={userData.userId}
          nickname={userData.nickname}
          mbti={userData.mbti}
          country={userData.country}
          profileImageUrl={userData.profileImageUrl}
          infoTitle={userData.introTitle}
          infoContent={userData.introContent}
          keywords={userData.keywords}
          campus={userData.campus}
          nativeLanguages={userData.languages.native}
          learnLanguages={userData.languages.learn}
          isOwner={false}
        />
        

        {/* 메시지 보내기 */}
        <MessageSection>
          <MessageTitle className="H4">{t("profile.detail.message.title")}</MessageTitle>
          <MessageTextarea
            className="Body1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("profile.detail.message.placeholder")}
          />
          <MessageButton 
            className="Button1"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            {t("profile.detail.message.sendButton")}
          </MessageButton>
        </MessageSection>
      </ContentWrapper>
    </Container>
  );
};

export default ProfileDetail;