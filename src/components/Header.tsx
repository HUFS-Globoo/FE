import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  width: 100vw;
  height: 3.81rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem; 
  box-sizing: border-box;
  color: var(--primary);
  background-color: var(--white);
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
  align-items: center;
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

const LanguageSelector = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
`

const LanguageButton = styled.button<{ $isActive: boolean }>`
  padding: 0.375rem 0.75rem;
  border: 1px solid ${({ $isActive }) => ($isActive ? 'var(--primary)' : '#ABABAB')};
  border-radius: 0.375rem;
  background-color: ${({ $isActive }) => ($isActive ? 'var(--primary)' : 'transparent')};
  color: ${({ $isActive }) => ($isActive ? 'var(--white)' : '#333')};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--primary);
    background-color: ${({ $isActive }) => ($isActive ? 'var(--primary)' : 'rgba(0, 45, 86, 0.1)')};
  }
`


export default function Header() {

  const { t, i18n } = useTranslation();
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
      const refreshToken = localStorage.getItem("refreshToken");
      
      try {
        await axiosInstance.post("/api/auth/logout", {
          refreshToken: refreshToken
        });
        alert("로그아웃되었습니다.");
      } catch (e) {
        console.error("로그아웃 처리 중 문제가 발생했습니다.", e);
        alert("로그아웃 처리 중 문제가 발생했습니다.");
      } finally {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("/");
      }
    };
    
    

  const handleStartMatching = async () => {
    // 로그인하지 않은 경우 ProtectedRoute가 안내 화면을 보여주도록
    // 그냥 /random-match로 이동
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");
  
    if (!userId || !token) {
      // 로그인하지 않은 경우 ProtectedRoute가 처리하도록 그냥 이동
      navigate("/random-match");
      return;
    }
  
    // 로그인한 경우에만 매칭 대기열에 등록
    try {
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return(
    <Container>
      <HeaderLogo src={Logo} alt="logo" onClick={() => navigate("/")}/>
      <Menu>
        <MenuItem onClick={() => navigate("/")}>{t("header.home")}</MenuItem>
        <MenuItem onClick={handleStartMatching}>{t("header.randomMatch")}</MenuItem>
        <MenuItem onClick={() => navigate("/study")}>{t("header.study")}</MenuItem>
        <MenuItem onClick={() => navigate("/profile/landing")}>{t("header.profile")}</MenuItem>
        <MenuItem onClick={() => navigate("/message")}>{t("header.message")}</MenuItem>
        <MenuItem onClick={() => navigate("/mypage")}>{t("header.mypage")}</MenuItem>
        {isLoggedIn ? (
          <MenuItem onClick={handleLogout}>{t("header.logout")}</MenuItem>
        ) : (
          <MenuItem onClick={() => navigate("/login")}>{t("header.login")}</MenuItem>
        )}
        <LanguageSelector>
          <LanguageButton 
            $isActive={i18n.language === 'ko'} 
            onClick={() => changeLanguage('ko')}
          >
            {t("header.language.ko")}
          </LanguageButton>
          <LanguageButton 
            $isActive={i18n.language === 'en'} 
            onClick={() => changeLanguage('en')}
          >
            {t("header.language.en")}
          </LanguageButton>
        </LanguageSelector>
      </Menu>
    </Container>
  )
}

