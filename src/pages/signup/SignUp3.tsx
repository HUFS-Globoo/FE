import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from '../../components/SubmitButton';

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
  const languages = ["한국어", "영어", "일본어", "중국어", "러시아어", "독일어", "스페인어"];
  const [useLangOpen, setUseLangOpen] = useState(false);
  const [useLang, setUseLang] = useState("한국어");

  const [prefLangOpen, setPrefLangOpen] = useState(false);
  const [prefLang, setPrefLang] = useState("한국어");


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
              <StepDetail>학교 이메일 인증</StepDetail>
            </StepContent>
          </StepBox>

          <StepBox>
            <StepIcon>3</StepIcon>
            <StepContent>
              <StepTitle>Step 3</StepTitle>
              <StepDetail>언어 & 국적</StepDetail>
            </StepContent>
          </StepBox>

          <StepBox>
            <StepIcon>4</StepIcon>
            <StepContent>
              <StepTitle>Step 4</StepTitle>
              <StepDetail>나를 소개하는 키워드 선택</StepDetail>
            </StepContent>
          </StepBox>
        </StepContainer>
      </SignUpBox>

      <ContentContainer>
          <ContentTitle>03 선호 언어와 자신의 국적을 입력해주세요 </ContentTitle>
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
          </InputContainer>
          <SubmitButton onClick={() => navigate("/signup/step4")}/>
      </ContentContainer>

    </Container>
  );
};

export default SignUp3;