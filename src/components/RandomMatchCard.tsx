import styled, { keyframes } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import MockImg from "../assets/main-character.svg";
import axiosInstance from "../../axiosInstance";
import { IoIosLogOut } from "react-icons/io";
import AmericaProfileImg from "../assets/img-profile1-America.svg";
import KoreaProfileImg from "../assets/img-profile1-Korea.svg";
import ItalyProfileImg from "../assets/img-profile1-Italy.svg";
import EgyptProfileImg from "../assets/img-profile1-Egypt.svg";
import ChinaProfileImg from "../assets/img-profile1-China.svg";


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
  font-weight: 500;
  text-align: center;
  padding-top: 1.12rem;
`;

const LanguageBox = styled.div`
  padding-top: 0.94rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.87rem;
`


const LanguageContent = styled.div`
  font-size: 1rem;
  font-weight: 300;
  text-align: center;
`

const KeywordContainer = styled.div`
  display: grid;
  padding-top: 1.4rem;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 0.8rem 1.9rem;
  justify-content: center;
  margin: 0 auto;
`
const KeywordBox = styled.div`
  display: flex;
  background: var(--white);
  justify-content: center;
  align-items: center;
  border-radius: 3.125rem;
  padding: 0.5625rem 1.5rem 0.5rem 1.5rem;
  box-sizing: border-box;
`

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

const MessageHeader = styled.div`
  width: 100%;
  height: 5.31rem;
  display: flex;
  flex-direction: row;
  margin-top: -2.5rem;
  padding-left: 1.69rem;
  box-sizing: border-box;
  align-items: center;
`


const MessageProfile = styled.img`
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 3.125rem;
  background: #FFF;
`

const NicnameContent = styled.div`
  padding-left: 0.94rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 150%; 
`

const OutIcon = styled(IoIosLogOut)`
  padding-left: 7.69rem;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
`

const MessageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.12rem;
  padding: 0 1.69rem;
  box-sizing: border-box;
  overflow-y: auto; 
  max-height: 28rem;
  scroll-behavior: smooth; 

  &::-webkit-scrollbar {
    width: 0.375rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2); 
    border-radius: 0.625rem; 
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.35);
  }

  &::-webkit-scrollbar-track {
    background: transparent; /* 배경은 투명 */
  }
`

const MessageBox = styled.div`
  display: inline-block;
  width: fit-content;
  border-radius: 2rem;
  background: var(--skyblue);
  padding: 0.3125rem 0.9375rem;
  justify-content: center;
  align-items: center;
`

const SendMessageContainer = styled.div`
  width: 27.75rem;
  height: 2.3125rem;
  background-color: #E1E1E1;
  margin-top: auto;
  border-radius: 2rem;
  margin-bottom: 1rem;
`

const SendInput = styled.input`
  background-color: #E1E1E1;
  padding-left: 1.25rem;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 2rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 150%;
  color: black;

  &::placeholder {
    font-size: 1rem;
    font-weight: 500;
    font-size: 0.875rem;
    font-weight: 300;
    line-height: 150%;
  }
  &:focus {
    outline: none; 
  }

`

const ModalWrapper = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const ModalBox = styled.div`
  width: 18rem;
  padding: 2rem;
  border-radius: 1.2rem;
  background: white;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
`;



interface ChatMessage {
  id?: number;
  senderId: number;
  message: string;
  timestamp?: string;
}

export default function RandomMatchCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || Number(localStorage.getItem("userId"));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [partner, setPartner] = useState<any>(null);
  const [stage, setStage] = useState<"loading" | "matched" | "chat" | "waiting_accept">("loading");
  const [matchId, setMatchId] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const token = localStorage.getItem("accessToken");
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);
  const [waitingAccept, setWaitingAccept] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);



  

// 매칭 상태 확인
useEffect(() => {
  if (!userId) return;

  const fetchMatchingStatus = async () => {
    try {
      const res = await axiosInstance.get(`/api/matching/active`);
      const apiData = res.data.data;
      console.log("응답:", apiData);

      if (!apiData) return;

      const opponentId =
        apiData.userAId === userId ? apiData.userBId : apiData.userAId;

      // WAITING
      if (apiData.status === "WAITING") {
        setStage("loading");
        setMatchId(null);
        setPartner(null);
        setChatRoomId(null);
        setWaitingAccept(false);
        setHasAccepted(false);
        return;
      }

      // FOUND
      if (apiData.status === "FOUND") {
        setStage("matched");
        if (!matchId) setMatchId(apiData.matchId);

        if (!partner) {
          const profileRes = await axiosInstance.get(`/api/profiles/${opponentId}`);
          setPartner(profileRes.data);
        }
        return;
      }

      // ACCEPTED_ONE 유지
      if (apiData.status === "ACCEPTED_ONE") {
        setStage("matched");

        if (!partner) {
          const profileRes = await axiosInstance.get(`/api/profiles/${opponentId}`);
          setPartner(profileRes.data);
        }

        return;
      }

      // ACCEPTED_BOTH → CHAT
      if (apiData.status === "ACCEPTED_BOTH") {
        console.log("🔥 ACCEPTED_BOTH — 채팅 입장합니다!");

        clearInterval(intervalRef.current!);
        setChatRoomId(apiData.chatRoomId);
        localStorage.setItem("chatRoomId", apiData.chatRoomId);

        setStage("chat");
        setWaitingAccept(false);
        return;
      }
    } catch (err) {
      console.error("매칭 상태 확인 오류:", err);
    }
  };

  intervalRef.current = setInterval(fetchMatchingStatus, 1000);

  return () => clearInterval(intervalRef.current!);
}, [userId, matchId, partner]);



const handleAcceptMatch = async () => {
  console.log("handleAcceptMatch 실행됨, matchId:", matchId);

  // matchId가 아직 null이면 active 정보 다시 받아오기
  if (!matchId) {
    console.log("⚠ matchId가 null → 서버에서 다시 불러옵니다.");

    try {
      const res = await axiosInstance.get(`/api/matching/active`);
      const apiData = res.data.data;

      if (apiData?.matchId) {
        console.log("✔ matchId 재획득 성공:", apiData.matchId);
        setMatchId(apiData.matchId);
      } else {
        alert("매칭 정보가 올바르지 않습니다.");
        return;
      }
    } catch (e) {
      console.error(e);
      return;
    }
  }

  // 이미 내가 수락 눌렀으면 중복 방지
  if (hasAccepted) {
    alert("상대방이 수락할 때까지 기다려 주세요.");
    return;
  }

  try {
    const res = await axiosInstance.post(
      `/api/matching/${matchId}/accept`,
      { userId },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✔ 매칭 수락 요청 성공");
    setHasAccepted(true);
    setWaitingAccept(true);
  } catch (error) {
    console.error("❌ 매칭 수락 실패:", error);
    alert("채팅 시작 중 오류가 발생했습니다.");
  }
};





  const handleFindAnother = async () => {
    try {
      if (!matchId) {
        console.error("matchId가 없습니다.");
        return;
      }

      await axiosInstance.post(`/api/matching/${matchId}/next`);
      console.log("다음 상대 찾기 성공");

      // 상태 초기화
      setStage("loading");
      setMatchId(null);
      setPartner(null);
      setChatRoomId(null);
      setHasAccepted(false);
      setWaitingAccept(false);
      // 폴링은 그대로 돌아가고 있으니까, 서버에서
      // 다시 WAITING → FOUND 되면 자동으로 새 매칭 붙음
    } catch (error) {
      console.error("다음 상대 찾기 오류:", error);
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

  
useEffect(() => {
  if (stage !== "chat") return;
  if (ws.current) {
    console.log("⚠️ 이미 WebSocket 연결 존재, 새로 생성 안 함");
    return;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("토큰이 없습니다.");
    return;
  }

  const socket = new WebSocket(
    `wss://instant-gretta-globoo-16d715dd.koyeb.app/ws/chat?token=${token}`
  );

  ws.current = socket;

  socket.onopen = () => console.log("WebSocket 연결 성공");
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("서버 메시지:", data);

    switch (data.type) {
      case "MESSAGE_ACK":
        setMessages((prev) => [...prev, data]);
        break;
      case "LEAVE_NOTICE":
        alert("상대방이 나갔습니다.");
        socket.close();
        break;
      default:
        console.warn("알 수 없는 메시지 타입:", data.type);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket 종료됨");
    ws.current = null; 
  };
  socket.onerror = (e) => console.error("WebSocket 에러:", e);

  return () => {
    socket.close();
    ws.current = null;
  };
}, [stage]);

    
  




const sendMessage = () => {
  if (!input.trim() || !ws.current) return;

  const payload = {
    type: "MESSAGE",
    chatRoomId,
    message: input,
  };

  console.log("[클라이언트 → 서버] 전송:", payload); 

  ws.current.send(JSON.stringify(payload));

  setInput("");
};



const handleEndChat = () => {
  if (!ws.current || !chatRoomId) return;

  const leavePayload = {
    type: "LEAVE",
    roomId: chatRoomId,
  };

  ws.current.send(JSON.stringify(leavePayload));

  setTimeout(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    setChatRoomId(null);
    setMessages([]);
    setPartner(null);

    setStage("loading"); 

    navigate("/");
  }, 100);
};



  const languageMap: Record<string, string> = {
    zh: "중국어",
    en: "영어",
    fr: "프랑스어",
    de: "독일어",
    ja: "일본어",
    ko: "한국어",
    es: "스페인어",
  };

  const countryMap: Record<string, string> = {
    KR: "대한민국",
    US: "미국",
    JP: "일본",
    CN: "중국",
    FR: "프랑스",
    DE: "독일",
    UK: "영국",
    CA: "캐나다",
    AU: "호주",
  };

  const countryCharacterImages: Record<string, string> = {
    US: AmericaProfileImg,
    KR: KoreaProfileImg,
    IT: ItalyProfileImg,
    EG: EgyptProfileImg,
    CN: ChinaProfileImg,
  };

 

  return (
    <Wrapper>
      <ColorBackground />
      <ColorBackground stage={stage}/>

      {waitingAccept && (
      <ModalWrapper>
        <ModalBox>
          상대방이 수락할 때까지 기다리는 중...
        </ModalBox>
      </ModalWrapper>
      )}
      <Container>
      { stage === "matched" && (
          <>
            <MatchedTitle>매칭에 성공했습니다!</MatchedTitle>
            <MatchedProfile>
            <ProfileImg
              src={
                partner?.profileImageUrl ||
                countryCharacterImages[partner?.country] ||
                MockImg
              }
              alt="프로필 이미지"
            />
              <ProfileName>{partner?.nickname}</ProfileName>

              <LanguageBox>
                <LanguageContent>
                  사용 언어:{" "}
                  {languageMap[
                    partner?.nativeLanguages?.[0]?.code ||
                    partner?.nativeLanguages?.[0]?.name?.toLowerCase()
                  ] || "정보 없음"}
                </LanguageContent>
                
                <LanguageContent>
                  선호 언어:{" "}
                  {languageMap[
                    partner?.learnLanguages?.[0]?.code ||
                    partner?.learnLanguages?.[0]?.name?.toLowerCase()
                  ] || "정보 없음"}
                </LanguageContent>
                
                <LanguageContent>
                  국적: {countryMap[partner?.country] || partner?.country || "정보 없음"}
                </LanguageContent>
              </LanguageBox>

              <KeywordContainer>
                <KeywordBox>#{partner?.mbti || "MBTI"}</KeywordBox>
                <KeywordBox>#{partner?.keywords?.[0]?.name || "키워드1"}</KeywordBox>
                <KeywordBox>#{partner?.keywords?.[1]?.name || "키워드2"}</KeywordBox>
                <KeywordBox>#{partner?.keywords?.[2]?.name || "키워드3"}</KeywordBox>
              </KeywordContainer>


              <ButtonContainer>
                <Button onClick={handleAcceptMatch}>채팅 시작하기</Button>
                <Button onClick={handleFindAnother}>다른 상대 찾기</Button>
              </ButtonContainer>
            </MatchedProfile>
          </>
        )}


          {stage === "loading" && (
            <>
              <Title>랜덤 매칭 중입니다...</Title>
              <SpinnerWrapper />
              <CancelButton onClick={handleCancelMatching}>
                매칭 다음에 하기
              </CancelButton>
            </>
          )}

        {stage === "chat" && (
          <>

            <MessageHeader>
            <MessageProfile
              src={
                partner?.profileImageUrl ||
                countryCharacterImages[partner?.country] ||
                MockImg
              }
              alt="프로필 이미지"
            />
              <NicnameContent>{partner?.nickname} 님이 입장하셨습니다.</NicnameContent>
              <OutIcon onClick={handleEndChat} />
            </MessageHeader>

            <MessageContainer>
              {messages.map((msg, idx) => (
                <MessageBox
                  key={idx}
                  style={{
                    alignSelf: msg.senderId === userId ? "flex-end" : "flex-start",
                    background:
                      msg.senderId === userId
                        ? "var(--skyblue)"
                        : "var(--yellow2)",
                  }}
                >
                  {msg.message}
                </MessageBox>
              ))}
            </MessageContainer>

            <SendMessageContainer>
            <SendInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력해주세요"
              onKeyUp={(e) => {
                if (e.nativeEvent.isComposing) return; 
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            </SendMessageContainer>
          </>
        )}
      </Container>
    </Wrapper>
  );
  
}

