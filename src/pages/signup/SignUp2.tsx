import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import SubmitButton from '../../components/SubmitButton'
import SignUpSidebar from '../../components/SignUpSidebar'

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
  //font-size: 0.875rem;
  //font-weight: 500;

`

const SignUp2 = () => {

  const [selected, setSelected] = useState<"global" | "seoul" | null>("global");
  const navigate = useNavigate();

  const steps = [
    { number: 1, detail: "기본 정보 입력" },
    { number: 2, detail: "학교 이메일 인증" },
    { number: 3, detail: "언어 & 국적" },
    { number: 4, detail: "나를 소개하는 키워드 선택" },
  ];

  return (
    <Container>
      <SignUpSidebar steps={steps} currentStep={2} />

      <ContentContainer>
          <ContentTitle>02 학교 이메일로 인증해주세요 </ContentTitle>
          <InputContainer>
            <SelectContainer>
              <Label onClick={() => setSelected("global")}>
                <Circle selected={selected === "global"} />
                글로벌
              </Label>
              <Label onClick={() => setSelected("seoul")}>
                <Circle selected={selected === "seoul"} />
                서울
              </Label>
            </SelectContainer>
            <EmailInputContainer>
              <EmailInputBox>
                <EmailInputTitle className="Body1">학교 이메일</EmailInputTitle>
                <EmailInputItem type="text" placeholder="likelion"/>
              </EmailInputBox>
              <VerificationButton className="Button2">
                인증번호 전송
              </VerificationButton>
            </EmailInputContainer>
            <EmailInputContainer>
              <EmailInputBox>
                <EmailInputTitle className="Body1">인증번호</EmailInputTitle>
                <EmailInputItem type="text" placeholder="123456"/>
              </EmailInputBox>
              <VerificationButton className="Button2">
                인증번호 확인
              </VerificationButton>
            </EmailInputContainer>
          </InputContainer>
          <SubmitButton onClick={() => navigate("/signup/step3")}/>
      </ContentContainer>
    </Container>
  );
};

export default SignUp2;