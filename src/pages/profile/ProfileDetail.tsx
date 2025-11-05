import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ProfileCard from "../../components/ProfileCard";
import { type ProfileDetailResponse } from "../../types/mypage&profile.types";

// 목 데이터 (타인 프로필)
const mockOtherUserData: ProfileDetailResponse = {
  userId: 22,
  nickname: "왕마오",
  campus: "GLOBAL",
  country: "KR",
  mbti: "ENFP",
  keywords: ["운동", "음악", "여행"],
  profileImage: null,
  introTitle: "힘드러요.,",
  introContent: "친구들 좋아해요",
  languages: {
    native: ["일본어"],
    learn: ["한국어"]
  }
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
  const [message, setMessage] = useState("");

  useEffect(() => {
    //😭실제 API 호출로 대체 필요

    setUserData(mockOtherUserData);
  }, [userId]);

  const handleSendMessage = () => {
    console.log("메시지 전송:", message);
    //😭메시지 전송 API 호출
    alert("메시지가 전송되었습니다!");
    setMessage("");
  };

  if (!userData) {
    return (
      <Container>
        <ContentWrapper>
          <div className="Body1">로딩 중...</div>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <PageTitle className="H1">프로필 조회</PageTitle>
        
        {/* 타인 프로필: isOwner={false} */}
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
          isOwner={false}  //수정 버튼 없음
        />
        

        {/* 메시지 보내기 */}
        <MessageSection>
          <MessageTitle className="H4">문의 작성하기</MessageTitle>
          <MessageTextarea
            className="Body1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="문의할 내용을 작성해주세요"
          />
          <MessageButton 
            className="Button1"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            문의하기
          </MessageButton>
        </MessageSection>
      </ContentWrapper>
    </Container>
  );
};

export default ProfileDetail;