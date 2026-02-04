import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  color: var(--primary);
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
    color: var(--primary);
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
  color: var(--primary);
`;

const InputTitle = styled.div`
  width: 15.31rem;
  font-size: 1rem;
  font-weight: 500;
`;

const InputItem = styled.input`
  border: none;
  background-color: var(--white);
  &::placeholder {
    font-size: 1rem;
    font-weight: 500;
    color: #B1B1B1;
  }
  &:focus {
    outline: none;
  }

  /* 브라우저 자동완성(autofill) 배경을 흰색으로 통일 */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
    box-shadow: 0 0 0px 1000px var(--white) inset;
    -webkit-text-fill-color: var(--primary);
    transition: background-color 5000s ease-in-out 0s;
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
  background-color: var(--white);

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
    box-shadow: 0 0 0px 1000px var(--white) inset;
    -webkit-text-fill-color: var(--primary);
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const MonthInputItem = styled.input`
  border: none;
  width: 1.25rem;
  background-color: var(--white);

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
    box-shadow: 0 0 0px 1000px var(--white) inset;
    -webkit-text-fill-color: var(--primary);
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const DayInputItem = styled.input`
  border: none;
  width: 1.25rem;
  background-color: var(--white);

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
    box-shadow: 0 0 0px 1000px var(--white) inset;
    -webkit-text-fill-color: var(--primary);
    transition: background-color 5000s ease-in-out 0s;
  }
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
  color: var(--primary);
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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<"MALE" | "FEMALE" | "">("");

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (value: "MALE" | "FEMALE") => {
    setSelected(value);
    onSelect(value);
    setIsOpen(false);
  };

 
  const getDisplayText = (value: "MALE" | "FEMALE" | "") => {
    if (value === "MALE") return t("signup.step1.fields.gender.male");
    if (value === "FEMALE") return t("signup.step1.fields.gender.female");
    return t("signup.step1.fields.gender.select");
  };

  return (
    <DropdownContainer>
      <DropdownHeader onClick={toggleDropdown} isSelected={!!selected}>
        {getDisplayText(selected)}
        <Arrow open={isOpen}>▼</Arrow>
      </DropdownHeader>
      {isOpen && (
        <DropdownList>
          <DropdownItem onClick={() => handleSelect("MALE")}>{t("signup.step1.fields.gender.male")}</DropdownItem>
          <DropdownItem onClick={() => handleSelect("FEMALE")}>{t("signup.step1.fields.gender.female")}</DropdownItem>
        </DropdownList>
      )}
    </DropdownContainer>
  );
}

export default function SignUp1() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup();

  const steps = [
    { number: 1, detail: t("signup.steps.step1") },
    { number: 2, detail: t("signup.steps.step2") },
    { number: 3, detail: t("signup.steps.step3") },
    { number: 4, detail: t("signup.steps.step4") },
  ];

  const handleNext = () => {
    const updatedData = {
      ...signupData,
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
        <ContentTitle>{t("signup.step1.title")}</ContentTitle>

        <InputContainer>
          <InputBox>
            <InputTitle>{t("signup.step1.fields.name.label")}</InputTitle>
            <InputItem
              type="text"
              placeholder={t("signup.step1.fields.name.placeholder")}
              value={signupData.name || ""}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
            />
          </InputBox>

          <InputBox>
            <InputTitle>{t("signup.step1.fields.nickname.label")}</InputTitle>
            <InputItem
              type="text"
              placeholder={t("signup.step1.fields.nickname.placeholder")}
              value={signupData.nickname || ""}
              onChange={(e) =>
                setSignupData({ ...signupData, nickname: e.target.value })
              }
            />
          </InputBox>

          <InputBox>
            <InputTitle>{t("signup.step1.fields.username.label")}</InputTitle>
            <InputItem
              type="text"
              placeholder={t("signup.step1.fields.username.placeholder")}
              value={signupData.username || ""}
              onChange={(e) =>
                setSignupData({ ...signupData, username: e.target.value })
              }
            />
          </InputBox>

          <InputBox>
            <InputTitle>{t("signup.step1.fields.phoneNumber.label")}</InputTitle>
            <InputItem
              type="tel"
              placeholder={t("signup.step1.fields.phoneNumber.placeholder")}
              value={signupData.phoneNumber || ""}
              onChange={(e) =>
                setSignupData({ ...signupData, phoneNumber: e.target.value })
              }
            />
          </InputBox>

          <Box>
            <InputWrapper>
              <BirthWrapper>
                <BirthInputTitle>{t("signup.step1.fields.birthDate.label")}</BirthInputTitle>
                  <YearInputItem
                    type="text"
                    placeholder={t("signup.step1.fields.birthDate.yearPlaceholder")}
                    onChange={(e) => {
                      const [_, m = "", d = ""] = signupData.birthDate?.split("-") || [];
                      setSignupData({
                        ...signupData,
                        birthDate: `${e.target.value}-${m}-${d}`,
                      });
                    }}
                  />
                  <span>{t("signup.step1.fields.birthDate.year")}</span>

                  <MonthInputItem
                    type="text"
                    placeholder={t("signup.step1.fields.birthDate.monthPlaceholder")}
                    onChange={(e) => {
                      const [y = "", _, d = ""] = signupData.birthDate?.split("-") || [];
                      setSignupData({
                        ...signupData,
                        birthDate: `${y}-${e.target.value}-${d}`,
                      });
                    }}
                  />
                  <span>{t("signup.step1.fields.birthDate.month")}</span>
                  <DayInputItem
                    type="text"
                    placeholder={t("signup.step1.fields.birthDate.dayPlaceholder")}
                    onChange={(e) => {
                      const [y = "", m = ""] = signupData.birthDate?.split("-") || [];
                      setSignupData({
                        ...signupData,
                        birthDate: `${y}-${m}-${e.target.value}`,
                      });
                    }}
                  />
                  <span>{t("signup.step1.fields.birthDate.day")}</span>
              </BirthWrapper>
            </InputWrapper>

            <GenderWrapper>
              <GenderTitle>{t("signup.step1.fields.gender.label")}</GenderTitle>
              <GenderDropdown
                onSelect={(value) =>
                  setSignupData({ ...signupData, gender: value })
                }
              />
            </GenderWrapper>
          </Box>


          <InputBox>
            <InputTitle>{t("signup.step1.fields.password.label")}</InputTitle>
            <InputItem
              type="password"
              placeholder={t("signup.step1.fields.password.placeholder")}
              value={signupData.password || ""}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
          </InputBox>
        </InputContainer>

        <SubmitButton onClick={handleNext}>{t("signup.step1.nextButton")}</SubmitButton>
      </ContentContainer>
    </Container>
  );
}
