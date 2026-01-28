import styled from "styled-components";
import SubmitButton from '../../components/SubmitButton';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  height: 4.5rem;
  width: 19.94rem;
  border-bottom: 0.0625rem solid #ABABAB;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const MbtiInputTitle = styled.div`
  width: 9.37rem;
  padding-left: 0.69rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`

const SelectInput = styled.select`
  width: 10.56rem;
  padding: 0.6rem;
  border: none;
  background-color: transparent;
  color: var(--black);
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23ABABAB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;
  padding-right: 2rem;

  option {
    color: var(--black);
    background-color: var(--white);
    text-decoration: none;
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

const KeywordBox = styled.div<{ $isEnglish?: boolean }>`
  display: grid;
  grid-template-columns: repeat(5, ${({ $isEnglish }) => ($isEnglish ? "minmax(0, 1fr)" : "auto")}); 
  gap: 0.81rem 1rem; 
  max-width: 100%;
`

const KeywordItem = styled.div<{ $isEnglish?: boolean }>`
  ${({ $isEnglish }) => 
    $isEnglish 
      ? `
        min-width: 0;
        padding: 0.5rem 0.5rem;
        font-size: 0.875rem;
        white-space: normal;
        word-break: break-word;
        line-height: 1.3;
        overflow-wrap: break-word;
      `
      : `
        width: 7.44rem;
        padding: 0;
        font-size: 1rem;
        white-space: nowrap;
      `
  }
  min-height: 2.06rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 1.5rem;
  text-align: center;
`

const SignUp4 = () => {

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isEnglish = i18n.language === 'en';

  const mbtis = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"]
  const [mbti, setMbti] = useState("ENFP");

  // 키워드는 번역하지 않고 원본 그대로 사용 (데이터베이스와 일치해야 함)
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
        alert(t("signup.step4.alert.keywordCount"));
        return;
      }
      setState([...current, keyword]);
    }
  };

  const validateKeywords = (keywords: string[], keywordType: string): boolean => {
    if (keywords.length < 3 || keywords.length > 5) {
      alert(t("signup.step4.alert.keywordCount"));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const onboardingToken = localStorage.getItem("onboardingToken");
    
    if (!onboardingToken) {
      alert(t("signup.step4.alert.tokenMissing"));
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
      alert(t("signup.step4.alert.signupSuccess"));
      
      // onboardingToken 정리
      localStorage.removeItem("onboardingToken");
      
      navigate("/login");
    } catch (error: any) {
      console.error("회원가입 실패:", error.response?.data || error.message || error);
      alert(
        error.response?.data?.message ||
          t("signup.step4.alert.signupError")
      );
    }
  };


  const steps = [
    { number: 1, detail: t("signup.steps.step1") },
    { number: 2, detail: t("signup.steps.step2") },
    { number: 3, detail: t("signup.steps.step3") },
    { number: 4, detail: t("signup.steps.step4") },
  ];

  return (
    <Container>
      <SignUpSidebar steps={steps} currentStep={4} />

      <ContentContainer>
          <ContentTitle>{t("signup.step4.title")}</ContentTitle>
          <InputContainer>
            <MbtiInputContainer>
              <MbtiInputTitle className="Body1">{t("signup.step4.mbti.label")}</MbtiInputTitle>
              <SelectInput
                value={mbti}
                onChange={(e) => setMbti(e.target.value)}
              >
                <option value="">{t("signup.step4.mbti.select")}</option>
                {mbtis.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </SelectInput>
            </MbtiInputContainer>
            <KeywordContainer>
            <p style={{ fontSize: "1.25rem" }}>{t("signup.step4.keywords.personality.title")} <span style={{ fontSize: "1rem", color: "#9CA3AF" }}>{t("signup.step4.keywords.personality.selectCount")}</span></p>
            <KeywordBox $isEnglish={isEnglish}>
              {personality.map((persona) => (
                <KeywordItem
                  key={persona}
                  $isEnglish={isEnglish}
                  style={{
                    backgroundColor: selectedPersonality.includes(persona)
                      ? "var(--yellow2)"
                      : "#f0f0f0",
                  }}
                  onClick={() => toggleKeyword(persona, setSelectedPersonality, selectedPersonality)}
                >
                  # {t(`signup.step4.keywords.personality.items.${persona}`)}
                </KeywordItem>
              ))}
            </KeywordBox>

            <p style={{ fontSize: "1.25rem" }}>{t("signup.step4.keywords.hobby.title")} <span style={{ fontSize: "1rem", color: "#9CA3AF" }}>{t("signup.step4.keywords.hobby.selectCount")}</span></p>
            <KeywordBox $isEnglish={isEnglish}>
              {hobbis.map((hobby) => (
                <KeywordItem
                  key={hobby}
                  $isEnglish={isEnglish}
                  style={{
                    backgroundColor: selectedHobby.includes(hobby)
                      ? "var(--chip-skyblue)"
                      : "#f0f0f0",
                  }}
                  onClick={() => toggleKeyword(hobby, setSelectedHobby, selectedHobby)}
                >
                  # {t(`signup.step4.keywords.hobby.items.${hobby}`)}
                </KeywordItem>
              ))}
            </KeywordBox>

            <p style={{ fontSize: "1.25rem" }}>{t("signup.step4.keywords.topic.title")} <span style={{ fontSize: "1rem", color: "#9CA3AF" }}>{t("signup.step4.keywords.topic.selectCount")}</span></p>
            <KeywordBox $isEnglish={isEnglish}>
              {subjects.map((subject) => (
                <KeywordItem
                  key={subject}
                  $isEnglish={isEnglish}
                  style={{
                    backgroundColor: selectedSubject.includes(subject)
                      ? "var(--chip-green)"
                      : "#f0f0f0",
                  }}
                  onClick={() => toggleKeyword(subject, setSelectedSubject, selectedSubject)}
                >
                  # {t(`signup.step4.keywords.topic.items.${subject}`)}
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