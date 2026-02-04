import styled from "styled-components";
import { useTranslation } from "react-i18next";

const SignUpBox = styled.div`
  width: 29.3125rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5.56rem;
`;

const SignUpTitle = styled.div`
  padding-top: 4.56rem;
  font-family: 'Escoredream';
  font-size: 2rem;
  font-weight: 500;
  color: var(--primary);
`;

const StepContainer = styled.div`
  width: 14.3125rem;
  display: flex;
  flex-direction: column;
  gap: 3.75rem;
  color: var(--primary);
`;

const StepBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
  
`;

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
`;

const StepContent = styled.div`
  width: 10.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.81rem;
`;

const StepTitle = styled.div<{ $isActive: boolean }>`
  font-size: 0.875rem;
  font-weight: ${({ $isActive }) => ($isActive ? 500 : 300)};
`;

const StepDetail = styled.div<{ $isActive: boolean }>`
  font-size: 0.875rem;
  font-weight: ${({ $isActive }) => ($isActive ? 500 : 300)};
`;

interface Step {
  number: number;
  detail: string;
}

interface SignUpSidebarProps {
  steps: Step[];
  currentStep: number;
}

const SignUpSidebar = ({ steps, currentStep }: SignUpSidebarProps) => {
  const { t } = useTranslation();
  
  return (
    <SignUpBox>
      <SignUpTitle>{t("signup.sidebar.title")}</SignUpTitle>
      <StepContainer>
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          return (
            <StepBox key={step.number}>
              <StepIcon>{step.number}</StepIcon>
              <StepContent>
                <StepTitle $isActive={isActive}>{t("signup.sidebar.step")} {step.number}</StepTitle>
                <StepDetail $isActive={isActive}>{step.detail}</StepDetail>
              </StepContent>
            </StepBox>
          );
        })}
      </StepContainer>
    </SignUpBox>
  );
};

export default SignUpSidebar;
