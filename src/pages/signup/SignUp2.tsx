import styled from "styled-components";
import { useState } from "react";

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
  border: 0.3rem solid var(--gray);
  background: ${({ selected }) => (selected ? "var(--primary)" : "var(--gray)")};
`;

const SignUp2 = () => {

  const [selected, setSelected] = useState<"global" | "seoul" | null>("global");

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
          </InputContainer>
      </ContentContainer>
    </Container>
  );
};

export default SignUp2;