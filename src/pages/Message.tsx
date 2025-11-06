import styled from "styled-components";
import Icon from "../assets/messageIcon.svg";
import AmericaProfileImg from "../assets/img-profile1-America.svg";
import KoreaProfileImg from "../assets/img-profile1-Korea.svg";
import ItalyProfileImg from "../assets/img-profile1-Italy.svg";
import EgyptProfileImg from "../assets/img-profile1-Egypt.svg";
import ChinaProfileImg from "../assets/img-profile1-China.svg";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--gray-text-filled);
  padding-left: 6.38rem;
  padding-top: 4rem;
  gap: 2.5rem;
  box-sizing: border-box;
`
const Title = styled.div`
  color: var(--Secondary-500, #1A202C);
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  flex-wrap: nowrap;
  width: 100%;
  align-items: flex-start;
`
const MessageListContainer = styled.div`
  display: flex;
  width: 32.56rem;
  padding: 1rem 2rem;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--gray, #E0E0E0);
  background: var(--white);
`

const MessageListTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`

const MessageCharacter = styled.img`
  width: 2.26rem;
  height: 1.81313rem;
`

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;
`

const MessageListBox = styled.div`
  display: flex;
  padding: 0.25rem 1.25rem;
  align-items: center;
  gap: 1.25rem;
  align-self: stretch;
  background: var(--white);
`

const MessageNickname = styled.div`
  color: var(--Secondary-500, #1A202C);
`

const CharacterImage = styled.img`
  width: 3rem;
  height: 3.497rem;
`
const ChatContainer = styled.div`
  display: flex;
  width: 46.125rem;
  height: 56.0625rem;
  padding: 2rem;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.75rem;
border: 1px solid var(--gray);
background: var(--white);
`

const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5rem;
  flex: 1 0 0;
  align-self: stretch;
`

const ChatHeader = styled.div`
  display: flex;
  padding: 0 1.25rem 1rem 1.25rem;
  align-items: center;
  gap: 1.25rem;
  align-self: stretch;
  border-bottom: 1px solid var(--gray, #E0E0E0);
  background: var(--white, #FFFEFB);
`

const ChatProfileImg = styled.img`
  width: 5rem;
  height: 5.82838rem;
`

const ChatNicname = styled.div`
  color: var(--Secondary-500, #1A202C);
`
const OutContainer = styled.div`
  display: flex;
  margin-left: auto; 
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  align-items: center;
  gap: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #FF8282;
  cursor: pointer;
`

const OutIcon = styled(IoIosLogOut)`
  width: 1rem;
  height: 1rem;
  color: #FF8282;
`

const OutText = styled.div`
  color: #FF8282;
`

const PartnerProfileImg = styled.img`
  width: 3rem;
  height: 3.497rem;
`

const PartnerNickname = styled.div`
  font-family: 'SchoolSafetyRoundedSmile', sans-serif;
  font-size: 16px;
  font-weight: 700; 
  letter-spacing: -0.01em; 
  line-height: 1.4; 
  color: var(--Secondary-500, #1A202C);
`

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 42.13rem;
  gap: 0.5rem;
`

const MessageBox = styled.div`
  padding: 0.75rem 1rem;
  box-sizing: border-box;
  border-radius: 0 0.75rem 0.75rem 0.75rem;
  background: var(--yellow2);
  align-items: center;
  max-width: 70%;
  word-wrap: break-word; /* 단어가 길면 자동 줄바꿈 */
  overflow-wrap: break-word; /* 최신 표준 (word-wrap 대체) */
  white-space: pre-wrap;
`
const PartnerBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.25rem;
`

const SendBox = styled.div`
  display: flex;
  height: 4.31rem;
  width: 100%;
  gap: 1.25rem;
  padding-bottom: 1rem;
  margin-top: auto;
`

const SendInput = styled.input`
  height: 100%;
  width: 34rem;
  display: flex;
  padding: 0.75rem 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: var(--gray-text-filled, #F3F4F6);
  align-items: center;
  border: none;

  &::placeholder {
    font-size: 0.875rem;
    font-weight: 500;
    font-weight: 300;
    line-height: 160%;
  }
  &:focus {
    outline: none; 
  }
`

const SendButton = styled.div`
  display: flex;
  padding: 0.75rem 1.25rem;
  justify-content: center;
  align-items: center;
  flex: 1;
  gap: 1.25rem;
  border-radius: 0.75rem;
  box-sizing: border-box;
  background: var(--skyblue, #66CAE7);
  cursor: pointer;
`
export default function Message() {

  const navigate = useNavigate();


  const [messages, setMessages] = useState<{ message: string; isMine: boolean }[]>([
    { message: "안녕하세요!", isMine: false },
    { message: "안녕하세요! ", isMine: true },
    { message: "지금 뭐 하고 있어요?", isMine: false },
    { message: "밥묵어요", isMine: true },
  ]);

  const COUNTRY_IMAGE_MAP: Record<string, string> = {
    KR: KoreaProfileImg,
    US: AmericaProfileImg,
    IT: ItalyProfileImg,
    EG: EgyptProfileImg,
    CN: ChinaProfileImg,
  };

  const BASE_PROFILES: ProfileCardItem[] = [
    { 
      userId: 1, 
      nickname: '왕길동쓰', 
      campus: 'GLOBAL', 
      country: 'KR', 
      languages: { native: ['ko'], learn: ['en'] },
      mbti: 'ENFP', 
      keywords: ['긍정적', '운동', '음악', '여행'], 
      intro: '"저는 운동과 음악을 좋아하는 학생인데 저와 비슷한 분 찾아봐요 ㅎㅎ"\n멋사 친구들과 함께 개발하는 걸 좋아하고, 번개 모임도 대환영합니다 ㅎㅎ 잘 부탁드려요!', 
      profileImage: null 
    },
    { 
      userId: 2, 
      nickname: 'Justin M.', 
      campus: 'SEOUL', 
      country: 'US', 
      languages: { native: ['en'], learn: ['ko'] },
      mbti: 'ISTJ', 
      keywords: ['개발', '독서', '여행'], 
      intro: '"저는 운동과 음악을 좋아하는 학생인데 저와 비슷한 분 찾아봐요 ㅎㅎ"\nA highly motivated individual looking for a study buddy. I enjoy learning new languages and meeting people from different cultures.', 
      profileImage: null 
    },
    { 
      userId: 3, 
      nickname: 'Chiara R.', 
      campus: 'GLOBAL', 
      country: 'IT', 
      languages: { native: ['it'], learn: ['ko', 'en'] },
      mbti: 'INFP', 
      keywords: ['요리', '미술', '커피'], 
      intro: '"저는 운동과 음악을 좋아하는 학생인데 저와 비슷한 분 찾아봐요 ㅎㅎ"\nCiao! 이탈리아 문화에 관심 있는 친구를 찾아요. 함께 언어 교환하며 문화도 나눠요.', 
      profileImage: null 
    },
    { 
      userId: 4, 
      nickname: 'Ramses', 
      campus: 'SEOUL', 
      country: 'EG', 
      languages: { native: ['ar'], learn: ['ko'] },
      mbti: 'ENTP', 
      keywords: ['토론', '역사', '여행'], 
      intro: '"저는 운동과 음악을 좋아하는 학생인데 저와 비슷한 분 찾아봐요 ㅎㅎ"\n한국어 공부에 열심인 이집트 학생입니다. 환영합니다! 역사와 문화 이야기를 나누고 싶어요.', 
      profileImage: null 
    },
    { 
      userId: 5, 
      nickname: 'Li Wei', 
      campus: 'GLOBAL', 
      country: 'CN', 
      languages: { native: ['zh'], learn: ['ko', 'en'] },
      mbti: 'ENFJ', 
      keywords: ['음식', '여행', '사진'], 
      intro: '"저는 운동과 음악을 좋아하는 학생인데 저와 비슷한 분 찾아봐요 ㅎㅎ"\n중국 문화와 한국 문화를 나누고 싶어요! 맛있는 음식과 여행 이야기를 좋아합니다.', 
      profileImage: null 
    },
  ];

  const [selectedProfile, setSelectedProfile] = useState(BASE_PROFILES[0]);

  return(
    <Container>
      <Title className="H1">쪽지</Title>
      <ContentContainer>
        <MessageListContainer>
          <MessageListTitle>
            <MessageCharacter src = {Icon} alt="icon"/>
            <p className="H4" style={{color:"var(--gray-700)"}}>대화 나눈 친구들</p>
          </MessageListTitle>
          <MessageList>
            {BASE_PROFILES.map((profile) => (
              <MessageListBox
                key={profile.userId}
                onClick={() => setSelectedProfile(profile)} // 클릭 시 선택
                style={{
                  cursor: "pointer"
                }}
              >
                <CharacterImage
                  src={COUNTRY_IMAGE_MAP[profile.country]}
                  alt={`${profile.nickname} 이미지`}
                />
                <MessageNickname className="H4">{profile.nickname}</MessageNickname>
              </MessageListBox>
            ))}
          </MessageList>
        </MessageListContainer>
        <ChatContainer>

          <ChatBox>
            <ChatHeader>
              <ChatProfileImg src={ChinaProfileImg}/>
              <ChatNicname className="H2">{selectedProfile.nickname}</ChatNicname>
              <OutContainer onClick={() => navigate("/")}>
                <OutIcon />
                <OutText className="Button2">채팅방 나가기</OutText>
              </OutContainer>
            </ChatHeader>
            <MessageContainer>
            {messages.map((msg, idx) => (
              <MessageBox
                key={idx}
                style={{
                  alignSelf: msg.isMine ? "flex-end" : "flex-start",
                  background: msg.isMine ? "#BEF0FF" : "var(--yellow2)",
                }}
              >
                {msg.message}
              </MessageBox>
              ))}
            </MessageContainer>
            <SendBox>
              <SendInput type="text" placeholder="메시지를 입력해주세요" />
              <SendButton className="H4">보내기</SendButton>
            </SendBox>
          </ChatBox>

        </ChatContainer>
      </ContentContainer>
    </Container>
  )
}