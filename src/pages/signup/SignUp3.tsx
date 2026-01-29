import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubmitButton from '../../components/SubmitButton';
import { useSignup } from "../../contexts/SignupContext";
import SignUpSidebar from '../../components/SignUpSidebar';
import axiosInstance from "../../../axiosInstance";
import { SUPPORTED_LANGUAGE_CODES } from "../../utils/languages";
import { SUPPORTED_COUNTRY_CODES } from "../../utils/countries";

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

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup(); 
  
  // 언어와 국적 목록을 현재 언어에 맞게 가져오기
  const getLanguages = () => {
    return SUPPORTED_LANGUAGE_CODES.map(code => ({
      code,
      label: t(`signup.step3.languages.${code}`)
    }));
  };

  const getNationalities = () => {
    return SUPPORTED_COUNTRY_CODES.map(code => ({
      code,
      label: t(`signup.step3.nationalities.${code}`)
    }));
  };

  const languages = getLanguages();
  const nationalities = getNationalities();

  const langMap: Record<string, string> = Object.fromEntries(
    SUPPORTED_LANGUAGE_CODES.map(code => [
      t(`signup.step3.languages.${code}`),
      code
    ])
  );

  const nationMap: Record<string, string> = Object.fromEntries(
    SUPPORTED_COUNTRY_CODES.map(code => [
      t(`signup.step3.nationalities.${code}`),
      code
    ])
  );

  const reverseLangMap = Object.fromEntries(Object.entries(langMap).map(([k, v]) => [v, k]));
  const reverseNationMap = Object.fromEntries(Object.entries(nationMap).map(([k, v]) => [v, k]));
  
  const [useLang, setUseLang] = useState(
    reverseLangMap[signupData.nativeLanguageCode || "ko"] || t("signup.step3.languages.ko")
  );
  const [prefLang, setPrefLang] = useState(
    reverseLangMap[signupData.preferredLanguageCode || "ko"] || t("signup.step3.languages.ko")
  );
  const [nationality, setNationality] = useState(
    reverseNationMap[signupData.nationalityCode || "KR"] || t("signup.step3.nationalities.KR")
  );

  
  const handleNext = async () => {
    const onboardingToken = localStorage.getItem("onboardingToken");
    
    if (!onboardingToken) {
      alert(t("signup.step3.alert.tokenMissing"));
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
      const nationalityCode = nationMap[nationality] ?? "KR";
      const nativeLanguageCode = langMap[useLang] ?? "ko";
      const preferredLanguageCode = langMap[prefLang] ?? "ko";

      const requestData = {
        nationalityCode,
        nativeLanguageCode,
        preferredLanguageCode,
      };

      // 요청 바디 콘솔 출력
      console.log("Step3 요청 바디:", requestData);

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
        navigate("/signup/step4");
      } else {
        alert(t("signup.step3.alert.saveFailed"));
      }
    } catch (error: any) {
      console.error("Step3 저장 실패:", error.response?.data || error.message || error);
      alert(error.response?.data?.message || t("signup.step3.alert.saveError"));
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
      <SignUpSidebar steps={steps} currentStep={3} />

      <ContentContainer>
          <ContentTitle>{t("signup.step3.title")}</ContentTitle>
          <InputContainer>
            <UserLanguageInputContainer className="Body1">
              <UserLanguageTitle className="Body1">{t("signup.step3.fields.nativeLanguage.label")}</UserLanguageTitle>
              <SelectInput
                value={useLang}
                onChange={(e) => setUseLang(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.label}>
                    {lang.label}
                  </option>
                ))}
              </SelectInput>
            </UserLanguageInputContainer>
            <UserLanguageInputContainer className="Body1">
              <UserLanguageTitle className="Body1">{t("signup.step3.fields.preferredLanguage.label")}</UserLanguageTitle>
              <SelectInput
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.label}>
                    {lang.label}
                  </option>
                ))}
              </SelectInput>
            </UserLanguageInputContainer>

          <UserLanguageInputContainer  className="Body1">
            <UserLanguageTitle  className="Body1">{t("signup.step3.fields.nationality.label")}</UserLanguageTitle>
            <SelectInput
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            >
              {nationalities.map((nation) => (
                <option key={nation.code} value={nation.label}>
                  {nation.label}
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