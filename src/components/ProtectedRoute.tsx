/**
 * ProtectedRoute 컴포넌트
 * 
 * 이 컴포넌트는 로그인이 필요한 페이지를 보호하는 역할을 합니다.
 * 
 * 동작 방식:
 * 1. localStorage에서 accessToken을 확인하여 로그인 여부를 판단합니다.
 * 2. 로그인하지 않은 경우, 안내 메시지와 함께 로그인 페이지로 이동할 수 있는 버튼을 표시합니다.
 * 3. 로그인한 경우, 자식 컴포넌트(보호된 페이지)를 정상적으로 렌더링합니다.
 * 4. 로그인 후 원래 접근하려던 페이지로 돌아올 수 있도록 현재 경로 정보를 저장합니다.
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CharacterBlur from "../assets/character-blur.svg";

// 안내 화면 스타일
// Header 높이(3.81rem)를 고려하여 그 아래에 표시되도록 설정
const Container = styled.div`
  position: absolute;
  top: 3.81rem; /* Header 높이만큼 아래로 */
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  min-height: calc(100vh - 3.81rem); /* 전체 높이에서 Header 높이 제외 */
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  box-sizing: border-box;
`;

const Message = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--primary);
  text-align: center;
  line-height: 1.8;
  position: relative;
  z-index: 2; /* 캐릭터 이미지보다 위에 표시 */
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: opacity 0.2s;
  position: relative;
  z-index: 2; /* 캐릭터 이미지보다 위에 표시하여 클릭 가능하게 */
`;

const MainCharacter = styled.img`
  width: 32rem;
  height: 42rem;
  position: absolute;
  z-index: 1; /* 배경으로 표시 */
  pointer-events: none; /* 클릭 이벤트를 받지 않도록 설정 */
` 

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 인증 상태 관리
  // null: 아직 확인 중, true: 로그인됨, false: 로그인 안됨
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  /**
   * 컴포넌트가 마운트될 때 로그인 여부를 확인합니다.
   * localStorage에 accessToken이 있는지 확인하여 인증 상태를 판단합니다.
   */
  useEffect(() => {
    const checkAuth = () => {
      // localStorage에서 accessToken 확인
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        // 토큰이 없으면 로그인하지 않은 것으로 판단
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      // 토큰이 있으면 로그인한 것으로 판단
      // 실제 토큰 유효성 검증은 각 페이지에서 API 호출 시 서버에서 처리됩니다.
      setIsAuthenticated(true);
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  /**
   * 로그인 페이지로 이동하는 함수
   * 현재 경로 정보를 state로 전달하여, 로그인 후 원래 페이지로 돌아올 수 있게 합니다.
   */
  const handleLogin = () => {
    // location.pathname: 현재 접근하려던 페이지 경로 (예: /mypage, /message 등)
    // 이 정보를 로그인 페이지로 전달하여, 로그인 성공 후 원래 페이지로 돌아갈 수 있게 합니다.
    navigate("/login", { 
      state: { from: location.pathname } 
    });
  };

  // 로딩 중일 때 표시
  if (isChecking) {
    return (
      <Container>
        <MainCharacter src={CharacterBlur} alt="메인 캐릭터" />
        <Message>{t("protectedRoute.loading")}</Message>
      </Container>
    );
  }

  // 로그인하지 않은 경우 안내 화면 표시
  if (!isAuthenticated) {
    return (
      <Container>
        <MainCharacter src={CharacterBlur} alt="메인 캐릭터" />
        <Message dangerouslySetInnerHTML={{ __html: t("protectedRoute.message") }} />
        <Button onClick={handleLogin}>
          {t("protectedRoute.loginButton")}
        </Button>
      </Container>
    );
  }

  // 로그인한 경우 보호된 페이지(children)를 정상적으로 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;
