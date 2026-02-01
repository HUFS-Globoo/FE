import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { KeywordItem } from "../types/mypage&profile.types";

import { COUNTRY_ASSETS } from "../utils/countryAssets";

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

// 드롭다운 옵션
const campusOptions = [
  { value: "GLOBAL", label: "글로벌캠퍼스" },
  { value: "SEOUL", label: "서울캠퍼스" },
];

const languageOptions = [
  { value: "한국어", label: "한국어" },
  { value: "영어", label: "영어" },
  { value: "이탈리아어", label: "이탈리아어" },
  { value: "아랍어", label: "아랍어" },
  { value: "중국어", label: "중국어" },
];

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
  
  

  const [selectedValues, setSelectedValues] = useState({
    campus: campus,
    nativeLanguages: nativeLanguages,
    learnLanguages: learnLanguages,
  });

  const handleSelect = (name: string, value: string) => {
    if (name === "campus") {
      setSelectedValues({ ...selectedValues, [name]: value as "GLOBAL" | "SEOUL" });
    } else if (name === "nativeLanguages" || name === "learnLanguages") {
      setSelectedValues({ ...selectedValues, [name]: [value] });
    }
  };

  const countryCode = (country || "KR").toUpperCase();
  const fallbackCharacter =
    (COUNTRY_ASSETS[countryCode] || COUNTRY_ASSETS["KR"]).character;

  const characterImage = profileImageUrl || fallbackCharacter || "https://via.placeholder.com/200";



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

const processedKeywords = normalizeKeywords(keywords);


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


  const campusName =
    campusOptions.find((c) => c.value === selectedValues.campus)?.label || "글로벌캠퍼스";

  const contactItems = [
    {
      icon: CampusIcon,
      label: "캠퍼스",
      value: campusName,
      editable: true,
      dropdownName: "campus",
      options: campusOptions,
    },
    {
      icon: LanguageIcon,
      label: "사용언어",
      value: selectedValues.nativeLanguages.join(", ") || "-",
      editable: true,
      dropdownName: "nativeLanguages",
      options: languageOptions,
    },
    {
      icon: LanguageIcon,
      label: "선호언어",
      value: selectedValues.learnLanguages.join(", ") || "-",
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
                  # {keyword.name}
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
                              ? selectedValues.nativeLanguages[0] ?? ""
                              : selectedValues.learnLanguages[0] ?? ""
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