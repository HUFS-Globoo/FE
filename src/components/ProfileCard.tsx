import { useState, useRef, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { KeywordItem } from "../types/mypage&profile.types";

import { COUNTRY_ASSETS } from "../utils/countryAssets";
import { SUPPORTED_LANGUAGE_CODES } from "../utils/languages";

import EditIcon from "../assets/ic-edit.svg";
import CampusIcon from "../assets/ic-campus.svg";
import LanguageIcon from "../assets/ic-language-tag.svg";
import EmailIcon from "../assets/ic-email.svg";

interface ProfileCardProps {
  userId: number;
  username?: string;
  name?: string; 
  nickname: string;
  mbti: string;
  country: string;
  profileImageUrl: string | null;
  infoTitle: string | null;
  infoContent: string | null;


  keywords:
    | { personalityKeywords?: string[]; hobbyKeywords?: string[]; topicKeywords?: string[] }
    | KeywordItem[]
    | string[];

  campus: "GLOBAL" | "SEOUL";
  nativeLanguages: string[];
  learnLanguages: string[];
  email?: string;

  isOwner?: boolean;
  isEditMode?: boolean;
  onEdit?: () => void;
  onSave?: (updatedData: any) => void;
  onCancel?: () => void;
  onImageUpload?: (file: File) => void;
  onImageReset?: () => void;  // 이미지 리셋 핸들러 추가
}


const Card = styled.div<{ $isEditMode: boolean }>`
  width: 100%;
  box-sizing: border-box;
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 1rem;
  padding: 3rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 3rem;
  box-shadow: ${(props) =>
    props.$isEditMode ? "0 4px 12px rgba(34, 205, 252, 0.2)" : "none"};
`;

const TopSection = styled.div`
  display: flex;
  gap: 3rem;
  margin-bottom: 3rem;
  min-width: 0;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const CharacterImage = styled.img`
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  object-fit: cover;
  background-color: var(--gray);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const UserName = styled.div`
  color: var(--black);
`;

const UserMbti = styled.div`
  color: var(--skyblue);
`;

const RightSection = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const IntroSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 5rem;
`;

const IntroTitle = styled.div`
  color: var(--black);
`;

const IntroInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray);
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: "SchoolSafetyRoundedSmile", sans-serif;
  font-weight: 700;
  background-color: var(--gray-text-filled);

  &:focus {
    outline: none;
    border-color: var(--skyblue);
  }
`;

const IntroText = styled.p`
  color: var(--gray-700);
  margin: 0;
  line-height: 1.6;
`;

const IntroTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray);
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: "Escoredream", sans-serif;
  font-weight: 300;
  min-height: 8rem;
  resize: vertical;
  background-color: var(--gray-text-filled);

  &:focus {
    outline: none;
    border-color: var(--skyblue);
  }
`;

const TagSection = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Tag = styled.div<{ $category?: string }>`
  padding: 0.5rem 1rem;
  border-radius: 1.25rem;
  color: var(--black);
  background-color: ${({ $category }) => {
    switch ($category) {
      case "PERSONALITY":
        return "var(--yellow2)";
      case "HOBBY":
        return "var(--chip-skyblue)";
      case "TOPIC":
        return "var(--chip-green)";
      default:
        return "#FFE6A2";
    }
  }};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const EditButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--skyblue);
  border-radius: 0.75rem;
  background-color: var(--white);
  color: var(--skyblue);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    background-color: var(--skyblue);
    color: var(--white);

    img {
      filter: brightness(0) saturate(100%) invert(100%);
    }
  }
`;

const EditIconImg = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  transition: filter 0.2s;
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  background-color: var(--skyblue);
  color: var(--white);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--primary);
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--gray-400);
  border-radius: 0.75rem;
  background-color: var(--white);
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--gray);
  }
`;

const ContactGrid = styled.div<{$isOwner: boolean}>`
  display: grid;
  grid-template-columns: ${({ $isOwner }) =>
    $isOwner
      ? "repeat(4, minmax(0, 1fr))"
      : "repeat(3, minmax(0, 1fr))"};
  gap: ${({ $isOwner }) => ($isOwner ? "0.75rem" : "1rem")};
`;

const ContactContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const ContactTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ContactItem = styled.div<{ $isEditable?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
`;

const ContactIconWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 2.5rem; /* 이메일처럼 내용이 길어도 아이콘 배경은 줄어들지 않도록 고정 */
  background-color: var(--primary);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;

  & img {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const ContactLabel = styled.div`
  color: var(--gray-700);
`;

const ContactValue = styled.div`
  color: var(--black);
  word-break: break-all;
  overflow-wrap: anywhere;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--gray);
  border-radius: 0.5rem;
  background-color: var(--white);
  color: var(--black);
  font-size: 0.875rem;
  cursor: pointer;
`;

type ChipCategory = "PERSONALITY" | "HOBBY" | "TOPIC" | "DEFAULT";

const normalizeKeywords = (
  keywords: ProfileCardProps["keywords"]
): { name: string; category: ChipCategory }[] => {
  if (!keywords) return [];

  // 1) object 그룹형: { personalityKeywords, hobbyKeywords, topicKeywords }
  if (!Array.isArray(keywords)) {
    return [
      ...(keywords.personalityKeywords ?? []).map((name) => ({
        name,
        category: "PERSONALITY" as const,
      })),
      ...(keywords.hobbyKeywords ?? []).map((name) => ({
        name,
        category: "HOBBY" as const,
      })),
      ...(keywords.topicKeywords ?? []).map((name) => ({
        name,
        category: "TOPIC" as const,
      })),
    ];
  }

  // 2) string[] or KeywordItem[]
  return keywords
    .map((k) => {
      if (typeof k === "string") {
        return { name: k, category: "DEFAULT" as const };
      }
      // KeywordItem
      return {
        name: k.name,
        category: (k.category ?? "DEFAULT") as ChipCategory,
      };
    })
    .filter((k) => k.name);
};

const ProfileCard = ({
  userId,
  name,
  username,
  nickname,
  mbti,
  country,
  profileImageUrl,
  infoTitle,
  infoContent,
  keywords,
  campus,
  nativeLanguages,
  learnLanguages,
  email,
  isOwner = false,
  isEditMode = false,
  onEdit,
  onSave,
  onCancel,
  onImageUpload, 
  onImageReset, //이미지 리셋 핸들러 추가
}: ProfileCardProps) => {
  const { t } = useTranslation();

  // 캠퍼스 옵션을 동적으로 생성 (번역 지원)
  const campusOptions = useMemo(() => [
    { value: "GLOBAL", label: t("profile.campus.global") },
    { value: "SEOUL", label: t("profile.campus.seoul") },
  ], [t]);

  // 언어 옵션을 동적으로 생성
  const languageOptions = useMemo(() => 
    SUPPORTED_LANGUAGE_CODES.map(code => ({
      value: t(`randomMatch.languages.${code}`),
      label: t(`randomMatch.languages.${code}`)
    })), [t]
  );

  // 언어 이름을 언어 코드로 변환하는 맵 (메모이제이션)
  const LANGUAGE_REVERSE_MAP: Record<string, string> = useMemo(() => 
    Object.fromEntries(
      SUPPORTED_LANGUAGE_CODES.map(code => [
        t(`randomMatch.languages.${code}`),
        code
      ])
    ), [t]
  );
  
  // ✅ 유저별 고정 랜덤 인덱스 (userId 기반)
const pickIndex = (id: number, length: number) => {
  if (length === 0) return 0;
  return Math.abs(id) % length;
};

// ✅ fallback (타인 프로필에서만 사용)
const fallbackTitle = t("profile.bannerFallback.title", { nickname });

const fallbackContents = t("profile.bannerFallback.contents", {
  returnObjects: true,
}) as string[];

const fallbackContent =
  fallbackContents[pickIndex(userId ?? 0, fallbackContents.length)] ?? "";

// ✅ 공백도 비어있다고 처리
const safeTitle = (infoTitle ?? "").trim();
const safeContent = (infoContent ?? "").trim();

// ✅ 최종 표시 텍스트
const displayIntroTitle = isOwner
  ? safeTitle || "자기소개 제목을 입력해주세요"
  : safeTitle || fallbackTitle;

const displayIntroContent = isOwner
  ? safeContent || "자기소개 내용을 입력해주세요"
  : safeContent || fallbackContent;


  const [editedData, setEditedData] = useState({
    infoTitle: infoTitle || "",
    infoContent: infoContent || "",
    profileImage: profileImageUrl || null,
  });

  useEffect(() => {
    setEditedData(prev => ({
      ...prev,
      profileImage: profileImageUrl || null, 
    }));
  }, [infoTitle, infoContent, profileImageUrl]);

  // 번역된 언어 이름을 언어 코드로 변환하는 함수
  const translateToCode = (langName: string): string => {
    // 이미 언어 코드인 경우 (2글자 코드)
    if (langName && langName.length === 2 && /^[a-z]{2}$/i.test(langName)) {
      return langName;
    }
    // 번역된 이름인 경우 언어 코드로 변환
    return LANGUAGE_REVERSE_MAP[langName] || langName;
  };

  const [selectedValues, setSelectedValues] = useState({
    campus: campus,
    nativeLanguages: nativeLanguages.map(translateToCode),
    learnLanguages: learnLanguages.map(translateToCode),
  });

  // nativeLanguages나 learnLanguages가 변경될 때 selectedValues 업데이트
  useEffect(() => {
    const translateToCode = (langName: string): string => {
      // 이미 언어 코드인 경우 (2글자 코드)
      if (langName && langName.length === 2 && /^[a-z]{2}$/i.test(langName)) {
        return langName;
      }
      // 번역된 이름인 경우 언어 코드로 변환
      return LANGUAGE_REVERSE_MAP[langName] || langName;
    };
    
    const newNativeLanguages = nativeLanguages.map(translateToCode);
    const newLearnLanguages = learnLanguages.map(translateToCode);
    
    // 값이 실제로 변경되었는지 확인
    const hasChanged = 
      selectedValues.campus !== campus ||
      JSON.stringify(selectedValues.nativeLanguages) !== JSON.stringify(newNativeLanguages) ||
      JSON.stringify(selectedValues.learnLanguages) !== JSON.stringify(newLearnLanguages);
    
    if (hasChanged) {
      setSelectedValues({
        campus: campus,
        nativeLanguages: newNativeLanguages,
        learnLanguages: newLearnLanguages,
      });
    }
  }, [nativeLanguages, learnLanguages, campus, LANGUAGE_REVERSE_MAP]);

  const handleSelect = (name: string, value: string) => {
    if (name === "campus") {
      setSelectedValues({ ...selectedValues, [name]: value as "GLOBAL" | "SEOUL" });
    } else if (name === "nativeLanguages" || name === "learnLanguages") {
      // 번역된 언어 이름을 언어 코드로 변환
      const langCode = LANGUAGE_REVERSE_MAP[value] || value;
      setSelectedValues({ ...selectedValues, [name]: [langCode] });
    }
  };

  const countryCode = (country || "KR").toUpperCase();
  const fallbackCharacter =
    (COUNTRY_ASSETS[countryCode] || COUNTRY_ASSETS["KR"]).character;

  const characterImage = profileImageUrl || fallbackCharacter || "https://via.placeholder.com/200";

  // 키워드 번역 함수
  const translateKeyword = (keywordName: string, category: ChipCategory): string => {
    if (!keywordName) return keywordName;
    
    // category에 따라 적절한 번역 경로 사용
    let translationKey = "";
    switch (category) {
      case "PERSONALITY":
        translationKey = `signup.step4.keywords.personality.items.${keywordName}`;
        break;
      case "HOBBY":
        translationKey = `signup.step4.keywords.hobby.items.${keywordName}`;
        break;
      case "TOPIC":
        translationKey = `signup.step4.keywords.topic.items.${keywordName}`;
        break;
      default:
        return keywordName; // DEFAULT는 번역 없이 원본 반환
    }
    
    const translated = t(translationKey);
    // 번역을 찾지 못하면 원본 반환
    return translated !== translationKey ? translated : keywordName;
  };

  // 키워드 정규화 및 처리
  const processedKeywords = useMemo(() => normalizeKeywords(keywords), [keywords]);

  const [isEditingMbti, setIsEditingMbti] = useState(false);
  const [editedMbti, setEditedMbti] = useState(mbti);

  useEffect(() => {
    setEditedMbti(mbti);
  }, [mbti]);

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...editedData,
        mbti: editedMbti,
        campus: selectedValues.campus,
        nativeLanguages: selectedValues.nativeLanguages,
        learnLanguages: selectedValues.learnLanguages,
        profileImageUrl: editedData.profileImage,
      });
    }
  };
  

  const displayName = `${nickname}`;

  // 영어 언어 이름을 언어 코드로 변환하는 매핑 (대소문자 구분 없이)
  const languageNameToCode: { [key: string]: string } = {
    "korean": "ko",
    "english": "en",
    "chinese": "zh",
    "french": "fr",
    "german": "de",
    "japanese": "ja",
    "spanish": "es",
    "arabic": "ar",
    "italian": "it",
    "russian": "ru",
    "polish": "pl",
    "czech": "cs",
    "slovak": "sk",
    "romanian": "ro",
    "bulgarian": "bg",
    "vietnamese": "vi",
    "thai": "th",
    "indonesian": "id",
    "malay": "ms",
    "mongolian": "mn",
    "hindi": "hi",
    "persian": "fa",
    "turkish": "tr",
    "hebrew": "he",
    "kazakh": "kk",
    "uzbek": "uz",
  };

  // 언어 코드를 한국어로 번역하는 함수
  const getLanguageName = (lang: string): string => {
    if (!lang) return lang;
    
    // 이미 한국어로 번역된 경우 그대로 반환
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (koreanRegex.test(lang)) {
      return lang;
    }
    
    // 소문자로 정규화
    const normalized = lang.toLowerCase().trim();
    
    // 영어 이름인 경우 언어 코드로 변환
    let langCode = normalized;
    if (languageNameToCode[normalized]) {
      langCode = languageNameToCode[normalized];
    }
    
    // randomMatch.languages에서 먼저 찾기
    let translated = t(`randomMatch.languages.${langCode}`);
    if (translated && translated !== `randomMatch.languages.${langCode}`) {
      return translated;
    }
    
    // profile.languages에서 찾기
    translated = t(`profile.languages.${langCode}`);
    if (translated && translated !== `profile.languages.${langCode}`) {
      return translated;
    }
    
    // 번역을 찾지 못하면 원본 반환
    return lang;
  };

  const campusName =
    campusOptions.find((c) => c.value === selectedValues.campus)?.label || t("profile.campus.global");

  // 언어 배열을 번역된 문자열로 변환
  const translatedNativeLanguages = selectedValues.nativeLanguages
    .map(lang => getLanguageName(lang))
    .join(", ") || "-";
  
  const translatedLearnLanguages = selectedValues.learnLanguages
    .map(lang => getLanguageName(lang))
    .join(", ") || "-";

  const contactItems = [
    {
      icon: CampusIcon,
      label: t("profile.list.filters.campus"),
      value: campusName,
      editable: true,
      dropdownName: "campus",
      options: campusOptions,
    },
    {
      icon: LanguageIcon,
      label: "사용언어",
      value: translatedNativeLanguages,
      editable: true,
      dropdownName: "nativeLanguages",
      options: languageOptions,
    },
    {
      icon: LanguageIcon,
      label: "선호언어",
      value: translatedLearnLanguages,
      editable: true,
      dropdownName: "learnLanguages",
      options: languageOptions,
    },
  ];

  if (isOwner) {
  contactItems.push({
    icon: EmailIcon,
    label: "이메일",
    value: email || "이메일이 안보여요",
    editable: false,
    dropdownName: "",
    options: []
  });
}


  return (
    <Card $isEditMode={isEditMode}>
      <TopSection>
      <LeftSection>
        <CharacterImage
          src={editedData.profileImage || characterImage}
          alt="프로필 이미지"
          onClick={() => {
            if (isOwner && isEditMode) {
              document.getElementById("profileUploadInput")?.click();
            }
          }}
          style={{
            cursor: isOwner && isEditMode ? "pointer" : "default",
            opacity: isOwner && isEditMode ? 0.9 : 1,
          }}
        />

        <input
          id="profileUploadInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (onImageUpload) {
                onImageUpload(file);
              }

              setEditedData((prev) => ({
                ...prev,
                profileImage: URL.createObjectURL(file), 
              }));
              
            }
          }}
        />

        {/* 이미지 리셋 버튼 추가*/}

        {isOwner && isEditMode && onImageReset && (
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              gap: "0.5rem",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              className="Button2"
              onClick={() => {
                onImageReset();
                setEditedData((prev) => ({
                  ...prev,
                  profileImage: null,
                }));
              }}
            >
             기본 이미지로 되돌리기
            </button>
          </div>
        )}


      <UserInfo>
        <UserName className="H4">{displayName}</UserName>

        {isOwner && isEditMode ? (
          isEditingMbti ? (
            <input
              type="text"
              value={editedMbti}
              onChange={(e) => setEditedMbti(e.target.value.toUpperCase())}
              onBlur={() => setIsEditingMbti(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingMbti(false);
              }}
              maxLength={4}
              style={{
                textAlign: "center",
                border: "none",
                outline: "none",
                borderRadius: "0.4rem",
                padding: "0.3rem 0.6rem",
                width: "5rem",
                fontFamily: "SchoolSafetyRoundedSmile",
                fontSize: "1rem",
                color: "var(--skyblue)",
              }}
              autoFocus
            />
          ) : (
            <UserMbti
              className="H5"
              style={{ cursor: "pointer" }}
              onClick={() => setIsEditingMbti(true)}
            >
              {editedMbti}
            </UserMbti>
          )
        ) : (
          <UserMbti className="H5">{editedMbti}</UserMbti>
        )}
      </UserInfo>

      </LeftSection>

        
        <RightSection>
          <IntroSection>
            {isEditMode ? (
              <>
                <IntroInput
                  className="H4"
                  value={editedData.infoTitle}
                  onChange={(e) => setEditedData({...editedData, infoTitle: e.target.value})}
                  placeholder="자기소개 제목을 입력해주세요 (최대 120자)"
                  maxLength={120}
                />
                <IntroTextarea
                  className="Body1"
                  value={editedData.infoContent}
                  onChange={(e) => setEditedData({...editedData, infoContent: e.target.value})}
                  placeholder="자기소개 내용을 입력해주세요"
                />
              </>
            ) : (
              <>
                <IntroTitle className="H4">{displayIntroTitle}</IntroTitle>
                <IntroText className="Body1">{displayIntroContent}</IntroText>
              </>
            )}
            <TagSection>
              {processedKeywords.map((keyword, index) => (
                <Tag
                  key={index}
                  $category={keyword.category}
                  className="Body3"
                >
                  # {translateKeyword(keyword.name, keyword.category)}
                </Tag>
              ))}
            </TagSection>
          </IntroSection>


          <ContactGrid $isOwner={isOwner}>
            {contactItems.map((item) => (
              <ContactItem
                key={item.dropdownName ?? item.label}
                $isEditable={isOwner && isEditMode && item.editable}
              >
                <ContactContentWrapper>
                  <ContactIconWrapper>
                    <img src={item.icon} alt={item.label} />
                  </ContactIconWrapper>

                  <ContactTextWrapper>
                    <ContactLabel className="H4">{item.label}</ContactLabel>

                    {isOwner && isEditMode && item.editable && item.options ? (
                      <DropdownContainer>
                        <SelectInput
                          className="Body2"
                          value={
                            item.dropdownName === "campus"
                              ? selectedValues.campus
                              : item.dropdownName === "nativeLanguages"
                              ? (() => {
                                  const code = selectedValues.nativeLanguages[0] ?? "";
                                  return code ? t(`randomMatch.languages.${code}`) : "";
                                })()
                              : (() => {
                                  const code = selectedValues.learnLanguages[0] ?? "";
                                  return code ? t(`randomMatch.languages.${code}`) : "";
                                })()
                          }
                          onChange={(e) =>
                            handleSelect(item.dropdownName!, e.target.value)
                          }
                        >
                          {item.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </SelectInput>
                      </DropdownContainer>
                    ) : (
                      <ContactValue className="Body1">{item.value}</ContactValue>
                    )}
                  </ContactTextWrapper>
                </ContactContentWrapper>
              </ContactItem>
            ))}
          </ContactGrid>

          {isOwner && (
            <>
              {isEditMode ? (
                <ButtonGroup>
                  <CancelButton className="Button1" onClick={onCancel}>
                    {t("common.cancel")}
                  </CancelButton>
                  <SaveButton className="Button1" onClick={handleSave}>
                    {t("common.save")}
                  </SaveButton>
                </ButtonGroup>
              ) : (
                <ButtonGroup>
                  <EditButton className="Button1" onClick={onEdit}>
                    <EditIconImg src={EditIcon} alt="수정" />
                  {t("common.edit")}
                  </EditButton>
                </ButtonGroup>
              )}
            </>
          )}
        </RightSection>
      </TopSection>
    </Card>
  );
}

export default ProfileCard;