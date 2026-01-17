import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import SubmitButton from '../../components/SubmitButton'
import SignUpSidebar from '../../components/SignUpSidebar'
import { useSignup } from "../../contexts/SignupContext";
import axiosInstance from "../../../axiosInstance";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 7.81rem;
  padding-left: 8.06rem;
  gap: 3.75rem;
`

const ContentTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.81rem;
`
const SelectContainer = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Circle = styled.div<{ selected: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 0.2rem solid var(--gray);
  background: ${({ selected }) => (selected ? "var(--primary)" : "var(--gray)")};
  box-sizing: border-box;
`;

const EmailInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.06rem;
`

const EmailInputBox = styled.div`
  display: flex;
  height: 4.5rem;
  border-bottom: 0.0625rem solid #ABABAB;
  box-sizing: border-box;
`

const EmailInputTitle = styled.div`
  width: 10.25rem;
  padding-left: 0.69rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`

const EmailInputItem = styled.input`
  border: none;
  width: 9.88rem;
  &::placeholder {
    font-size: 1rem;
    font-weight: 500;
    color: #B1B1B1;
  }

  &:focus {
    outline: none; 
  }
`

const VerificationButton = styled.div`
  display: flex;
  width: 7.69rem;
  height: 2.44rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.75rem;
  background-color: var(--primary);
  color: var(--white);
  cursor: pointer;
  //font-size: 0.875rem;
  //font-weight: 500;

`

const ResendLink = styled.div`
  font-size: 0.875rem;
  color: var(--primary);
  cursor: pointer;
  text-decoration: underline;
  margin-top: 0.5rem;
`

const SignUp2 = () => {

  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup();
  const [campus, setCampus] = useState<"GLOBAL" | "SEOUL">(signupData.campus || "GLOBAL");
  const [email, setEmail] = useState(signupData.email || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const steps = [
    { number: 1, detail: "기본 정보 입력" },
    { number: 2, detail: "학교 이메일 인증" },
    { number: 3, detail: "언어 & 국적" },
    { number: 4, detail: "나를 소개하는 키워드 선택" },
  ];

  const handleSendCode = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // 필수 필드 확인 (이메일은 SignUp2에서 입력받음)
    if (!email.trim() || !signupData.username || !signupData.password || !signupData.name || !signupData.nickname) {
      alert("모든 필수 필드를 입력해주세요. (이메일, 아이디, 비밀번호, 이름, 닉네임)");
      return;
    }

    try {
      // 회원가입 요청 데이터
      const signupRequestData = {
        email: email,
        username: signupData.username,
        password: signupData.password,
        name: signupData.name,
        nickname: signupData.nickname,
        phoneNumber: signupData.phoneNumber || null,
        birthDate: signupData.birthDate || null,
        gender: signupData.gender || null,
      };

      console.log("회원가입 요청 데이터:", signupRequestData);

      // 회원가입 요청 (이메일로 인증번호 자동 전송)
      // 이메일 발송 시간을 고려하여 timeout을 30초로 설정
      const response = await axiosInstance.post("/api/auth/signup", signupRequestData, {
        timeout: 30000, // 30초
      });

      console.log("회원가입 응답 데이터:", response.data);
      
      alert("인증번호가 전송되었습니다. 메일함을 확인해주세요!");
      setIsCodeSent(true);
      // 이메일을 signupData에 저장
      setSignupData({ ...signupData, email: email });
    } catch (error: any) {
      console.error("회원가입 요청 실패:", error.response?.data || error.message || error);
      alert(error.response?.data?.message || "인증번호 전송 중 오류가 발생했습니다.");
    }
  };

  const handleResendCode = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      // 이메일 재전송 시간을 고려하여 timeout을 30초로 설정
      const response = await axiosInstance.post(
        "/api/auth/verification/resend",
        {
          email: email,
        },
        {
          timeout: 30000, // 30초
        }
      );

      if (response.data.ok) {
        alert("인증번호가 재전송되었습니다. 메일함을 다시 확인해주세요!");
      } else {
        alert("재전송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error: any) {
      console.error("인증번호 재전송 실패:", error.response?.data || error.message || error);
      alert(error.response?.data?.message || "인증번호 재전송 중 오류가 발생했습니다.");
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      alert("인증번호를 입력해주세요!");
      return;
    }

    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/auth/verify-code", {
        email: email,
        code: verificationCode,
      });

      if (response.data.verified) {
        // onboardingToken 받아서 localStorage에 저장
        if (response.data.onboardingToken) {
          localStorage.setItem("onboardingToken", response.data.onboardingToken);
          alert("이메일 인증이 완료되었습니다!");
          setIsVerified(true);
        } else {
          alert("인증은 완료되었지만 토큰을 받지 못했습니다.");
        }
      } else {
        alert("인증에 실패했습니다. 코드를 다시 확인해주세요.");
      }
    } catch (error: any) {
      console.error("인증 실패:", error.response?.data || error.message || error);
      alert(error.response?.data?.message || "인증 중 오류가 발생했습니다.");
    }
  };

  const handleNext = () => {
    if (!isVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    // 단순히 Step3로 이동만 함
    const updatedData = {
      ...signupData,
      campus: campus,
      email: email,
    };

    setSignupData(updatedData);
    console.log("Step2 저장된 데이터:", updatedData);
    navigate("/signup/step3");
  };

  return (
    <Container>
      <SignUpSidebar steps={steps} currentStep={2} />

      <ContentContainer>
          <ContentTitle>02 학교 이메일로 인증해주세요 </ContentTitle>
          <InputContainer>
            <SelectContainer>
              <Label onClick={() => setCampus("GLOBAL")}>
                <Circle selected={campus === "GLOBAL"} />
                글로벌
              </Label>
              <Label onClick={() => setCampus("SEOUL")}>
                <Circle selected={campus === "SEOUL"} />
                서울
              </Label>
            </SelectContainer>
            <EmailInputContainer>
              <EmailInputBox>
                <EmailInputTitle className="Body1">학교 이메일</EmailInputTitle>
                <EmailInputItem 
                  type="text" 
                  placeholder="likelion@hufs.ac.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </EmailInputBox>
              <VerificationButton className="Button2" onClick={handleSendCode}>
                인증번호 전송
              </VerificationButton>
            </EmailInputContainer>
            <EmailInputContainer>
              <EmailInputBox>
                <EmailInputTitle className="Body1">인증번호</EmailInputTitle>
                <EmailInputItem 
                  type="text" 
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </EmailInputBox>
              <VerificationButton className="Button2" onClick={handleVerifyCode}>
                인증번호 확인
              </VerificationButton>
            </EmailInputContainer>
            {isCodeSent && (
              <ResendLink onClick={handleResendCode}>
                인증번호를 받지 못하셨나요? 재전송
              </ResendLink>
            )}
          </InputContainer>
          <SubmitButton onClick={handleNext}/>
      </ContentContainer>
    </Container>
  );
};

export default SignUp2;