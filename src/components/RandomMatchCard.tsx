import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MockImg from "../assets/main-character.svg";
import { IoIosLogOut } from "react-icons/io";
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

const LanguageBox = styled.div`
  padding-top: 0.94rem;
  display: flex;
  flex-direction: column;
  gap: 0.87rem;
`;

const LanguageContent = styled.div`
  font-size: 1rem;
  text-align: center;
`;

const KeywordContainer = styled.div`
  display: grid;
  padding-top: 1.94rem;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem 1.94rem;
  justify-content: center;
  margin: 0 auto;
`;

const KeywordBox = styled.div`
  display: flex;
  width: 5.69rem;
  height: 2.13rem;
  border-radius: 3.125rem;
  background: var(--white);
  justify-content: center;
  align-items: center;
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
  const [stage, setStage] = useState<"loading" | "matched" | "chat">("loading");
  const [partner, setPartner] = useState<any>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const userId = Number(localStorage.getItem("userId"));
  let interval: NodeJS.Timeout;

  // 대기열 진입 함수
  const enterMatching = async () => {
    try {
      const res = await axiosInstance.post("/api/matching/queue", { userId });
      const data = res?.data;
      console.log("대기열 응답:", data);

      // WAITING or FOUND 분기
      if (data.status === "FOUND") {
        setStage("matched");
        setPartner(data.partner);
        setMatchId(data.matchId);
      } else if (data.status === "WAITING" || data.status === "ACCEPTED_ONE") {
        interval = setInterval(async () => {
          try {
            const check = await axiosInstance.get(`/api/matching/active/${userId}`);
            const state = check?.data;
            console.log("매칭 상태:", state);

            if (state?.status === "FOUND") {
              clearInterval(interval);
              setStage("matched");
              setPartner(state.partner);
              setMatchId(state.matchId);
            } else if (state?.status === "ACCEPTED_ONE") {
              console.log("상대방이 이미 수락한 상태입니다.");
              setMatchId(state.matchId);
            }
          } catch (err) {
            console.error("매칭 상태 확인 중 오류:", err);
          }
        }, 3000);
      }
    } catch (error) {
      console.error("매칭 진입 오류:", error);
    }
  };

  // 수락
  const handleAcceptMatch = async () => {
    if (!matchId) return alert("매칭 정보가 없습니다.");
    try {
      await axiosInstance.post(`/api/matching/${matchId}/accept`, { userId });
      console.log("매칭 수락 완료");
      setStage("chat");
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
      setPartner(null);
      setMatchId(null);

      await new Promise((resolve) => setTimeout(resolve, 500));
      await enterMatching();
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

  // 컴포넌트 마운트/언마운트 처리
  useEffect(() => {
    enterMatching();
    return () => {
      if (interval) clearInterval(interval);
      axiosInstance.delete("/api/matching/queue", { data: { userId } });
    };
  }, [userId]);

  const languageMap: Record<string, string> = {
    ja: "일본어",
    ko: "한국어",
  };

  const countryMap: Record<string, string> = {
    KR: "한국",
    JP: "일본",
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

        {stage === "matched" && partner && (
          <>
            <MatchedTitle>매칭에 성공했습니다!</MatchedTitle>
            <MatchedProfile>
              <ProfileImg src={partner.profileImage || MockImg} alt="프로필 이미지" />
              <ProfileName>{partner.nickname}</ProfileName>
              <LanguageBox>
                <LanguageContent>
                  사용 언어: {languageMap[partner.nativeLanguages?.[0]]}
                </LanguageContent>
                <LanguageContent>
                  선호 언어: {languageMap[partner.learnLanguages?.[0]]}
                </LanguageContent>
                <LanguageContent>
                  국적: {countryMap[partner.country]}
                </LanguageContent>
              </LanguageBox>
              <KeywordContainer>
                {[...(partner.keywords || []), partner.mbti].map((word, idx) => (
                  <KeywordBox key={idx}>#{word}</KeywordBox>
                ))}
              </KeywordContainer>
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
