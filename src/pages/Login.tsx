import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../assets/logo.svg";
import CharacterBlur from "../assets/character-blur.svg";
import { useState } from "react";
import axiosInstance from "../../axiosInstance";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  background-color: var(--white);
`

const IntroContainer = styled.div`
  width: 41rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 14rem;
  background: rgba(255, 230, 162, 0.30);
  //justify-content: center;
  padding-top: 8rem;
  align-items: center;
  overflow-y: auto;
  flex-shrink: 0;


`

const MainCharacter = styled.img`
  width: 32rem;
  height: 42rem;
  position: absolute;
  z-index: 0;  
` 
const MainLogo = styled.img`
  position: relative;
  z-index: 1;  
`
const IntroContent = styled.div`
  width: 37.375rem;
  height: 9.3125rem;
  color: var(--primary);
  text-align: center;
  font-weight: 400;
`

const LoginContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4.56rem;
  padding-left: 11rem;
  padding-top: 12rem;
  overflow-y: auto;
  min-width: 0;
  background-color: var(--white);

`

const LoginTitle = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary);
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  color: var(--primary);
`

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.62rem;
`

const InputTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
`

const InputItem = styled.input`
  width: 22.5rem;
  height: 3.25rem;
  border: none;
  background-color: var(--white);
  border-bottom: 0.0625rem solid #ABABAB;
  align-items: center;
  color: var(--primary);
  &::placeholder {
    font-size: 1rem;
    font-weight: 500;
    color: #B1B1B1;
  }
  &:focus {
    outline: none; 
  }

  /* 브라우저 자동완성(autofill) 배경을 흰색으로 통일 */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
    box-shadow: 0 0 0px 1000px var(--white) inset;
    -webkit-text-fill-color: var(--primary);
    transition: background-color 5000s ease-in-out 0s;
  }
`

const SumbitContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.81rem;
`

const SubmitButton = styled.div`
  width: 22.87rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary);
  color: var(--white);
  border-radius: 0.75rem;
  cursor: pointer;
`

const SignUpContent = styled.div`
  font-size: 0.875rem;
  font-weight: 300;
`


const Login = () => {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !email || !password) {
      alert(t("login.alert.fieldsRequired"));
      return;
    }

    try {
      const response = await axiosInstance.post("/api/auth/login", {
        username,
        email,
        password,
      });

      const { accessToken, refreshToken, userId } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", response.data.userId);

      alert(t("login.alert.success"));
      console.log("로그인 응답:", response);
      
      /**
       * 로그인 성공 후 리다이렉트 처리
       * 
       * location.state?.from: ProtectedRoute에서 전달한 원래 접근하려던 페이지 경로
       * 예: /mypage, /message, /study 등
       * 
       * 만약 from이 없으면 (직접 로그인 페이지로 온 경우) 메인 페이지(/)로 이동
       */
      const from = (location.state as { from?: string })?.from || "/";
      navigate(from);
    } catch (error: any) {
      console.error("로그인 실패:", error);

      const errorMessage = error.response?.data?.message || "";

      if (error.response?.status === 401) {
        alert(t("login.alert.invalidCredentials"));
      } else {
        alert(errorMessage || t("login.alert.error"));
      }
    }
  };



  return (
    <Container>
      <IntroContainer>
        <MainLogo src={Logo} alt="로고"/>
        <MainCharacter src={CharacterBlur} alt="메인 캐릭터" />
        <IntroContent className="H2" dangerouslySetInnerHTML={{ __html: t("login.intro.content") }} />
      </IntroContainer>
      <LoginContainer>
        <LoginTitle>{t("login.title")}</LoginTitle>
        <InputContainer>
          <InputBox>
            <InputTitle>{t("login.form.username.label")}</InputTitle>
            <InputItem
              type="text"
              placeholder={t("login.form.username.placeholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <InputTitle>{t("login.form.email.label")}</InputTitle>
            <InputItem
              type="text"
              placeholder={t("login.form.email.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputTitle>{t("login.form.password.label")}</InputTitle>
            <InputItem
              type="password"
              placeholder={t("login.form.password.placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputBox>
          <SumbitContainer>
            <SubmitButton onClick={handleLogin}>{t("login.form.submitButton")}</SubmitButton>
            <SignUpContent onClick={() => navigate("/signup/step1")}>
              {t("login.form.signUpText")}{" "}
              <span style={{color:"var(--primary)", cursor:"pointer"}} >{t("login.form.signUpLink")}</span>
            </SignUpContent>
          </SumbitContainer>
          
        </InputContainer>
      </LoginContainer>
    </Container>
  );
};

export default Login;