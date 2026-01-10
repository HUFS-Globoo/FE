import styled from "styled-components";
import Logo from "../assets/logo.svg";
import GlobalStyle from '../styles/GlobalStyle';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { useEffect, useState } from "react";

const Container = styled.div`
  width: 100vw;
  height: 3.81rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem; 
  box-sizing: border-box;
`
const HeaderLogo = styled.img`
  width: 120px;
  height: auto;
  display: flex;
  object-fit: contain;
  cursor: pointer;
  justify-content: flex-start;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  justify-content: flex-end;
`
const MenuItem = styled.div`
  display: flex;
  
  font-family: 'SchoolSafetyRoundedSmile';
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.0125rem;
  cursor: pointer;
`


export default function Header() {

  const navigate = useNavigate();

  // 로그인 여부 체크
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
  
    axiosInstance
      .get("/api/users/me")
      .then(() => setIsLoggedIn(true))
      .catch(() => {
        localStorage.clear();
        setIsLoggedIn(false);
      });
    }, []);
  

    const handleLogout = async () => {
      try {
        await axiosInstance.post("/api/auth/logout");
        alert("로그아웃되었습니다.");
      } catch (e) {
        alert("로그아웃 처리 중 문제가 발생했습니다.");
      } finally {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("/");
      }
    };
    
    

  const handleStartMatching = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("accessToken");
  
      if (!userId) {
        alert("로그인 후 이용해주세요!");
        navigate("/login");
        return;
      }
  
      const response = await axiosInstance.post(
        "/api/matching/queue",
        { userId: Number(userId) }, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("매칭 대기열 등록 성공:", response.data);
  
      navigate("/random-match", {
        state: { matchStatus: "WAITING", userId: Number(userId) },
      });
    } catch (error) {
      console.error("매칭 요청 실패:", error);
      alert("매칭 요청 중 오류가 발생했습니다.");
    }
  };

  return(
    <Container>
      <HeaderLogo src={Logo} alt="logo" onClick={() => navigate("/")}/>
      <Menu>
        <MenuItem onClick={() => navigate("/")}>홈</MenuItem>
        <MenuItem onClick={handleStartMatching}>랜덤 매칭</MenuItem>
        <MenuItem onClick={() => navigate("/study")}>스터디 모집</MenuItem>
        <MenuItem onClick={() => navigate("/profile/landing")}>프로필 조회</MenuItem>
        <MenuItem onClick={() => navigate("/message")}>쪽지</MenuItem>
        <MenuItem onClick={() => navigate("/mypage")}>MYPAGE</MenuItem>
        {isLoggedIn ? (
          <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
        ) : (
          <MenuItem onClick={() => navigate("/login")}>로그인</MenuItem>
        )}
      </Menu>
    </Container>
  )
}

