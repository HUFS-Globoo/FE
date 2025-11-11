import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ProfileCard from "../../components/ProfileCard";
import { type ProfileDetailResponse } from "../../types/mypage&profile.types";
import axiosInstance from "../../../axiosInstance";
import AmericaProfileImg from "../../assets/img-profile1-America.svg";
import KoreaProfileImg from "../../assets/img-profile1-Korea.svg";
import ItalyProfileImg from "../../assets/img-profile1-Italy.svg";
import EgyptProfileImg from "../../assets/img-profile1-Egypt.svg";
import ChinaProfileImg from "../../assets/img-profile1-China.svg";

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
`;

const MessageSection = styled.div`
  width: 100%;
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
  padding: 1rem;
  border: 1px solid var(--gray);
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: 'Escoredream', sans-serif;
  font-weight: 300;
  min-height: 8rem;
  resize: vertical;
  margin-bottom: 1rem;
  
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
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<ProfileDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

        const countryCharacterImages: Record<string, string> = {
          US: AmericaProfileImg,
          KR: KoreaProfileImg,
          IT: ItalyProfileImg,
          EG: EgyptProfileImg,
          CN: ChinaProfileImg,
        };
  
        const profileImageUrl =
        data.profileImage && data.profileImage.trim() !== ""
          ? data.profileImage.startsWith("/uploads")
            ? `${cleanBaseUrl}${data.profileImage}`
            : data.profileImage
          : countryCharacterImages[data.country?.toUpperCase()] || KoreaProfileImg;

        const formattedData: ProfileDetailResponse = {
          userId: data.userId,
          nickname: data.nickname,
          campus: data.campus,
          country: data.country,
          mbti: data.mbti,
          profileImage: profileImageUrl, 
          introTitle: data.infoTitle,
          introContent: data.infoContent,
          keywords: data.keywords.map((k: any) => k.name),
          languages: {
            native: data.nativeLanguages.map((l: any) => l.name),
            learn: data.learnLanguages.map((l: any) => l.name),
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
      alert("상대방 정보를 불러올 수 없습니다.");
      return;
    }
  
    try {
      console.log("쪽지 전송 요청:", { partnerId: userData.userId, content: message });
  
      const res = await axiosInstance.post("/api/messages", {
        partnerId: userData.userId, 
        content: message,
      });
  
      console.log("쪽지 전송 성공:", res.data);
      alert(`${userData.nickname}님에게 쪽지가 성공적으로 전송되었습니다!`);
  
      setMessage("");
    } catch (error: any) {
      console.error("쪽지 전송 실패:", error);
      if (error.response?.status === 403) {
        alert("로그인이 필요합니다.");
      } else if (error.response?.status === 404) {
        alert("상대방을 찾을 수 없습니다.");
      } else {
        alert("쪽지 전송 중 오류가 발생했습니다.");
      }
    }
  };
  
  

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <div className="Body1">로딩 중...</div>
        </ContentWrapper>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <ContentWrapper>
          <div className="Body1">프로필 정보를 불러올 수 없습니다.</div>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <PageTitle className="H1">프로필 조회</PageTitle>
        
        <ProfileCard
          userId={userData.userId}
          nickname={userData.nickname}
          mbti={userData.mbti}
          country={userData.country}
          profileImage={userData.profileImage}
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
          <MessageTitle className="H4">쪽지 작성하기</MessageTitle>
          <MessageTextarea
            className="Body1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 작성해주세요"
          />
          <MessageButton 
            className="Button1"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            쪽지 보내기
          </MessageButton>
        </MessageSection>
      </ContentWrapper>
    </Container>
  );
};

export default ProfileDetail;