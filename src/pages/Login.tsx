import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import CharacterBlur from "../assets/character-blur.svg";
import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import EmailVerificationModal from "../components/EmailVerificationModal";

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
  cursor: pointer;
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
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // 페이지 로드 시 localStorage에서 미인증 이메일 확인
  useEffect(() => {
    const pendingEmailFromStorage = localStorage.getItem("pendingVerificationEmail");
    if (pendingEmailFromStorage) {
      setPendingEmail(pendingEmailFromStorage);
      if (!email) {
        setEmail(pendingEmailFromStorage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      const { accessToken, refreshToken, userId } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", response.data.userId);
      // 로그인 성공 시 미인증 이메일 정보 제거
      localStorage.removeItem("pendingVerificationEmail");

      alert("로그인 성공!");
      console.log("로그인 응답:", response);
      navigate("/");
    } catch (error: any) {
      console.error("로그인 실패:", error);

      // 에러 메시지에서 이메일 인증 관련 키워드 확인
      const errorMessage = error.response?.data?.message || "";
      const isVerificationError =
        errorMessage.includes("인증") ||
        errorMessage.includes("verification") ||
        errorMessage.includes("unverified") ||
        errorMessage.includes("이메일") ||
        error.response?.status === 403;

      // 이메일 인증이 필요한 경우 모달 표시
      if (isVerificationError && email) {
        setPendingEmail(email);
        localStorage.setItem("pendingVerificationEmail", email);
        setIsVerificationModalOpen(true);
        return;
      }

      if (error.response?.status === 401) {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        alert(errorMessage || "로그인 중 오류가 발생했습니다.");
      }
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      alert("인증번호를 입력해주세요!");
      return;
    }

    if (!pendingEmail) {
      alert("이메일 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const verifyData = {
        email: pendingEmail,
        code: verificationCode,
      };

      console.log("인증 요청 데이터:", verifyData);

      const res = await axiosInstance.post("/api/auth/verify-code", verifyData);

      if (res.data.verified) {
        alert("이메일 인증이 완료되었습니다!");
        setIsVerificationModalOpen(false);
        setVerificationCode("");
        // 인증 완료 시 localStorage에서 제거
        localStorage.removeItem("pendingVerificationEmail");
        setPendingEmail(null);
        // 인증 완료 후 자동으로 로그인 시도
        if (username && password) {
          handleLogin();
        }
      } else {
        alert("인증에 실패했습니다. 코드를 다시 확인해주세요.");
      }
    } catch (error: any) {
      console.error("인증 실패:", error.response?.data || error.message || error);
      alert(error.response?.data?.message || "인증 중 오류가 발생했습니다.");
    }
  };

  const handleResendCode = async () => {
    if (!pendingEmail) {
      alert("이메일 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const resendData = {
        email: pendingEmail,
      };

      console.log("인증번호 재전송 요청 데이터:", resendData);

      const res = await axiosInstance.post("/api/auth/verification/resend", resendData);

      if (res.data.ok) {
        alert("인증번호가 재전송되었습니다. 메일함을 다시 확인해주세요!");
      } else {
        alert("재전송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error: any) {
      console.error("인증번호 재전송 실패:", error.response?.data || error.message || error);
      alert(error.response?.data?.message || "인증번호 재전송 중 오류가 발생했습니다.");
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
        {pendingEmail && (
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--primary)",
              marginBottom: "1rem",
              textAlign: "center",
              padding: "0.5rem",
              backgroundColor: "rgba(255, 230, 162, 0.2)",
              borderRadius: "0.5rem",
            }}
          >
            이메일 인증이 완료되지 않았습니다. ({pendingEmail})<br />
            이메일 인증을 완료해주세요.{" "}
            <span
              onClick={() => setIsVerificationModalOpen(true)}
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              완료하기
            </span>
          </div>
        )}
        <InputContainer>
          <InputBox>
            <InputTitle >아이디</InputTitle>
            <InputItem
              type="text"
              placeholder="likelion"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <InputTitle >학교 이메일</InputTitle>
            <InputItem
              type="text"
              placeholder="likelion@hufs.ac.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputTitle >비밀번호</InputTitle>
            <InputItem
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputBox>
          <SumbitContainer>
            <SubmitButton onClick={handleLogin}>로그인</SubmitButton>
            <SignUpContent onClick={() => navigate("/signup/step1")}>
              회원이 아니신가요?{" "}
              <span style={{color:"var(--primary)", cursor:"pointer"}} >회원가입</span>
            </SignUpContent>
          </SumbitContainer>
          
        </InputContainer>
      </LoginContainer>
      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        email={pendingEmail}
        verificationCode={verificationCode}
        onChangeCode={(e) => setVerificationCode(e.target.value)}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
      />
    </Container>
  );
};

export default Login;