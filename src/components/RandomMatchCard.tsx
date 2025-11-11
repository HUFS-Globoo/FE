import styled, { keyframes } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import MockImg from "../assets/main-character.svg";
import axiosInstance from "../../axiosInstance";

const Wrapper = styled.div`
  position: relative;
  width: 29.5625rem;
  height: 37.4375rem;
  margin: 0 auto;
  overflow: visible;
  box-sizing: border-box;
`;

const Container = styled.div`
  margin: 0 auto;
  width: 29.5625rem;
  height: 37.4375rem;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.5rem;
  border-radius: 2rem;
  border: 2.769px solid rgba(255, 255, 255, 0.6);
  background: linear-gradient(116deg, rgba(239,239,239,0.6) 10.92%, rgba(255,255,255,0.08) 96.4%);
  backdrop-filter: blur(38px);
  z-index: 1;
  box-sizing: border-box;
`;

const ColorBackground = styled.div<{ stage: string }>`
  position: absolute;
  bottom: -0.56rem;
  right: 0.56rem;
  width: 100%;
  height: 100%;
  border-radius: 2rem;
  background: ${({ stage }) => {
    switch (stage) {
      case "matched":
        return "#FFE6A2";
      case "chat":
        return "rgba(255, 230, 162, 0.20)";
      default:
        return "linear-gradient(242deg, #FFE6A2 30.46%, #BDB68E 47.83%, #9CA698 67.52%, rgba(0, 45, 86, 0.50) 94.11%)";
    }
  }};
  z-index: 0;
`;

const Title = styled.div`
  font-family: "Hakgyoansim Dunggeunmiso TTF";
  font-size: 1.5rem;
  font-weight: 400;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  margin-top: 10rem;
  width: 3rem;
  height: 3rem;
  border: 0.25rem solid rgba(0, 0, 0, 0.1);
  border-top: 0.25rem solid #002d56;
  border-radius: 50%;
  animation: ${spin} 2s linear infinite;
`;

const CancelButton = styled.div`
  margin: 0 auto;
  margin-top: 17rem;
  color: rgba(0, 0, 0, 0.5);
  width: 7rem;
  border-bottom: solid rgba(0, 0, 0, 0.5);
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
`;

const MatchedTitle = styled.div`
  font-family: "Hakgyoansim Dunggeunmiso TTF";
  font-size: 1.5rem;
  font-weight: 400;
`;

const MatchedProfile = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-top: 2.13rem;
`;

const ProfileImg = styled.img`
  width: 6.875rem;
  height: 6.875rem;
  border-radius: 50%;
  background-color: var(--white);
  margin: 0 auto;
  object-fit: cover;
`;

const ProfileName = styled.div`
  font-size: 1.25rem;
  font-weight: 300;
  text-align: center;
  padding-top: 1.12rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.06rem;
  justify-content: center;
  padding: 1.44rem;
`;

const Button = styled.div`
  font-family: 'SchoolSafetyRoundedSmile';
  width: 11.875rem;
  height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.75rem;
  border: 2.769px solid rgba(255, 255, 255, 0.6);
  background: linear-gradient(116deg, rgba(239,239,239,0.6) 10.92%, rgba(255,255,255,0.08) 96.4%);
  cursor: pointer;
`;

export default function RandomMatchCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || Number(localStorage.getItem("userId"));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [stage, setStage] = useState<"loading" | "matched" | "chat">("loading");
  const [matchId, setMatchId] = useState<string | null>(null);

  // 매칭 상태 확인 (폴링만 수행)
  useEffect(() => {
    if (!userId) return;

    intervalRef.current = setInterval(async () => {
      try {
        const res = await axiosInstance.get(`/api/matching/active`);
        const data = res.data;
        console.log("매칭 상태:", data);

        if (data.status === "FOUND" || data.status === "ACCEPTED_ONE") {
          clearInterval(intervalRef.current!);
          setStage("matched");
          setMatchId(data.matchId);
        }
      } catch (err) {
        console.error("매칭 상태 확인 오류:", err);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId]);

  // 매칭 수락
  const handleAcceptMatch = async () => {
    if (!matchId) return alert("매칭 정보가 없습니다.");
    try {
      await axiosInstance.post(
        `/api/matching/${matchId}/accept`,
        JSON.stringify({ userId }),
        {
          headers: { "Content-Type": "application/json" },
          transformRequest: [(data) => data],
        }
      );
      console.log("매칭 수락 완료");
      setStage("chat");
      navigate(`/chat/${matchId}`);
    } catch (error) {
      console.error("매칭 수락 실패:", error);
      alert("채팅 시작 중 오류가 발생했습니다.");
    }
  };

  // 다른 상대 찾기
  const handleFindAnother = async () => {
    try {
      await axiosInstance.delete("/api/matching/queue", { data: { userId } });
      console.log("기존 대기열 삭제 완료");
      setStage("loading");
      setMatchId(null);
    } catch (error) {
      console.error("다른 상대 찾기 오류:", error);
      alert("다른 상대를 찾는 중 오류가 발생했습니다.");
    }
  };

  // 매칭 취소
  const handleCancelMatching = async () => {
    try {
      await axiosInstance.delete("/api/matching/queue", { data: { userId } });
      console.log("매칭 대기열에서 나가기 성공");
    } catch (error) {
      console.error("매칭 대기열 나가기 실패:", error);
    } finally {
      navigate("/");
    }
  };

  return (
    <Wrapper>
      <ColorBackground stage={stage} />
      <Container>
        {stage === "loading" && (
          <>
            <Title>랜덤 매칭 중입니다...</Title>
            <SpinnerWrapper />
            <CancelButton onClick={handleCancelMatching}>
              매칭 다음에 하기
            </CancelButton>
          </>
        )}

        {stage === "matched" && (
          <>
            <MatchedTitle>매칭에 성공했습니다!</MatchedTitle>
            <MatchedProfile>
              <ProfileImg src={MockImg} alt="프로필 이미지" />
              <ProfileName>상대방을 찾았습니다</ProfileName>
              <ButtonContainer>
                <Button onClick={handleAcceptMatch}>채팅 시작하기</Button>
                <Button onClick={handleFindAnother}>다른 상대 찾기</Button>
              </ButtonContainer>
            </MatchedProfile>
          </>
        )}
      </Container>
    </Wrapper>
  );
}
