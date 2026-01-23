import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { translateText } from "../api/translateAPI";
import { translatePageText, revertPageTranslation } from "../utils/autoTranslatePage";

export type Language = "ko" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateDynamic: (text: string) => Promise<string>;
  isTranslating: boolean;
  translateAllPageText?: () => Promise<void>; // 페이지 전체 자동 번역
}

// 언어 코드를 API에서 사용하는 언어명으로 변환
const getLanguageName = (lang: Language): string => {
  return lang === "ko" ? "한국어" : "영어";
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 번역 데이터
const translations: Record<Language, Record<string, string>> = {
  ko: {
    // Header
    "header.home": "홈",
    "header.randomMatch": "랜덤 매칭",
    "header.study": "스터디 모집",
    "header.profile": "프로필 조회",
    "header.message": "쪽지",
    "header.mypage": "MYPAGE",
    "header.login": "로그인",
    "header.logout": "로그아웃",
    
    // Common
    "common.save": "저장",
    "common.cancel": "취소",
    "common.edit": "수정하기",
    "common.delete": "삭제",
    "common.confirm": "확인",
    "common.close": "닫기",
    
    // Profile
    "profile.introTitle": "자기소개 제목을 입력해주세요",
    "profile.introContent": "자기소개 내용을 입력해주세요",
    "profile.campus": "캠퍼스",
    "profile.nativeLanguage": "사용언어",
    "profile.learnLanguage": "선호언어",
    "profile.email": "이메일",
    "profile.emailPrivate": "이메일은 비밀이에요",
    "profile.resetImage": "기본 이미지로 되돌리기",
    
    // Messages
    "message.logoutSuccess": "로그아웃되었습니다.",
    "message.logoutError": "로그아웃 처리 중 문제가 발생했습니다.",
    "message.matchingError": "매칭 요청 중 오류가 발생했습니다.",
    
    // Main Page
    "main.bannerTitle": "새로운 문화와 친구, 지금 우리 학교 안에서 시작해요",
    "main.bannerContent": "학교 이메일 인증으로 안전하게, 취향·성격·관심사 기반으로 나와 잘 맞는 외국인 친구를 찾아드려요.",
    "main.bannerContent2": "1:1 채팅으로 자연스럽게 언어를 배우고 문화를 나누며, 교내에서 시작되는 글로벌 네트워킹을 경험하세요.",
    "main.serviceTitle": "주요 서비스 소개",
    "main.randomMatchTitle": "친구 랜덤 매칭",
    "main.randomMatchContent": "취향과 성격을 기반으로",
    "main.randomMatchContent2": "교내 외국인 친구를 자동 매칭해 대화까지!",
    "main.studyTitle": "스터디 모집",
    "main.studyContent": "언어 교환부터 전공 스터디까지,",
    "main.studyContent2": "관심 분야별 팀을 만들어보세요!",
    "main.messageTitle": "쪽지",
    "main.messageContent": "친구들의 프로필을 구경하고",
    "main.messageContent2": "친해지고 싶은 친구에게 쪽지를 보내세요!",
    "main.startButton": "시작하기",
  },
  en: {
    // Header
    "header.home": "Home",
    "header.randomMatch": "Random Match",
    "header.study": "Study Group",
    "header.profile": "Profile",
    "header.message": "Message",
    "header.mypage": "MYPAGE",
    "header.login": "Login",
    "header.logout": "Logout",
    
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.confirm": "Confirm",
    "common.close": "Close",
    
    // Profile
    "profile.introTitle": "Please enter your introduction title",
    "profile.introContent": "Please enter your introduction content",
    "profile.campus": "Campus",
    "profile.nativeLanguage": "Native Language",
    "profile.learnLanguage": "Preferred Language",
    "profile.email": "Email",
    "profile.emailPrivate": "Email is private",
    "profile.resetImage": "Reset to default image",
    
    // Messages
    "message.logoutSuccess": "Logged out successfully.",
    "message.logoutError": "An error occurred during logout.",
    "message.matchingError": "An error occurred during matching request.",
    
    // Main Page
    "main.bannerTitle": "New culture and friends, start now within our school",
    "main.bannerContent": "Securely with school email verification, we find foreign friends who match you based on your tastes, personality, and interests.",
    "main.bannerContent2": "Naturally learn languages and share cultures through 1:1 chat, and experience global networking starting within the campus.",
    "main.serviceTitle": "Key Services",
    "main.randomMatchTitle": "Friend Random Matching",
    "main.randomMatchContent": "Automatically match with foreign friends",
    "main.randomMatchContent2": "on campus based on your tastes and personality, all the way to conversation!",
    "main.studyTitle": "Study Group",
    "main.studyContent": "From language exchange to major studies,",
    "main.studyContent2": "create teams by your interests!",
    "main.messageTitle": "Message",
    "main.messageContent": "Browse your friends' profiles",
    "main.messageContent2": "and send messages to friends you want to get closer to!",
    "main.startButton": "Get Started",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // localStorage에서 언어 설정 불러오기 (기본값: 한국어)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved === "ko" || saved === "en") ? saved : "ko";
  });

  const [isTranslating, setIsTranslating] = useState(false);
  
  // 번역 캐시: 같은 텍스트를 여러 번 번역하지 않도록
  const [translationCache, setTranslationCache] = useState<
    Map<string, string>
  >(new Map());

  // 언어 변경 시 localStorage에 저장 및 캐시 초기화
  useEffect(() => {
    localStorage.setItem("language", language);
    // 언어가 변경되면 캐시 초기화 (다른 언어로 번역해야 하므로)
    setTranslationCache(new Map());
    
    // DOM 직접 조작은 레이아웃을 깨뜨릴 수 있으므로 비활성화
    // 대신 React 컴포넌트 레벨에서 번역 키를 사용하도록 권장
    // 필요시 수동으로 translateAllPageText() 호출 가능
  }, [language]);

  // 페이지 전체 자동 번역 함수
  const translateAllPageText = useCallback(async () => {
    if (language === "en") {
      await translatePageText("영어");
    } else {
      revertPageTranslation();
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // 정적 번역 함수 (UI 텍스트용)
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // 동적 번역 함수 (사용자 입력 내용용)
  const translateDynamic = useCallback(
    async (text: string): Promise<string> => {
      // 빈 텍스트나 공백만 있는 경우 원본 반환
      if (!text || !text.trim()) {
        return text;
      }

      // 현재 언어가 한국어면 번역 불필요
      if (language === "ko") {
        return text;
      }

      // 캐시 확인
      const cacheKey = `${language}:${text}`;
      if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
      }

      // 이미 번역 중이면 원본 반환 (중복 요청 방지)
      if (isTranslating) {
        return text;
      }

      try {
        setIsTranslating(true);
        const targetLang = getLanguageName(language);
        const response = await translateText({
          text: text.trim(),
          targetLang: targetLang,
        });

        const translated = response.translatedText || text;
        
        // 캐시에 저장
        setTranslationCache((prev) => {
          const newCache = new Map(prev);
          newCache.set(cacheKey, translated);
          return newCache;
        });

        return translated;
      } catch (error) {
        console.error("동적 번역 실패:", error);
        // 번역 실패 시 원본 텍스트 반환
        return text;
      } finally {
        setIsTranslating(false);
      }
    },
    [language, translationCache, isTranslating]
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, translateDynamic, isTranslating, translateAllPageText }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguage must be used within a LanguageProvider"
    );
  }
  return context;
};
