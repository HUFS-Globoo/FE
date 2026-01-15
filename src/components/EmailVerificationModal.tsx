import styled from "styled-components";
import type { FC, ChangeEvent } from "react";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.18);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  position: relative;
  width: 32rem;
  min-height: 18rem;
  padding: 2.5rem 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  z-index: 10000;
`;

const CodeInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.06rem;
  width: 100%;
`;

const ModalContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const CodeInputBox = styled.div`
  display: flex;
  height: 4.5rem;
  border-bottom: 0.0625rem solid #ababab;
  box-sizing: border-box;
  width: 100%;
`;

const CodeInputTitle = styled.div`
  width: 10.25rem;
  padding-left: 0.69rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const CodeInputItem = styled.input`
  border: none;
  flex: 1;
  &::placeholder {
    font-size: 1rem;
    font-weight: 500;
    color: #b1b1b1;
  }

  &:focus {
    outline: none;
  }
`;

const VerificationButton = styled.div`
  display: flex;
  width: 7.69rem;
  height: 2.44rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.75rem;
  background-color: var(--primary);
  color: var(--white);
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
`;

type EmailVerificationModalProps = {
  isOpen: boolean;
  email?: string | null;
  verificationCode: string;
  onChangeCode: (e: ChangeEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  onResend: () => void;
  message?: string;
};

const EmailVerificationModal: FC<EmailVerificationModalProps> = ({
  isOpen,
  email,
  verificationCode,
  onChangeCode,
  onVerify,
  onResend,
  message = "이메일로 인증번호가 전송되었습니다!",
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 모달 컨테이너를 클릭한 경우가 아니면 무시 (배경 클릭 방지)
    if (e.target === e.currentTarget) {
      // 배경 클릭을 막기 위해 아무 동작도 하지 않음
      return;
    }
  };

  return (
    <Backdrop onClick={handleBackdropClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CodeInputContainer>
          <ModalContent>
            <p style={{ fontSize: "1.125rem", fontWeight: 500, marginBottom: "0.5rem", textAlign: "center" }}>
              {message}
            </p>
            {email && (
              <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.5rem" }}>
                {email}
              </p>
            )}
            <CodeInputBox>
              <CodeInputTitle className="Body1">인증 번호</CodeInputTitle>
              <CodeInputItem
                type="text"
                placeholder="인증번호를 입력하세요"
                value={verificationCode}
                onChange={onChangeCode}
              />
            </CodeInputBox>

            <ButtonWrapper>
              <VerificationButton className="Button2" onClick={onVerify}>
                인증번호 확인
              </VerificationButton>
              <VerificationButton className="Button2" onClick={onResend}>
                인증번호 재전송
              </VerificationButton>
            </ButtonWrapper>
          </ModalContent>
        </CodeInputContainer>
      </ModalContainer>
    </Backdrop>
  );
};

export default EmailVerificationModal;

