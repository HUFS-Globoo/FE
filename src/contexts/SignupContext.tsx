import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react"; 

export interface SignupData {
  email?: string;
  username?: string;
  password?: string;
  name?: string;
  phoneNumber?: string;
  nickname?: string;
  birthDate?: string;               
  gender?: "MALE" | "FEMALE";
  campus?: "GLOBAL" | "SEOUL";
  nativeLanguageCode?: string;   
  preferredLanguageCode?: string;
  nationalityCode?: string;
  mbti?: string;
  personalityKeywords?: string[];
  hobbyKeywords?: string[];
  topicKeywords?: string[];
}


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
    gender: undefined,
    email: "",
    campus: undefined,
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
