import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from '../../components/SubmitButton';
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

const SelectedBox = styled.div<{ isSelected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  //padding: 0.6rem 0;
  width: 18.06rem;
  cursor: pointer;
  color: ${({ isSelected }) => (isSelected ? "var(--black)" : "#ABABAB")};
`;

const Arrow = styled.span<{ open: boolean }>`
  font-size: 0.8rem;
  margin-left: auto;
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
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

  const [useLangOpen, setUseLangOpen] = useState(false);
  const [prefLangOpen, setPrefLangOpen] = useState(false);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  
  const handleNext = () => {



    const updatedData = {
      ...signupData,
      nativeLanguageCode: langMap[useLang] ?? "ko",   
      preferredLanguageCode: langMap[prefLang] ?? "ko",
      nationalityCode: nationMap[nationality] ?? "KR",  
    };

  setSignupData(updatedData);
  console.log("Step3 저장된 데이터:", updatedData); 
  navigate("/signup/step4");
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
              <SelectedBox isSelected={!!useLang} onClick={() => setUseLangOpen(!useLangOpen)}>
                {useLang}
                <Arrow open={useLangOpen}>▾</Arrow>

                {useLangOpen && (
                  <OptionList>
                    {languages.map((lang) => (
                      <Option key={lang} onClick={() => { setUseLang(lang); setUseLangOpen(false); }}>
                        {lang}
                      </Option>
                    ))}
                  </OptionList>
                )}
              </SelectedBox>
            </UserLanguageInputContainer>
            <UserLanguageInputContainer className="Body1">
              <UserLanguageTitle className="Body1">선호 언어</UserLanguageTitle>
              <SelectedBox isSelected={!!prefLang} onClick={() => setPrefLangOpen(!prefLangOpen)}>
                {prefLang}
                <Arrow open={prefLangOpen}>▾</Arrow>

                {prefLangOpen && (
                  <OptionList>
                    {languages.map((lang) => (
                      <Option key={lang} onClick={() => {setPrefLang(lang); setPrefLangOpen(false); }}>
                        {lang}
                      </Option>
                    ))}
                  </OptionList>
                )}
              </SelectedBox>
            </UserLanguageInputContainer>

          <UserLanguageInputContainer  className="Body1">
            <UserLanguageTitle  className="Body1">국적</UserLanguageTitle>
            <SelectedBox isSelected={!!nationality} onClick={() => setNationalityOpen(!nationalityOpen)}>
              {nationality}
              <Arrow open={nationalityOpen}>▾</Arrow>
              {nationalityOpen && (
                <OptionList>
                  {nationalities.map((nation) => (
                    <Option key={nation} onClick={() => { setNationality(nation); setNationalityOpen(false); }}>
                      {nation}
                    </Option>
                  ))}
                </OptionList>
              )}
            </SelectedBox>
          </UserLanguageInputContainer>
          </InputContainer>
          <SubmitButton onClick={handleNext}/>
      </ContentContainer>

    </Container>
  );
};

export default SignUp3;