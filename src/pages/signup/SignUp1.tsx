import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SubmitButton from '../../components/SubmitButton'
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
  width: 35.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.88rem;
`

const InputBox = styled.div`
  height: 4.5rem;
  padding-left: 0.69rem;
  border-bottom: 1px solid #ABABAB;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
`
const InputTitle = styled.div`
  width: 15.31rem;
  font-size: 1rem;
  font-weight: 500;
`
const InputItem = styled.input`
  border: none;

  &::placeholder {
    font-size: 1rem;
    font-weight: 500;
    color: #B1B1B1;
  }

  &:focus {
    outline: none; 
  }
`
const InputWrapper = styled.div`
    height: 4.5rem;
    border-bottom: 1px solid #ABABAB;
    display: flex;
    flex-direction: row;
    align-items: center;
    //gap: 1.44rem;
    padding-left: 0.69rem;
    padding-right: 0rem;
    gap: 1.44rem;
`
const Box = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

`
const BirthWrapper = styled.div`
  width: 23.81rem;
  display: flex;
  flex-direction: row;
  gap: 1.63rem;
  box-sizing: border-box;
`
const BirthInputTitle = styled.div`
  width: 7.44rem;
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: 500;
`
const YearInputItem = styled.input`
  border: none;
  width: 2.5rem;

  &::placeholder {
    font-size: 1rem;
    font-weight: 500;
    color: #B1B1B1;
  }

  &:focus {
    outline: none; 
  }
`

const MonthInputItem = styled.input`
  border: none;
  width: 1.25rem;

&::placeholder {
  font-size: 1rem;
  font-weight: 500;
  color: #B1B1B1;
}

&:focus {
  outline: none; 
}
`

const DayInputItem = styled.input`
  border: none;
  width: 1.25rem;

&::placeholder {
  font-size: 1rem;
  font-weight: 500;
  color: #B1B1B1;
}

&:focus {
  outline: none; 
}
`
const GenderWrapper = styled.div`
  height: 4.5rem;
  width: 10.25rem;
  border-bottom: 1px solid #ABABAB;
  display: flex;
  align-items: center;
  margin-left: 1.44rem;

`
const GenderTitle = styled.div`
  width: 2.63rem;
  padding-left: 0.69rem;
`

const DropdownContainer = styled.div`
  position: relative;
  width: 5rem;
  margin-left: 1rem;
`;

const DropdownHeader = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ isSelected }) => (isSelected ? "var(--black)" : "#ABABAB")};
  
  cursor: pointer;
`;

const Arrow = styled.span<{ open: boolean }>`
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: 0.3s;
  font-size: 0.75rem;
  color: #ABABAB;
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 1.8rem;
  left: 0;
  right: 0;
  border: 1px solid #ABABAB;
  border-radius: 0.5rem;
  background: white;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 10;
`;

const DropdownItem = styled.li`
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  color: #000;
`;

function GenderDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <DropdownContainer>
      <DropdownHeader onClick={toggleDropdown} isSelected={!!selected}>
        {selected || "남"} 
        <Arrow open={isOpen}>▼</Arrow>
      </DropdownHeader>
      {isOpen && (
        <DropdownList>
          <DropdownItem onClick={() => handleSelect("남")}>남</DropdownItem>
          <DropdownItem onClick={() => handleSelect("여")}>여</DropdownItem>
        </DropdownList>
      )}
    </DropdownContainer>
  );
}

export default function SignUp1() {

  const navigate = useNavigate();

  return(
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
          <ContentTitle>01 기본 정보를 입력해주세요</ContentTitle>
          <InputContainer>
            <InputBox>
              <InputTitle>이름</InputTitle>
              <InputItem type="text" placeholder="홍길동"/>
            </InputBox>

            <InputBox>
              <InputTitle>닉네임</InputTitle>
              <InputItem type="text" placeholder="멋쟁이"/>
            </InputBox>

            <InputBox>
              <InputTitle>아이디</InputTitle>
              <InputItem type="text" placeholder="likelion"/>
            </InputBox>

            <InputBox>
              <InputTitle>전화번호</InputTitle>
              <InputItem type="tel" placeholder="01012341234"/>
            </InputBox>
            <Box>
              <InputWrapper>

                <BirthWrapper>
                  <BirthInputTitle>생년월일</BirthInputTitle>

                    <div><YearInputItem type="text" placeholder="2025" /> <span style={{ fontSize: "1rem", fontWeight: "500" }}>년</span> </div>
                    <div><MonthInputItem type="text" placeholder="10" /> <span style={{ fontSize: "1rem", fontWeight: "500" }}>월</span> </div>
                    <div><DayInputItem type="text" placeholder="31" /> <span style={{ fontSize: "1rem", fontWeight: "500" }}>일</span> </div>

                </BirthWrapper>


              </InputWrapper>
              <GenderWrapper>
                  <GenderTitle>성별</GenderTitle>
                  <GenderDropdown />
              </GenderWrapper>

            </Box>


            {/* 생년월일 성별 입력부분 필요*/}
            <InputBox>
              <InputTitle>비밀번호</InputTitle>
              <InputItem type="password" placeholder="********"/>
            </InputBox>
          </InputContainer>
          <SubmitButton onClick={() => navigate("/signup/step2")} />
      </ContentContainer>
    </Container>
  )
}