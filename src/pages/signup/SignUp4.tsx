import styled from "styled-components";
import SubmitButton from '../../components/SubmitButton';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import { useSignup } from "../../contexts/SignupContext";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

const SignUpBox = styled.div`
  width: 29.3125rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5.56rem;
`

const SignUpTitle = styled.div`
  padding-top: 4.56rem;
  font-family: 'Escoredream';
  font-size: 2rem;
  font-weight: 500;
`

const StepContainer = styled.div`
  width: 14.3125rem;
  display: flex;
  flex-direction: column;
  gap: 3.75rem;
`

const StepBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
`

const StepIcon = styled.div`
  display: flex;
  width: 3.125rem;
  height: 3.125rem;
  padding: 0.75rem 1.1875rem 0.5625rem 1rem;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #002D56;
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
  aspect-ratio: 1/1;
`

const StepContent = styled.div`
  width: 10.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.81rem;
`

const StepTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 300;
`

const StepDetail = styled.div`
  font-size: 0.875rem;
  font-weight: 300;
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
  gap: 3.13rem;
`

const MbtiInputContainer = styled.div`
  margin: 0 auto;
  height: 4.5rem;
  width: 19.94rem;
  border-bottom: 0.0625rem solid #ABABAB;
  display: flex;
  align-items: center;
`

const MbtiInputTitle = styled.div`
  width: 9.37rem;
  padding-left: 0.69rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`

const SelectedBox = styled.div<{ $isSelected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 18.06rem;
  cursor: pointer;
  color: ${({ $isSelected }) => ($isSelected ? "var(--black)" : "#ABABAB")};
`;

const Arrow = styled.span<{ $open: boolean }>`
  font-size: 0.8rem;
  margin-left: auto;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: 0.3s;
`;

const OptionList = styled.div`
  position: absolute;
  top: calc(100% - 0.9rem);
  right: 0;
  width: fit-content;
  background: var(--white);
  border-radius: 0.5rem;
  border: 1px solid var(--gray);
  z-index: 10; 
  color: var(--black);
`;

const Option = styled.div`
  padding: 0.6rem;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const KeywordContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const KeywordBox = styled.div`
  display: grid;
  grid-template-columns: repeat(5, auto); 
  gap: 0.81rem 1rem; 
`

const KeywordItem = styled.div`
  width: 7.44rem;
  height: 2.06rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 1.5rem;

`

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  width: 43.25rem;
  height: 22.375rem; 
  padding: 0 3.875rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white; 
  border-radius: 1rem; 
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  z-index: 10000;
`;

 const CodeInputContainer = styled.div`
 display: flex;
 flex-direction: column;
 align-items: center;
 gap: 1.06rem;
`
const CodeInputBox = styled.div`
  display: flex;
  height: 4.5rem;
  border-bottom: 0.0625rem solid #ABABAB;
  box-sizing: border-box;
`

const CodeInputTitle = styled.div`
  width: 10.25rem;
  padding-left: 0.69rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`
const CodeInputItem = styled.input`
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
`

const SignUp4 = () => {

  const navigate = useNavigate();

  const mbtis = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"]
  const [mbti, setMbti] = useState("ENFP");
  const [mbtiOpen, setMbtiOpen] = useState(false);

  const personality = ["활발한", "솔직한", "차분한", "유쾌한", "친절한", "도전적", "신중한", "긍정적", "냉정한", "열정적인"];
  const hobbis = ["영화 시청", "음악 감상", "요리", "독서", "카페가기", "운동", "산책", "사진 촬영", "게임", "여행"];
  const subjects = ["음악", "아이돌", "패션/뷰티", "스포츠", "영화/드라마", "공부", "자기계발", "책", "환경", "동물"];



  const { signupData, setSignupData } = useSignup();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState(""); 
  const [isVerified, setIsVerified] = useState(false);

  const [selectedPersonality, setSelectedPersonality] = useState<string[]>(signupData.personalityKeywords || []);
  const [selectedHobby, setSelectedHobby] = useState<string[]>(signupData.hobbyKeywords || []);
  const [selectedSubject, setSelectedSubject] = useState<string[]>(signupData.topicKeywords || []);

  const toggleKeyword = (keyword: string, setState: any, current: string[]) => {
    if (current.includes(keyword)) {
      setState(current.filter((item) => item !== keyword));
    } else {
      setState([...current, keyword]);
    }
  };

  const handleSubmit = async () => {
    try {
      const finalData = {
        ...signupData,
        mbti,
        personalityKeywords: selectedPersonality,
        hobbyKeywords: selectedHobby,
        topicKeywords: selectedSubject,
      };
  
      console.log("회원가입 요청 데이터:", finalData);
  
      const response = await axiosInstance.post(
        "/api/auth/signup",
        JSON.stringify(finalData),
        {
          headers: {
            "Content-Type": "application/json",
          },
          transformRequest: [(data) => data], 
        }
      );
  
      console.log("회원가입 성공:", response.data);
     
      setIsModalOpen(true);
    } catch (error: any) {
      console.error("회원가입 실패:", error.response?.data || error.message || error);
      alert(
        error.response?.data?.message ||
          "회원가입 중 오류가 발생했습니다. 입력값을 다시 확인해주세요."
      );
    }
  };
  
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      alert("인증번호를 입력해주세요!");
      return;
    }

    try {
      const verifyData = {
        email: signupData.email, 
        code: verificationCode,  
      };

      console.log("인증 요청 데이터:", verifyData);

      const res = await axiosInstance.post("/api/auth/verify-code", verifyData);

      if (res.data.verified) {
        alert("이메일 인증이 완료되었습니다!");
        setIsVerified(true);
        setIsModalOpen(false);
        navigate("/login"); 
      } else {
        alert("인증에 실패했습니다. 코드를 다시 확인해주세요.");
      }
    } catch (error: any) {
      console.error("인증 실패:", error.response?.data || error.message || error);
      alert(error.response?.data?.message || "인증 중 오류가 발생했습니다.");
    }
  };
  
  

  return (
    <Container>
      <SignUpBox>
        <SignUpTitle>회원가입</SignUpTitle>
        <StepContainer>
          <StepBox>
            <StepIcon>1</StepIcon>
            <StepContent>
              <StepTitle>Step 1</StepTitle>
              <StepDetail>기본 정보 입력</StepDetail>
            </StepContent>
          </StepBox>


          <StepBox>
            <StepIcon>2</StepIcon>
            <StepContent>
              <StepTitle>Step 2</StepTitle>
              <StepDetail>언어 & 국적</StepDetail>
            </StepContent>
          </StepBox>

          <StepBox>
            <StepIcon>3</StepIcon>
            <StepContent>
              <StepTitle>Step 3</StepTitle>
              <StepDetail>나를 소개하는 키워드 선택</StepDetail>
            </StepContent>
          </StepBox>
        </StepContainer>
      </SignUpBox>

      <ContentContainer>
          <ContentTitle>03 나를 소개하는 키워드를 선택해주세요 </ContentTitle>
          <InputContainer>
            <MbtiInputContainer>
              <MbtiInputTitle className="Body1">MBTI</MbtiInputTitle>
              <SelectedBox
                $isSelected={!!mbti}
                onClick={() => setMbtiOpen(!mbtiOpen)}
              >
                {mbti || "선택"}
                <Arrow $open={mbtiOpen}>▾</Arrow>
                {mbtiOpen && (
                  <OptionList>
                    {mbtis.map((type) => (
                      <Option
                        key={type}
                        onClick={() => {
                          setMbti(type);
                          setMbtiOpen(false);
                        }}
                      >
                        {type}
                      </Option>
                    ))}
                  </OptionList>
                )}
              </SelectedBox>
            </MbtiInputContainer>
            <KeywordContainer>
            <p style={{ fontSize: "1.25rem" }}>자신의 성격에 맞는 키워드를 선택해주세요</p>
            <KeywordBox>
              {personality.map((persona) => (
                <KeywordItem
                  key={persona}
                  style={{
                    backgroundColor: selectedPersonality.includes(persona)
                      ? "var(--yellow2)"
                      : "#f0f0f0",
                  }}
                  onClick={() => toggleKeyword(persona, setSelectedPersonality, selectedPersonality)}
                >
                  # {persona}
                </KeywordItem>
              ))}
            </KeywordBox>

            <p style={{ fontSize: "1.25rem" }}>관심있는 취미를 선택해주세요</p>
            <KeywordBox>
              {hobbis.map((hobby) => (
                <KeywordItem
                  key={hobby}
                  style={{
                    backgroundColor: selectedHobby.includes(hobby)
                      ? "var(--chip-skyblue)"
                      : "#f0f0f0",
                  }}
                  onClick={() => toggleKeyword(hobby, setSelectedHobby, selectedHobby)}
                >
                  # {hobby}
                </KeywordItem>
              ))}
            </KeywordBox>

            <p style={{ fontSize: "1.25rem" }}>관심있는 주제를 선택해주세요</p>
            <KeywordBox>
              {subjects.map((subject) => (
                <KeywordItem
                  key={subject}
                  style={{
                    backgroundColor: selectedSubject.includes(subject)
                      ? "var(--chip-green)"
                      : "#f0f0f0",
                  }}
                  onClick={() => toggleKeyword(subject, setSelectedSubject, selectedSubject)}
                >
                  # {subject}
                </KeywordItem>
              ))}
            </KeywordBox>
          </KeywordContainer>
          </InputContainer>
          <SubmitButton onClick={handleSubmit} /> 
      </ContentContainer>

      {isModalOpen && (
      <ModalContainer>
        <CodeInputContainer>
          <p>이메일로 인증번호가 갔습니다!</p>
          <CodeInputBox>
            <CodeInputTitle className="Body1">인증 번호</CodeInputTitle>
            <CodeInputItem
                type="text"
                placeholder="인증번호를 입력하세요"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)} 
              />
          </CodeInputBox>

          <VerificationButton className="Button2" onClick={handleVerifyCode}>
            인증번호 확인
          </VerificationButton>
        </CodeInputContainer>
      </ModalContainer>
      )}
     

    </Container>
  );
};

export default SignUp4;