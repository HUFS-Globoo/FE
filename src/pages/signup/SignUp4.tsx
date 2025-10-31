import styled from "styled-components";
import SubmitButton from '../../components/SubmitButton';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


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


const SignUp4 = () => {

  const navigate = useNavigate();

  const mbtis = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"]
  const [mbti, setMbti] = useState("ENFP");
  const [mbtiOpen, setMbtiOpen] = useState(false);

  const personality = ["활발한", "솔직한", "차분한", "유쾌한", "친절한", "도전적", "신중한", "긍정적", "냉정한", "열정적인"];
  const hobbis = ["영화시청", "음악 감상", "요리", "독서", "카페가기", "운동", "산책", "사진 촬영", "게임", "여행"];
  const subjects = ["음악", "아이돌", "패션/뷰티", "스포츠", "영화/드라마", "공부", "자기계발", "책", "환경", "동물"];

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
          <ContentTitle>04 나를 소개하는 키워드를 선택해주세요 </ContentTitle>
          <InputContainer>
            <MbtiInputContainer>
              <MbtiInputTitle className="Body1">MBTI</MbtiInputTitle>
              <SelectedBox
              isSelected={!!mbti}
              onClick={() => setMbtiOpen(!mbtiOpen)}
            >
              {mbti || "선택"}
              <Arrow open={mbtiOpen}>▾</Arrow>

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
              <p style={{fontSize:"1.25rem"}}>자신의 성격에 맞는 키워드를 선택해주세요</p>
              <KeywordBox>
                {personality.map((persona) => (
                  <KeywordItem key={persona} style={{backgroundColor:"var(--yellow2)"}}># {persona}</KeywordItem>
                ))}
              </KeywordBox>
              <p style={{fontSize:"1.25rem"}}>관심있는 취미를 선택해주세요</p>
              <KeywordBox>
                {hobbis.map((hobby) => (
                  <KeywordItem key={hobby} style={{backgroundColor:"var(--chip-skyblue)"}}># {hobby}</KeywordItem>
                ))}
              </KeywordBox>
              <p style={{fontSize:"1.25rem"}}>관심있는 주제를 선택해주세요</p>
              <KeywordBox>
                {subjects.map((subject) => (
                  <KeywordItem key={subject} style={{backgroundColor:"var( --chip-green)"}}># {subject}</KeywordItem>
                ))}
              </KeywordBox>

            </KeywordContainer>
          </InputContainer>
          <SubmitButton onClick={() => navigate("/login")}/>
      </ContentContainer>

    </Container>
  );
};

export default SignUp4;