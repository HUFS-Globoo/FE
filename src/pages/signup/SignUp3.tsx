import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from '../../components/SubmitButton';
import { useSignup } from "../../contexts/SignupContext";
import SignUpSidebar from '../../components/SignUpSidebar';
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

const UserLanguageInputContainer = styled.div`
  height: 4.5rem;
  width: 35.5rem;
  
  border-bottom: 0.0625rem solid #ABABAB;
  display: flex;
  flex-direction: row;
`;

const UserLanguageTitle = styled.div`
  width: 15.31rem;
  padding-left: 0.69rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`

const SelectInput = styled.select`
  width: 18.06rem;
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

const SignUp3 = () => {

  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup(); 
  const languages = ["한국어", "영어", "중국어", "아랍어", "이탈리아어"];
  const nationalities = ["대한민국", "미국", "중국", "이집트", "이탈리아"];

  const langMap: Record<string, string> = {
    "한국어": "ko",
    "영어": "en",
    "중국어": "zh",
    "아랍어": "ar",
    "이탈리아어": "it",
  };

  const nationMap: Record<string, string> = {
    "대한민국": "KR",
    "미국": "US",
    "이집트": "EG",
    "중국": "CN",
    "이탈리아": "IT",
  };

  const reverseLangMap = Object.fromEntries(Object.entries(langMap).map(([k, v]) => [v, k]));
  const reverseNationMap = Object.fromEntries(Object.entries(nationMap).map(([k, v]) => [v, k]));
  
  const [useLang, setUseLang] = useState(
    reverseLangMap[signupData.nativeLanguageCode || "ko"] || "한국어"
  );
  const [prefLang, setPrefLang] = useState(
    reverseLangMap[signupData.preferredLanguageCode || "ko"] || "한국어"
  );
  const [nationality, setNationality] = useState(
    reverseNationMap[signupData.nationalityCode || "KR"] || "대한민국"
  );

  
  const handleNext = async () => {
    const onboardingToken = localStorage.getItem("onboardingToken");
    
    if (!onboardingToken) {
      alert("인증 토큰이 없습니다. 이전 단계를 다시 진행해주세요.");
      return;
    }

    const updatedData = {
      ...signupData,
      nativeLanguageCode: langMap[useLang] ?? "ko",   
      preferredLanguageCode: langMap[prefLang] ?? "ko",
      nationalityCode: nationMap[nationality] ?? "KR",  
    };

    setSignupData(updatedData);

    try {
      // 요청 데이터 구성
      const requestData = {
        nationalityCode: nationMap[nationality] ?? "KR",
        nativeLanguageCode: langMap[useLang] ?? "ko",
        preferredLanguageCode: langMap[prefLang] ?? "ko",
      };

      // 요청 데이터 콘솔 출력
      console.log("Step3 API 요청 데이터:", requestData);
      console.log("온보딩 토큰:", onboardingToken);
      console.log("Authorization 헤더:", `Bearer ${onboardingToken}`);

      // onboardingToken을 헤더에 넣어 step3 API 호출
      const response = await axiosInstance.post(
        "/api/onboarding/step3",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${onboardingToken}`,
          },
          timeout: 30000, // 30초
        }
      );

      if (response.data) {
        console.log("Step3 저장 완료:", response.data);
        navigate("/signup/step4");
      } else {
        alert("저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error: any) {
      console.error("Step3 저장 실패:", error.response?.data || error.message || error);
      alert(error.response?.data?.message || "저장 중 오류가 발생했습니다.");
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
      <SignUpSidebar steps={steps} currentStep={3} />

      <ContentContainer>
          <ContentTitle>02 선호 언어와 자신의 국적을 입력해주세요 </ContentTitle>
          <InputContainer>
            <UserLanguageInputContainer className="Body1">
              <UserLanguageTitle className="Body1">사용 언어</UserLanguageTitle>
              <SelectInput
                value={useLang}
                onChange={(e) => setUseLang(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </SelectInput>
            </UserLanguageInputContainer>
            <UserLanguageInputContainer className="Body1">
              <UserLanguageTitle className="Body1">선호 언어</UserLanguageTitle>
              <SelectInput
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </SelectInput>
            </UserLanguageInputContainer>

          <UserLanguageInputContainer  className="Body1">
            <UserLanguageTitle  className="Body1">국적</UserLanguageTitle>
            <SelectInput
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            >
              {nationalities.map((nation) => (
                <option key={nation} value={nation}>
                  {nation}
                </option>
              ))}
            </SelectInput>
          </UserLanguageInputContainer>
          </InputContainer>
          <SubmitButton onClick={handleNext}/>
      </ContentContainer>

    </Container>
  );
};

export default SignUp3;