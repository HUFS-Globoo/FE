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
import axiosInstance from "../../axiosInstance";
import { useEffect } from "react";


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
  word-wrap: break-word; 
  overflow-wrap: break-word; 
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
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const currentUserId = Number(localStorage.getItem("userId"));
  type MessageItem = {
    id: number;
    message: string;
    isMine: boolean;
    isRead: boolean;
  };
  
  const [messages, setMessages] = useState<MessageItem[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const res = await axiosInstance.get("/api/messages"); 
        console.log("쪽지방 목록 조회 성공:", res.data);
        setChatRooms(res.data); 
      } catch (error) {
        console.error("쪽지방 목록 조회 실패:", error);
      }
    };
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (!selectedProfile) return;
  
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/api/messages/${selectedProfile.id}`);
        console.log(` ${selectedProfile.username}과의 대화 조회 성공:`, res.data);
  
        const formattedMessages = res.data.map((msg: any) => ({
          id: msg.id,
          message: msg.content,
          isMine: Number(msg.sender.id) === Number(currentUserId),
          isRead: msg.isRead,
        }));
        setMessages(formattedMessages);
  
        await axiosInstance.post(`/api/messages/${selectedProfile.id}/read`);
        console.log(`${selectedProfile.username}의 메시지 읽음 처리 완료`);
      } catch (error) {
        console.error(`쪽지 조회 실패 (${selectedProfile.username}):`, error);
      }
    };
  
    fetchMessages();
  
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [selectedProfile]);
  

  const [newMessage, setNewMessage] = useState("");



  const handleSendMessage = async () => {
    if (!selectedProfile || newMessage.trim() === "") return;

    try {
      const res = await axiosInstance.post("/api/messages", {
        partnerId: selectedProfile.id, 
        content: newMessage,
      });

      console.log("메시지 전송 성공:", res.data);

      const newMsg = {
        id: res.data.id,
        message: res.data.content,
        isMine: res.data.sender.id === currentUserId, 
        isRead: res.data.isRead,
      };

      setMessages((prev) => [...prev, newMsg]); 
      setNewMessage(""); 

      const container = document.getElementById("messageContainer");
      if (container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 100);
      }
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };


  

  const COUNTRY_IMAGE_MAP: Record<string, string> = {
    KR: KoreaProfileImg,
    US: AmericaProfileImg,
    IT: ItalyProfileImg,
    EG: EgyptProfileImg,
    CN: ChinaProfileImg,
  };

  type ProfileCardItem = {
    userId: number;
    nickname: string;
    campus: 'GLOBAL' | 'SEOUL';
    country: 'KR' | 'US' | 'IT' | 'EG' | 'CN';
    languages: {
      native: string[];
      learn: string[];
    };
    mbti: string;
    keywords: string[];
    intro: string;
    profileImage: string | null;
  };

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
            {chatRooms.length > 0 ? (
              chatRooms.map((room) => {
                // 현재 로그인 유저가 user1인지 user2인지 판단해야 함
                const currentUserId = Number(localStorage.getItem("userId")); // 필요 시 수정
                const partner = room.user1.id === currentUserId ? room.user2 : room.user1;

                return (
                  <MessageListBox
                    key={room.id}
                    onClick={() => setSelectedProfile(partner)}
                    style={{ cursor: "pointer" }}
                  >
                    <CharacterImage
                      src={partner.profileImageUrl || KoreaProfileImg}
                      alt={`${partner.username} 이미지`}
                    />
                    <MessageNickname className="H4">{partner.username}</MessageNickname>
                  </MessageListBox>
                );
              })
            ) : (
              <p>쪽지방이 없습니다.</p>
            )}
          </MessageList>
        </MessageListContainer>


        <ChatContainer>
          <ChatBox>
          {selectedProfile ? (
            <ChatHeader>
              <ChatProfileImg
                src={COUNTRY_IMAGE_MAP[selectedProfile.country] || KoreaProfileImg}
              />
              <ChatNicname className="H2">{selectedProfile.username}</ChatNicname>
              <OutContainer onClick={() => navigate("/")}>
                <OutIcon />
                <OutText className="Button2">채팅방 나가기</OutText>
              </OutContainer>
            </ChatHeader>
          ) : (
            <ChatHeader>
              <ChatNicname className="H2">대화를 선택해주세요</ChatNicname>
            </ChatHeader>
          )}
            <MessageContainer id="messageContainer">
              {selectedProfile ? (
                messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: msg.isMine ? "flex-end" : "flex-start",
                        width: "100%",
                        marginBottom: "0.5rem", // 메시지 간격
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "70%",
                          textAlign: msg.isMine ? "right" : "left",
                        }}
                      >
                        <MessageBox
                          style={{
                            background: msg.isMine ? "#BEF0FF" : "var(--yellow2)",
                            borderRadius: msg.isMine
                              ? "0.75rem 0 0.75rem 0.75rem" // 오른쪽 말풍선
                              : "0 0.75rem 0.75rem 0.75rem", // 왼쪽 말풍선
                          }}
                        >
                          {msg.message}
                        </MessageBox>
                        
                        {msg.isMine && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: msg.isRead ? "#7C8A9A" : "#C0C0C0",
                              marginTop: "0.25rem",
                            }}
                          >
                            {msg.isRead ? "✔ 읽음" : "전송됨"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>아직 주고받은 쪽지가 없습니다.</p>
                )
              ) : (
                <p>대화 상대를 선택하면 쪽지 내역이 표시됩니다.</p>
              )}
            </MessageContainer>


            <SendBox>
              <SendInput
                type="text"
                placeholder="메시지를 입력해주세요"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <SendButton className="H4" onClick={handleSendMessage}>
                보내기
              </SendButton>
            </SendBox>

          </ChatBox>

        </ChatContainer>
      </ContentContainer>
    </Container>
  )
}