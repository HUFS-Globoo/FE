import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import MockImg from "../assets/main-character.svg";
import { IoIosLogOut } from "react-icons/io";

type ChatMessage = {
  type: "MESSAGE_ACK" | "READ_RECEIPT" | "LEAVE_NOTICE" | "SYSTEM";
  roomId: number | string;
  messageId?: number;
  senderId?: number;
  readerId?: number;
  leaverId?: number;
  message?: string;
  lastReadMessageId?: number;
  createdAt?: string;
};

const Wrapper = styled.div`
  position: relative;
  width: 29.5625rem;
  height: 37.4375rem;
  margin: 0 auto;
  overflow: visible; 
  box-sizing: border-box;
`

const Container = styled.div`
  margin: 0 auto;
  width: 29.5625rem;
  height: 37.4375rem;
  //top: -0.4rem; 
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.5rem;
  border-radius: 2rem;
  border: 1.8px solid #FFF;
  border-radius: 2rem;
  border: 2.769px solid rgba(255, 255, 255, 0.60);
  background: linear-gradient(116deg, rgba(239, 239, 239, 0.60) 10.92%, rgba(255, 255, 255, 0.08) 96.4%);
  backdrop-filter: blur(38.07310485839844px);
  z-index: 1;
  box-sizing: border-box;
`
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
  box-sizing: border-box;
`

const Title = styled.div`
  font-family: "Hakgyoansim Dunggeunmiso TTF";
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.48213rem;
  letter-spacing: 0.075rem;
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const SpinnerWrapper = styled.div`
  margin-top: 10rem;
  width: 3rem;
  height: 3rem;
  border: 0.25rem solid rgba(0, 0, 0, 0.1);
  border-top: 0.25rem solid #002d56; 
  border-radius: 50%;
  animation: ${spin} 3s linear infinite; 
  box-sizing: border-box;
`

const CancelButton = styled.div`
  margin: 0 auto;
  margin-top: 17rem;
  color: rgba(0, 0, 0, 0.50);
  width: 7rem;
  border-bottom:  solid rgba(0, 0, 0, 0.50);;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.48213rem; 
  letter-spacing: 0.04375rem;
  text-align: center;
  cursor: pointer;
`

const MatchedTitle = styled.div`
  font-family: "Hakgyoansim Dunggeunmiso TTF";
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.48213rem;
  letter-spacing: 0.075rem;
`

const MatchedProfile = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-top: 2.13rem;
  box-sizing: border-box;
`

const ProfileImg = styled.img`
  width: 6.875rem;
  height: 6.875rem;
  border-radius: 3.125rem;
  object-fit: cover; 
  object-position: center; 
  background-color: var(--white);
  margin: 0 auto;
`

const ProfileName = styled.div`
  font-size: 1.25rem;
  font-weight: 300;
  text-align: center;
  padding-top: 1.12rem;
`
const LanguageBox = styled.div`
  padding-top: 0.94rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.87rem
`

const LanguageContent = styled.div`
  font-size: 1rem;
  font-weight: 300;
  text-align: center;
`

const KeywordContainer = styled.div`
  display: grid;
  padding-top: 1.94rem;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 1.5rem 1.94rem;
  justify-content: center;
  margin: 0 auto;
`

const KeywordBox = styled.div`
  display: flex;
  width: 5.69rem;
  height: 2.13rem;
  border-radius: 3.125rem;
  background: var(--white);
  justify-content: center;
  align-items: center;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1.44rem;
  gap: 1.06rem;
  justify-content: center;

`

const Button = styled.div`
  font-family: 'SchoolSafetyRoundedSmile';
  width: 11.875rem;
  height: 3.5rem;
  display: flex;
  border-radius: 0.75rem;
  border: 2.769px solid rgba(255, 255, 255, 0.60);
  background: linear-gradient(116deg, rgba(239, 239, 239, 0.60) 10.92%, rgba(255, 255, 255, 0.08) 96.4%);
  backdrop-filter: blur(38.07310485839844px);
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  font-size: 1rem;
  font-weight: 400;

  cursor: pointer;
`

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
  font-weight: 300;
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
`

const SendInput = styled.input`
  background-color: #E1E1E1;
  padding-left: 1.25rem;
  box-sizing: border-box;
  width: 100&;
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


export default function RandomMatchCard() {

  const mockMatchData = {
    status: "MATCHED",
    pair: {
      id: "uuid",
      roomKey: "rk_abc",
      userAId: 1,
      userBId: 22,
      createdAt: "2025-11-04T08:00:00Z",
    },
    partner: {
      userId: 22,
      nickname: "머쨍이",
      profileImage: null,
      nativeLanguages: ["ja"],
      learnLanguages: ["ko"],
      country: "KR",
      mbti: "ISTP",
      keywords: ["운동", "차분함", "아이돌"],
    },
  };

  const navigate = useNavigate();
  const [stage, setStage] = useState<"loading" | "matched" | "chat">("loading");
  const [partner, setPartner] = useState(mockMatchData.partner);
  const [messages, setMessages] = useState<{ message: string; isMine: boolean }[]>([
  { message: "안녕하세요!", isMine: false },
  { message: "안녕! 반가워요", isMine: true },
  { message: "지금 뭐 하고 있어요?", isMine: false },
  { message: "밥묵어요", isMine: true },
]);
  const [input, setInput] = useState("");

  //테스트용: 3초 뒤 매칭 성공 
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage("matched");
      setPartner(mockMatchData.partner);
    }, 3000);
    
  }, []);

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
      <ColorBackground stage={stage}/>
      <Container>
        { stage === "matched" && (
          <>
            <MatchedTitle>매칭에 성공했습니다!</MatchedTitle>
            <MatchedProfile>
              <ProfileImg src = {partner?.profileImage || MockImg} alt = "프로필 이미지"/>
              <ProfileName>{partner?.nickname}</ProfileName>
              <LanguageBox>
                <LanguageContent>사용 언어:{languageMap[partner?.nativeLanguages?.[0]]}</LanguageContent>
                <LanguageContent>선호 언어:{languageMap[partner?.learnLanguages?.[0]]}</LanguageContent>
                <LanguageContent>국적:{countryMap[partner?.country]}</LanguageContent>
              </LanguageBox>
              <KeywordContainer>
              {[...(partner?.keywords || []), partner?.mbti].map((word, idx) => (
                <KeywordBox key={idx}>#{word}</KeywordBox>
              ))}
              </KeywordContainer>
              <ButtonContainer>
                <Button
                  onClick={() => {
                      setStage("chat");
                  }}
                >채팅 시작하기</Button>
                <Button
                  onClick={() => {
                    setStage("loading");
                    setTimeout(() => setStage("matched"), 3000);
                  }}
                >
                다른 상대 찾기
                </Button>
              </ButtonContainer>
            </MatchedProfile>
          </>
        )}
        {stage === "loading" && (
          <>
            <Title>랜덤 매칭 중입니다...</Title>
            <SpinnerWrapper />
            <CancelButton onClick={() => navigate("/")}>
              매칭 다음에 하기
            </CancelButton>
          </>
        )}

        {stage === "chat" && (
          <>
            <MessageHeader>
              <MessageProfile src={MockImg} alt="프로필 이미지"/>
              <NicnameContent>{mockMatchData.partner.nickname} 님이 입장하셨습니다.</NicnameContent>
              <OutIcon onClick={() => navigate("/")}/>
            </MessageHeader>
            <MessageContainer>
            {messages.map((msg, idx) => (
              <MessageBox
                key={idx}
                style={{
                  alignSelf: msg.isMine ? "flex-end" : "flex-start",
                  background: msg.isMine ? "var(--skyblue)" : "var(--yellow2)",
                }}
              >
                {msg.message}
              </MessageBox>
            ))}
            </MessageContainer>
            <SendMessageContainer>
              <SendInput placeholder="메시지를 입력해주세요"/>
            </SendMessageContainer>
          </>
        )}
      </Container>
    </Wrapper>
  );
}

