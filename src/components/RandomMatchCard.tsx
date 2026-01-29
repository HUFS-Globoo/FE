import styled, { keyframes } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Client, IMessage } from "@stomp/stompjs";
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
  align-items: center;
  margin-top: -2.5rem;
  padding: 0 1.69rem;
  box-sizing: border-box;
  gap: 0.5rem;
`;


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
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OutIcon = styled(IoIosLogOut)`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  margin-left: auto;
  flex-shrink: 0;
`;

const MessageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  box-sizing: border-box;
  gap: 0.5rem;
`;

const SendInput = styled.input`
  background-color: #E1E1E1;
  padding-left: 1.25rem;
  box-sizing: border-box;
  flex: 1;
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

`;

const SendButton = styled.button`
  min-width: 3.5rem;
  height: 1.875rem;
  border-radius: 999px;
  border: none;
  background: var(--skyblue);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  white-space: nowrap;
`;

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
  //width: 18rem;
  padding: 2rem;
  box-sizing: border-box;
  border-radius: 1.2rem;
  background: white;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
`;



interface ChatMessage {
  messageId: number;
  senderId: number;
  senderNickname?: string;
  senderProfileImageUrl?: string;
  message: string;
  sentAt?: string;
  isMine?: boolean;
  isRead?: boolean;
}

export default function RandomMatchCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDesignPreview = searchParams.get("design") === "chat"; // 디자인용 프리뷰 모드 (?design=chat)
  const userId = location.state?.userId || Number(localStorage.getItem("userId"));
  const matchClientRef = useRef<Client | null>(null);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [partner, setPartner] = useState<any>(null);
  const [stage, setStage] = useState<"loading" | "matched" | "chat" | "waiting_accept">(
    isDesignPreview ? "chat" : "loading"
  );
  const [matchId, setMatchId] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const token = localStorage.getItem("accessToken");
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);
  const [waitingAccept, setWaitingAccept] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [wsReady, setWsReady] = useState(false);
  const hasLeftChatRef = useRef(false); // 나가기 버튼을 눌렀는지 추적 (ref로 동기적 체크)
  const hasJoinedRef = useRef(false); // JOIN 메시지를 보냈는지 추적

// 매칭 소켓(STOMP) 연결 및 상태 구독
useEffect(() => {
  // 디자인 프리뷰 모드에서는 실제 매칭 소켓 연결을 건너뜀
  if (isDesignPreview) {
    setStage("chat");
    setPartner({
      nickname: "DesignPreviewUser",
      nativeLanguages: [{ code: "ko" }],
      learnLanguages: [{ code: "en" }],
      country: "KR",
      mbti: "ENFP",
      keywords: [{ name: "Design" }, { name: "Preview" }, { name: "Globoo" }],
    });
    return;
  }

  if (!userId) return;

  // ⭐️ 1. 먼저 매칭 큐에 입장
  const connectMatching = async () => {
    try {
      await axiosInstance.post("/api/matching/queue", { userId });
      console.log("✅ 매칭 큐 입장 성공");

      // 🔍 매칭 큐 입장 후 서버 기준 현재 내 매칭 상태 확인
      try {
        const activeRes = await axiosInstance.get("/api/matching/active");
        const activeData = activeRes.data?.data ?? activeRes.data;

        console.log("🔍 현재 매칭 상태(/api/matching/active) 원본 응답:", activeRes.data);

        if (activeData) {
          const status = activeData.status;
          const matchIdFromApi = activeData.matchId;

          console.log(
            `📌 서버 기준 매칭 상태: status=${status}, matchId=${matchIdFromApi}`
          );
        } else {
          console.log("⚠️ /api/matching/active 응답에 data가 없습니다.");
        }
      } catch (activeErr) {
        console.error("❌ 현재 매칭 상태 조회 실패(/api/matching/active):", activeErr);
      }

      // ⭐️ 2. 그 다음 STOMP 연결 (순수 WebSocket 사용)
      console.log("STOMP 연결 시도 시작, userId:", userId);
      const client = new Client({
        brokerURL: "wss://globoo.duckdns.org/ws/match",
        connectHeaders: {
          userId: String(userId),
        },
        debug: (str) => {
          console.log("STOMP 디버그:", str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("✅ 매칭 STOMP 연결 성공");
          client.subscribe("/user/queue/matching", (message: IMessage) => {
            console.log("📨 [STOMP] 매칭 메시지 수신:", message.body);
            try {
              const payload = JSON.parse(message.body);
              const { status } = payload;
              console.log("📨 [STOMP] 파싱된 payload:", payload);

              if (status === "FOUND") {
                console.log("✅ [STOMP] FOUND 상태 수신 → 화면 전환 시도");
              // profileA, profileB 중 나를 제외한 상대 프로필을 partner로 설정
              const { profileA, profileB, matchId: foundMatchId } = payload;

              // 서버에서 내려주는 matchId를 바로 저장
              if (foundMatchId) {
                setMatchId(String(foundMatchId));
              }

              const me =
                profileA?.userId === userId
                  ? profileA
                  : profileB?.userId === userId
                  ? profileB
                  : null;

              const opponent =
                me && profileA?.userId === me.userId ? profileB : profileA;

              if (opponent) {
                setPartner(opponent);
              }

                setStage("matched");
                console.log("   - ✅ [STOMP] stage를 'matched'로 설정 완료");
              } else if (status === "CHATTING") {
                console.log("✅ [STOMP] CHATTING 상태 수신 → 채팅 화면으로 전환");
                const { chatRoomId: roomId } = payload;

                if (roomId) {
                  setChatRoomId(roomId);
                  localStorage.setItem("chatRoomId", String(roomId));
                }

                setStage("chat");
                setWaitingAccept(false);

                // 매칭 소켓은 더 이상 사용하지 않으므로 종료
                if (matchClientRef.current) {
                  matchClientRef.current.deactivate();
                  matchClientRef.current = null;
                }
                console.log("   - ✅ [STOMP] stage를 'chat'으로 설정 완료");
              } else {
                console.log("⚠️ [STOMP] 알 수 없는 status:", status);
              }
            } catch (parseErr) {
              console.error("❌ [STOMP] 메시지 파싱 실패:", parseErr, "원본:", message.body);
            }
          });
        },
        onStompError: (frame) => {
          console.error("❌ 매칭 STOMP 에러:", frame);
          console.error("에러 헤더:", frame.headers);
          console.error("에러 메시지:", frame.headers["message"] || frame.body);
        },
        onWebSocketError: (event) => {
          console.error("❌ 매칭 WebSocket 에러:", event);
        },
        onDisconnect: () => {
          console.log("⚠️ 매칭 STOMP 연결 종료됨");
        },
      });

      console.log("STOMP client.activate() 호출");
      client.activate();
      matchClientRef.current = client;
      
      // 연결 상태 확인 (5초 후)
      setTimeout(() => {
        if (client.connected) {
          console.log("✅ STOMP 연결 상태: 연결됨");
        } else {
          console.warn("⚠️ STOMP 연결 상태: 연결 안 됨");
        }
      }, 5000);
    } catch (error: any) {
      // 이미 큐에 등록되어 있거나 다른 에러인 경우에도 STOMP 연결은 시도
      if (error?.response?.status === 400 || error?.response?.status === 409) {
        console.log("이미 매칭 큐에 등록되어 있음, STOMP 연결 진행");
      } else {
        console.error("매칭 큐 입장 실패:", error);
      }

      // 에러가 나도 STOMP 연결은 시도 (이미 등록되어 있을 수 있음)
      const client = new Client({
        brokerURL: "wss://globoo.duckdns.org/ws/match",
        connectHeaders: {
          userId: String(userId),
        },
        onConnect: () => {
          console.log("매칭 STOMP 연결 성공");
          client.subscribe("/user/queue/matching", (message: IMessage) => {
            const payload = JSON.parse(message.body);
            const { status } = payload;

            if (status === "FOUND") {
              const { profileA, profileB, matchId: foundMatchId } = payload;

              // 서버에서 내려주는 matchId를 바로 저장
              if (foundMatchId) {
                setMatchId(String(foundMatchId));
              }
              const me =
                profileA?.userId === userId
                  ? profileA
                  : profileB?.userId === userId
                  ? profileB
                  : null;
              const opponent =
                me && profileA?.userId === me.userId ? profileB : profileA;
              if (opponent) {
                setPartner(opponent);
              }
              setStage("matched");
            } else if (status === "CHATTING") {
              const { chatRoomId: roomId } = payload;
              if (roomId) {
                setChatRoomId(roomId);
                localStorage.setItem("chatRoomId", String(roomId));
              }
              setStage("chat");
              setWaitingAccept(false);
              if (matchClientRef.current) {
                matchClientRef.current.deactivate();
                matchClientRef.current = null;
              }
            }
          });
        },
        onStompError: (frame) => {
          console.error("매칭 STOMP 에러:", frame.headers["message"] || frame);
        },
        onWebSocketError: (event) => {
          console.error("매칭 WebSocket 에러:", event);
        },
      });
      client.activate();
      matchClientRef.current = client;
    }
  };

  connectMatching();

  return () => {
    if (matchClientRef.current) {
      matchClientRef.current.deactivate();
      matchClientRef.current = null;
    }
  };
}, [userId, isDesignPreview]);

useEffect(() => {
  const handleLeave = () => {
    if (!userId) return;
    axiosInstance
      .delete("/api/matching/queue", {
        data: { userId },
      })
      .catch(() => {});
  };

  window.addEventListener("beforeunload", handleLeave);
  window.addEventListener("pagehide", handleLeave);

  return () => {
    window.removeEventListener("beforeunload", handleLeave);
    window.removeEventListener("pagehide", handleLeave);
  };
}, [userId]);

// 3초마다 유저 매칭 상태를 콘솔에 출력하고, FOUND 상태면 화면 전환
// 채팅 단계에서는 상태 확인 불필요 (이미 채팅 중이므로)
useEffect(() => {
  if (isDesignPreview || !userId || stage === "chat") return;

  const logUserStatus = async () => {
    try {
      const res = await axiosInstance.get("/api/matching/active");
      const apiData = res.data?.data ?? res.data;

      if (apiData) {
        console.log("🔄 [3초 주기] 유저 매칭 상태:", {
          status: apiData.status,
          matchId: apiData.matchId,
          userAId: apiData.userAId,
          userBId: apiData.userBId,
          chatRoomId: apiData.chatRoomId,
        });

        // REST API로 FOUND 상태를 받았는데 화면이 아직 matched가 아니면 화면 전환
        if (apiData.status === "FOUND" && stage !== "matched") {
          console.log("🔄 REST API에서 FOUND 상태 감지 → 화면 전환 시도");
          
          // matchId 저장
          if (apiData.matchId) {
            setMatchId(String(apiData.matchId));
          }

          // 상대 프로필 가져오기
          const opponentId =
            apiData.userAId === userId ? apiData.userBId : apiData.userAId;

          if (opponentId && !partner) {
            console.log("   - 상대 프로필 조회 중... (opponentId:", opponentId, ")");
            try {
              const profileRes = await axiosInstance.get(`/api/profiles/${opponentId}`);
              console.log("   - 상대 프로필 조회 성공:", profileRes.data);
              setPartner(profileRes.data);
            } catch (profileErr) {
              console.error("   - 상대 프로필 조회 실패:", profileErr);
            }
          }

          // 화면 전환
          setStage("matched");
          console.log("   - ✅ stage를 'matched'로 설정 완료 (REST API 기반)");
        }

        // ACCEPTED_BOTH 상태면 채팅으로 전환
        if (apiData.status === "ACCEPTED_BOTH" && stage !== "chat") {
          console.log("🔄 REST API에서 ACCEPTED_BOTH 상태 감지 → 채팅 화면으로 전환");
          
          if (apiData.chatRoomId) {
            setChatRoomId(apiData.chatRoomId);
            localStorage.setItem("chatRoomId", String(apiData.chatRoomId));
          }

          setStage("chat");
          setWaitingAccept(false);

          // 매칭 소켓 종료
          if (matchClientRef.current) {
            matchClientRef.current.deactivate();
            matchClientRef.current = null;
          }
        }
      } else {
        console.log("🔄 [3초 주기] 유저 매칭 상태: 매칭 정보 없음 (큐 대기 중일 수 있음)");
      }
    } catch (err) {
      console.error("🔄 [3초 주기] 유저 매칭 상태 조회 실패:", err);
    }
  };

  // 즉시 한 번 실행
  logUserStatus();

  // 3초마다 실행
  statusIntervalRef.current = setInterval(logUserStatus, 3000);

  return () => {
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
    }
  };
}, [userId, isDesignPreview, stage, partner]);

// 채팅 단계로 전환되면 상태 확인 interval 중지
useEffect(() => {
  if (stage === "chat" && statusIntervalRef.current) {
    console.log("채팅 단계 진입 → 3초 주기 상태 확인 중지");
    clearInterval(statusIntervalRef.current);
    statusIntervalRef.current = null;
  }
}, [stage]);

const handleAcceptMatch = async () => {
  console.log("handleAcceptMatch 실행됨, matchId:", matchId);

  let currentMatchId = matchId;

  if (!currentMatchId) {
    console.log("matchId가 null → 서버에서 다시 불러옵니다.");

    try {
      const res = await axiosInstance.get(`/api/matching/active`);
      const apiData = res.data.data;

      if (apiData?.matchId) {
        console.log("matchId 재획득 성공:", apiData.matchId);
        currentMatchId = String(apiData.matchId);
        setMatchId(currentMatchId);
      } else {
        alert(t("randomMatch.alert.invalidMatchInfo"));
        return;
      }
    } catch (e) {
      console.error(e);
      return;
    }
  }

  // 이미 내가 수락 눌렀으면 중복 방지
  if (hasAccepted) {
    alert(t("randomMatch.alert.waitForAccept"));
    return;
  }

  try {
    const res = await axiosInstance.post(
      `/api/matching/${currentMatchId}/accept`,
      { userId },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("매칭 수락 요청 성공");
    setHasAccepted(true);
    setWaitingAccept(true);
  } catch (error) {
    console.error("매칭 수락 실패:", error);
    alert(t("randomMatch.alert.chatStartError"));
  }
};


// 다른 상대 찾기(거절)
const handleFindAnother = async () => {
  try {
    let currentMatchId = matchId;

    if (!currentMatchId) {
      const res = await axiosInstance.get(`/api/matching/active`);
      const apiData = res.data.data;

      if (!apiData?.matchId) {
        alert(t("randomMatch.alert.noMatchInfo"));
        return;
      }

      currentMatchId = apiData.matchId;
      setMatchId(currentMatchId);
    }

    await axiosInstance.post(`/api/matching/${currentMatchId}/next`);
    console.log("다음 상대 찾기 성공");

    // 상태 초기화
    setStage("loading");
    setMatchId(null);
    setPartner(null);
    setChatRoomId(null);
    setHasAccepted(false);
    setWaitingAccept(false);

  } catch (error) {
    console.error("다음 상대 찾기 오류:", error);
    alert(t("randomMatch.alert.findAnotherError"));
  }
};


  // 매칭 취소 
  const handleCancelMatching = async () => {
    try {
      // 매칭 소켓도 먼저 종료
      if (matchClientRef.current) {
        matchClientRef.current.deactivate();
        matchClientRef.current = null;
      }

      const response = await axiosInstance.delete("/api/matching/queue", { 
        data: { userId } 
      });
      console.log("매칭 대기열에서 나가기 성공:", response.data);
      
      navigate("/");
    } catch (error: any) {
      console.error("매칭 대기열 나가기 실패:", error);
      console.error("에러 상세:", error?.response?.data || error?.message);
      
      // 에러가 나도 홈으로 이동 (이미 나간 상태일 수 있음)
      navigate("/");
    }
  };

  
  useEffect(() => {
    // 디자인 프리뷰 모드에서는 웹소켓 연결을 생략하고 UI만 노출
    if (isDesignPreview) return;

    if (stage !== "chat") return;
  
    setWsReady(false);
    hasLeftChatRef.current = false; // 채팅방 입장 시 나가기 플래그 초기화
    hasJoinedRef.current = false; // 채팅방 입장 시 JOIN 플래그 초기화
  
    if (ws.current) {
      console.log("이미 WebSocket 연결 존재 → 재활성화");
      
      if (ws.current.readyState === WebSocket.OPEN) {
        setWsReady(true);
      }
  
      return;
    }
  

  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("토큰이 없습니다.");
    return;
  }

  const socket = new WebSocket(
    `wss://globoo.duckdns.org/ws/chat?token=${token}`
  );

  ws.current = socket;

  socket.onopen = () => {
    console.log("✅ [채팅 WebSocket] 연결 성공");
    console.log("   - URL: wss://globoo.duckdns.org/ws/chat");
    console.log("   - chatRoomId:", chatRoomId);
    
    // 채팅방 입장을 위해 JOIN 메시지 먼저 전송
    if (chatRoomId) {
      const joinPayload = {
        type: "JOIN",
        chatRoomId: chatRoomId,
      };
      console.log("📤 [채팅 WebSocket] JOIN 메시지 전송:", joinPayload);
      socket.send(JSON.stringify(joinPayload));
      hasJoinedRef.current = true;
      
      // JOIN 메시지를 보낸 후 서버가 처리할 시간을 주기 위해 약간의 딜레이
      // 서버에서 JOIN_ACK를 보내면 그때 wsReady를 true로 설정하는 것이 더 좋지만,
      // 일단 딜레이로 처리
      setTimeout(() => {
        setWsReady(true);
        console.log("✅ [채팅 WebSocket] wsReady = true (JOIN 처리 완료 대기 후)");
      }, 300); // 300ms 딜레이
    } else {
      console.warn("⚠️ [채팅 WebSocket] chatRoomId가 없어서 JOIN 메시지를 보낼 수 없습니다.");
      setWsReady(true); // chatRoomId가 없어도 일단 ready로 설정
    }
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("📨 [채팅 WebSocket] 서버 메시지 수신:", data);
  
    switch (data.type) {
      case "JOIN_ACK":
      case "JOIN_SUCCESS":
        // 서버가 JOIN을 처리했다는 응답을 받으면 wsReady를 true로 설정
        console.log("✅ [채팅 WebSocket] JOIN 응답 수신 → wsReady = true");
        setWsReady(true);
        break;
        
      case "MESSAGE_ACK": {
        const normalized: ChatMessage = {
          messageId: data.messageId,
          senderId: data.senderId,
          senderNickname: data.senderNickname,
          senderProfileImageUrl: data.senderProfileImageUrl,
          message: data.message,
          sentAt: data.sentAt,
          isMine: data.senderId === userId,
        };

        setMessages((prev) => [...prev, normalized]);
        break;
      }
  
      case "LEAVE_NOTICE":
        // 나가기 버튼을 누른 사람은 이미 alert를 봤으므로, 상대방에게만 alert 표시
        if (!hasLeftChatRef.current) {
          alert(t("randomMatch.chat.leftChat"));
        }
  
        setChatRoomId(null);
        setMessages([]);
        setPartner(null);
        setStage("loading");
  
        socket.close();
        ws.current = null;
  
        navigate("/");
  
        break;
  
      default:
        console.warn("알 수 없는 메시지 타입:", data.type);
    }
  };
  

  socket.onclose = (event) => {
    console.log("⚠️ [채팅 WebSocket] 연결 종료됨");
    console.log("   - code:", event.code);
    console.log("   - reason:", event.reason || "없음");
    console.log("   - wasClean:", event.wasClean);
    ws.current = null; 
  };
  socket.onerror = (e) => {
    console.error("❌ [채팅 WebSocket] 에러:", e);
  };

  return () => {
    socket.close();
    ws.current = null;
  };
}, [stage, chatRoomId]);

    
  


  const sendMessage = () => {
    if (!input.trim()) return;
  
    if (!chatRoomId) {
      console.warn("chatRoomId 없음 → 첫 메시지 전송 불가");
      return;
    }
  
    if (!ws.current || !wsReady) {
      console.log("웹소켓 준비 안됨");
      return;
    }
  
    const payload = {
      type: "MESSAGE",
      chatRoomId,
      message: input,
    };
  
    ws.current.send(JSON.stringify(payload));
    setInput("");
  };
  

  const handleEndChat = () => {
    if (!ws.current || !chatRoomId) return;
  
    console.log("채팅방에서 나가기 요청 전송:", chatRoomId);

    // 나가기 버튼을 눌렀다는 플래그 설정 (LEAVE_NOTICE를 받아도 alert 안 띄우기 위해)
    hasLeftChatRef.current = true;

    const leavePayload = {
      type: "LEAVE",
      chatRoomId,
    };
  
    ws.current.send(JSON.stringify(leavePayload));
  
    // 나가기 버튼을 누른 사람에게 "대화방을 나갔습니다" alert 표시
    alert(t("randomMatch.chat.leftChat"));
  
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
  


  // 언어와 국적 맵을 번역 함수로 동적으로 가져오기
  const getLanguageName = (code: string): string => {
    return t(`randomMatch.languages.${code}`) || code;
  };

  const getCountryName = (code: string): string => {
    return t(`randomMatch.countries.${code}`) || code;
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
          {t("randomMatch.matched.waitingAccept")}
        </ModalBox>
      </ModalWrapper>
      )}
      <Container>
      { stage === "matched" && (
          <>
            <MatchedTitle>{t("randomMatch.matched.title")}</MatchedTitle>
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
                  {t("randomMatch.matched.nativeLanguage")}{" "}
                  {getLanguageName(
                    partner?.nativeLanguages?.[0]?.code ||
                    partner?.nativeLanguages?.[0]?.name?.toLowerCase() ||
                    ""
                  ) || t("randomMatch.matched.noInfo")}
                </LanguageContent>
                
                <LanguageContent>
                  {t("randomMatch.matched.preferredLanguage")}{" "}
                  {getLanguageName(
                    partner?.learnLanguages?.[0]?.code ||
                    partner?.learnLanguages?.[0]?.name?.toLowerCase() ||
                    ""
                  ) || t("randomMatch.matched.noInfo")}
                </LanguageContent>
                
                <LanguageContent>
                  {t("randomMatch.matched.nationality")} {getCountryName(partner?.country || "") || t("randomMatch.matched.noInfo")}
                </LanguageContent>
              </LanguageBox>

              <KeywordContainer>
                <KeywordBox>#{partner?.mbti || "MBTI"}</KeywordBox>
                <KeywordBox>#{partner?.keywords?.[0]?.name || "키워드1"}</KeywordBox>
                <KeywordBox>#{partner?.keywords?.[1]?.name || "키워드2"}</KeywordBox>
                <KeywordBox>#{partner?.keywords?.[2]?.name || "키워드3"}</KeywordBox>
              </KeywordContainer>


              <ButtonContainer>
                <Button onClick={handleAcceptMatch}>{t("randomMatch.matched.startChat")}</Button>
                <Button onClick={handleFindAnother}>{t("randomMatch.matched.findAnother")}</Button>
              </ButtonContainer>
            </MatchedProfile>
          </>
        )}


          {stage === "loading" && (
            <>
              <Title>{t("randomMatch.loading.title")}</Title>
              <SpinnerWrapper />
              <CancelButton onClick={handleCancelMatching}>
                {t("randomMatch.loading.cancel")}
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
              <NicnameContent>{partner?.nickname}{t("randomMatch.chat.entered")}</NicnameContent>
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
                placeholder={t("randomMatch.chat.messagePlaceholder")}
                onKeyUp={(e) => {
                  if (e.nativeEvent.isComposing) return; 
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <SendButton onClick={sendMessage}>전송</SendButton>
            </SendMessageContainer>
          </>
        )}
      </Container>
    </Wrapper>
  );
  
}

