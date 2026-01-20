import styled from "styled-components";
import SubmitButton from '../../components/SubmitButton';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import { useSignup } from "../../contexts/SignupContext";
import SignUpSidebar from '../../components/SignUpSidebar';

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
  gap: 1rem;
`

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #fff5f5;
  border-radius: 0.5rem;
  border: 1px solid #ffcccc;
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

const SignUp4 = () => {

  const navigate = useNavigate();

  const mbtis = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"]
  const [mbti, setMbti] = useState("ENFP");
  const [mbtiOpen, setMbtiOpen] = useState(false);

  const personality = ["활발한", "솔직한", "차분한", "유쾌한", "친절한", "도전적", "신중한", "긍정적", "냉정한", "열정적인"];
  const hobbis = ["영화 시청", "음악 감상", "요리", "독서", "카페가기", "운동", "산책", "사진 촬영", "게임", "여행"];
  const subjects = ["음악", "아이돌", "패션/뷰티", "스포츠", "영화/드라마", "공부", "자기계발", "책", "환경", "동물"];



  const { signupData } = useSignup();

  const [selectedPersonality, setSelectedPersonality] = useState<string[]>(signupData.personalityKeywords || []);
  const [selectedHobby, setSelectedHobby] = useState<string[]>(signupData.hobbyKeywords || []);
  const [selectedSubject, setSelectedSubject] = useState<string[]>(signupData.topicKeywords || []);

  const toggleKeyword = (keyword: string, setState: any, current: string[]) => {
    if (current.includes(keyword)) {
      setState(current.filter((item) => item !== keyword));
    } else {
      // 5개 초과 선택 방지
      if (current.length >= 5) {
        alert("키워드는 3-5개 선택해주세요.");
        return;
      }
      setState([...current, keyword]);
    }
  };

  const validateKeywords = (keywords: string[], keywordType: string): boolean => {
    if (keywords.length < 3 || keywords.length > 5) {
      alert("키워드는 3-5개 선택해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const onboardingToken = localStorage.getItem("onboardingToken");
    
    if (!onboardingToken) {
      alert("인증 토큰이 없습니다. 이전 단계를 다시 진행해주세요.");
      return;
    }

    // 키워드 유효성 검증 (각 키워드 타입별로 3-5개 범위 확인)
    if (!validateKeywords(selectedPersonality, "성격")) {
      return;
    }
    if (!validateKeywords(selectedHobby, "취미")) {
      return;
    }
    if (!validateKeywords(selectedSubject, "주제")) {
      return;
    }

    try {
      // onboardingToken을 헤더에 넣어 step4 API 호출
      const response = await axiosInstance.post(
        "/api/onboarding/step4",
        {
          mbti,
          personalityKeywords: selectedPersonality,
          hobbyKeywords: selectedHobby,
          topicKeywords: selectedSubject,
        },
        {
          headers: {
            Authorization: `Bearer ${onboardingToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("회원가입 완료:", response.data);
      alert("회원가입이 완료되었습니다!");
      
      // onboardingToken 정리
      localStorage.removeItem("onboardingToken");
      
      navigate("/login");
    } catch (error: any) {
      console.error("회원가입 실패:", error.response?.data || error.message || error);
      alert(
        error.response?.data?.message ||
          "회원가입 중 오류가 발생했습니다. 입력값을 다시 확인해주세요."
      );
    }
  };


  const steps = [
    { number: 1, detail: "기본 정보 입력" },
    { number: 2, detail: "학교 이메일 인증" },
    { number: 3, detail: "언어 & 국적" },
    { number: 4, detail: "나를 소개하는 키워드 선택" },
  ];

  return (
    <Container>
      <SignUpSidebar steps={steps} currentStep={4} />

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
            <p style={{ fontSize: "1.25rem" }}>자신의 성격에 맞는 키워드를 선택해주세요 <span style={{ fontSize: "1rem", color: "#9CA3AF" }}>(3-5개 선택)</span></p>
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

            <p style={{ fontSize: "1.25rem" }}>관심있는 취미를 선택해주세요 <span style={{ fontSize: "1rem", color: "#9CA3AF" }}>(3-5개 선택)</span></p>
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

            <p style={{ fontSize: "1.25rem" }}>관심있는 주제를 선택해주세요 <span style={{ fontSize: "1rem", color: "#9CA3AF" }}>(3-5개 선택)</span></p>
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
    </Container>
  );
};

export default SignUp4;