import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react"; 

export type SignupData = {
  // Step1
  name: string;
  nickname: string;
  username: string;
  password: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;

  // Step2
  email: string;
  code: string;
  isVerified: boolean;

  // Step3
  campus: string;
  nativeLanguageCode: string;
  preferredLanguageCode: string;
  nationalityCode: string;

  // Step4
  mbti: string;
  personalityKeywords: string[];
  hobbyKeywords: string[];
  topicKeywords: string[];
};

type SignupContextType = {
  signupData: SignupData;
  setSignupData: React.Dispatch<React.SetStateAction<SignupData>>;
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [signupData, setSignupData] = useState<SignupData>({
    name: "",
    nickname: "",
    username: "",
    password: "",
    phoneNumber: "",
    birthDate: "",
    gender: "",
    email: "",
    code: "",
    isVerified: false,
    campus: "",
    nativeLanguageCode: "",
    preferredLanguageCode: "",
    nationalityCode: "",
    mbti: "",
    personalityKeywords: [],
    hobbyKeywords: [],
    topicKeywords: [],

  });

  return (
    <SignupContext.Provider value={{ signupData, setSignupData }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context)
    throw new Error("useSignup은 SignupProvider로 감싸진 컴포넌트 안에서만 사용할 수 있습니다. App.tsx에서 SignupProvider로 감싸주세요");
  return context;
};
