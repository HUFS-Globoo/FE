import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import CharacterBlur from "../assets/character-blur.svg";
import { useState } from "react";
import axiosInstance from "../../axiosInstance";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
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
`

const LoginTitle = styled.div`
  font-size: 2rem;
  font-weight: 600;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
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
  border-bottom: 0.0625rem solid #ABABAB;
  align-items: center;
  &::placeholder {
    font-size: 1rem;
    font-weight: 500;
    color: #B1B1B1;
  }
  &:focus {
    outline: none; 
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
`

const SignUpContent = styled.div`
  font-size: 0.875rem;
  font-weight: 300;
`


const Login = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 

  const handleLogin = async () => {
    if (!username || !email || !password) {
      alert("모든 항목을 입력해주세요");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/auth/login", {
        username,
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      alert("로그인 성공!");
      console.log("로그인 응답:", response);
      navigate("/");
    } catch (error: any) {
      console.error("로그인 실패:", error);
      if (error.response?.status === 401) {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        alert("로그인 중 오류가 발생했습니다.");
      }
    }
  };


  return (
    <Container>
      <IntroContainer>
        <MainLogo src={Logo} alt="로고"/>
        <MainCharacter src={CharacterBlur} alt="메인 캐릭터" />
        <IntroContent className="H2">학교 이메일 인증으로 안전하게, 취향·성격·관심사 기반으로 나와<br /> 잘 맞는 외국인 친구를 찾아드려요.<br /><br /> 1:1 채팅으로 자연스럽게 언어를 배우고 문화를 나누며,<br /> 교내에서 시작되는 글로벌 네트워킹을 경험하세요.</IntroContent>
      </IntroContainer>
      <LoginContainer>
        <LoginTitle>로그인</LoginTitle>
        <InputContainer>
          <InputBox>
            <InputTitle >아이디</InputTitle>
            <InputItem  type="text" placeholder="likelion"/>
            <InputTitle >학교 이메일</InputTitle>
            <InputItem  type="text" placeholder="likelion@hufs.ac.kr"/>
            <InputTitle >비밀번호</InputTitle>
            <InputItem  type="password" placeholder="********"/>
          </InputBox>
          <SumbitContainer>
            <SubmitButton onClick={handleLogin}>로그인</SubmitButton>
            <SignUpContent onClick={() => navigate("/signup/step1")}>회원이 아니신가요? <span style={{color:"var(--primary)", cursor:"pointer"}} >회원가입</span></SignUpContent>
          </SumbitContainer>
          
        </InputContainer>
      </LoginContainer>
    </Container>
  );
};

export default Login;