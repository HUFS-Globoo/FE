import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SubmitButton from '../../components/SubmitButton';
import { useState } from "react";
import { useSignup } from "../../contexts/SignupContext";
import SignUpSidebar from '../../components/SignUpSidebar';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 7.81rem;
  padding-left: 8.06rem;
  gap: 3.75rem;
`;

const ContentTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
`;

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
const Circle = styled.div<{ selected: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 0.2rem solid var(--gray);
  background: ${({ selected }) => (selected ? "var(--primary)" : "var(--gray)")};
`;

const InputContainer = styled.div`
  width: 35.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.88rem;
`;

const InputBox = styled.div`
  height: 4.5rem;
  padding-left: 0.69rem;
  border-bottom: 1px solid #ABABAB;
  display: flex;
  align-items: center;
`;

const InputTitle = styled.div`
  width: 15.31rem;
  font-size: 1rem;
  font-weight: 500;
`;

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
`;

const BirthWrapper = styled.div`
  width: 23.81rem;
  display: flex;
  flex-direction: row;
  gap: 1.63rem;
`;

const BirthInputTitle = styled.div`
  width: 7.44rem;
  font-size: 1rem;
  font-weight: 500;
`;

const YearInputItem = styled.input`
  border: none;
  width: 2.5rem;
`;

const MonthInputItem = styled.input`
  border: none;
  width: 1.25rem;
`;

const DayInputItem = styled.input`
  border: none;
  width: 1.25rem;
`;

const Box = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

`
const GenderWrapper = styled.div`
  height: 4.5rem;
  width: 10.25rem;
  border-bottom: 1px solid #ABABAB;
  display: flex;
  align-items: center;
  margin-left: 1.44rem;
`;

const GenderTitle = styled.div`
  width: 2.63rem;
  padding-left: 0.69rem;
`;

const DropdownContainer = styled.div`
  position: relative;
  width: 5rem;
  margin-left: 1rem;
`;

const DropdownHeader = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  cursor: pointer;
  color: #000;
`;


function GenderDropdown({ onSelect }: { onSelect: (value: "MALE" | "FEMALE") => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<"MALE" | "FEMALE" | "">("");

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (value: "MALE" | "FEMALE") => {
    setSelected(value);
    onSelect(value);
    setIsOpen(false);
  };

 
  const getDisplayText = (value: "MALE" | "FEMALE" | "") => {
    if (value === "MALE") return "남성";
    if (value === "FEMALE") return "여성";
    return "성별 선택";
  };

  return (
    <DropdownContainer>
      <DropdownHeader onClick={toggleDropdown} isSelected={!!selected}>
        {getDisplayText(selected)}
        <Arrow open={isOpen}>▼</Arrow>
      </DropdownHeader>
      {isOpen && (
        <DropdownList>
          <DropdownItem onClick={() => handleSelect("MALE")}>남성</DropdownItem>
          <DropdownItem onClick={() => handleSelect("FEMALE")}>여성</DropdownItem>
        </DropdownList>
      )}
    </DropdownContainer>
  );
}

export default function SignUp1() {
  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup();
  const [campus, setCampus] = useState<"GLOBAL" | "SEOUL">("GLOBAL");

  const steps = [
    { number: 1, detail: "기본 정보 입력" },
    { number: 2, detail: "학교 이메일 인증" },
    { number: 3, detail: "언어 & 국적" },
    { number: 4, detail: "나를 소개하는 키워드 선택" },
  ];

  const handleNext = () => {
    const updatedData = {
      ...signupData,
      campus: campus || "SEOUL",
      gender: signupData.gender || "MALE",
      birthDate: signupData.birthDate || "2000-01-01",
      email: signupData.email,
      username: signupData.username,
      password: signupData.password,
      name: signupData.name,
      nickname: signupData.nickname,
      phoneNumber: signupData.phoneNumber,
    };
  
    setSignupData(updatedData);
    console.log("Step1 저장된 데이터:", updatedData); 
    navigate("/signup/step2");
  };

  return (
    <Container>
      <SignUpSidebar steps={steps} currentStep={1} />

      <ContentContainer>
        <ContentTitle>01 기본 정보를 입력해주세요</ContentTitle>

        <SelectContainer>
          <Label onClick={() => setCampus("GLOBAL")}>
            <Circle selected={campus === "GLOBAL"} />
            글로벌
          </Label>
          <Label onClick={() => setCampus("SEOUL")}>
            <Circle selected={campus === "SEOUL"} />
            서울
          </Label>
        </SelectContainer>

        <InputContainer>
          <InputBox>
            <InputTitle>이름</InputTitle>
            <InputItem
              type="text"
              placeholder="홍길동"
              value={signupData.name || ""}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
            />
          </InputBox>

          <InputBox>
            <InputTitle>닉네임</InputTitle>
            <InputItem
              type="text"
              placeholder="멋쟁이"
              value={signupData.nickname || ""}
              onChange={(e) =>
                setSignupData({ ...signupData, nickname: e.target.value })
              }
            />
          </InputBox>

          <InputBox>
            <InputTitle>아이디</InputTitle>
            <InputItem
              type="text"
              placeholder="likelion"
              value={signupData.username || ""}
              onChange={(e) =>
                setSignupData({ ...signupData, username: e.target.value })
              }
            />
          </InputBox>

          <InputBox>
            <InputTitle>전화번호</InputTitle>
            <InputItem
              type="tel"
              placeholder="01012341234"
              value={signupData.phoneNumber || ""}
              onChange={(e) =>
                setSignupData({ ...signupData, phoneNumber: e.target.value })
              }
            />
          </InputBox>

          <InputBox>
            <InputTitle>이메일</InputTitle>
            <InputItem
              type="text"
              placeholder="likelion@hufs.ac.kr"
              value={signupData.email || ""}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
          </InputBox>
          <Box>
            <InputWrapper>
              <BirthWrapper>
                <BirthInputTitle>생년월일</BirthInputTitle>
                  <YearInputItem
                    type="text"
                    placeholder="2025"
                    onChange={(e) => {
                      const [_, m = "", d = ""] = signupData.birthDate?.split("-") || [];
                      setSignupData({
                        ...signupData,
                        birthDate: `${e.target.value}-${m}-${d}`,
                      });
                    }}
                  />
                  <span>년</span>

                  <MonthInputItem
                    type="text"
                    placeholder="10"
                    onChange={(e) => {
                      const [y = "", _, d = ""] = signupData.birthDate?.split("-") || [];
                      setSignupData({
                        ...signupData,
                        birthDate: `${y}-${e.target.value}-${d}`,
                      });
                    }}
                  />
                  <span>월</span>
                  <DayInputItem
                    type="text"
                    placeholder="31"
                    onChange={(e) => {
                      const [y = "", m = ""] = signupData.birthDate?.split("-") || [];
                      setSignupData({
                        ...signupData,
                        birthDate: `${y}-${m}-${e.target.value}`,
                      });
                    }}
                  />
                  <span>일</span>
              </BirthWrapper>
            </InputWrapper>

            <GenderWrapper>
              <GenderTitle>성별</GenderTitle>
              <GenderDropdown
                onSelect={(value) =>
                  setSignupData({ ...signupData, gender: value })
                }
              />
            </GenderWrapper>
          </Box>


          <InputBox>
            <InputTitle>비밀번호</InputTitle>
            <InputItem
              type="password"
              placeholder="********"
              value={signupData.password || ""}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
          </InputBox>
        </InputContainer>

        <SubmitButton onClick={handleNext}>다음 단계</SubmitButton>
      </ContentContainer>
    </Container>
  );
}
