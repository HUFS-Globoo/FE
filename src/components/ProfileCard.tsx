import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import AmericaProfileImg from "../assets/img-profile1-America.svg";
import KoreaProfileImg from "../assets/img-profile1-Korea.svg";
import ItalyProfileImg from "../assets/img-profile1-Italy.svg";
import EgyptProfileImg from "../assets/img-profile1-Egypt.svg";
import ChinaProfileImg from "../assets/img-profile1-China.svg";
import EditIcon from "../assets/ic-edit.svg";
import CampusIcon from "../assets/ic-campus.svg";
import LanguageIcon from "../assets/ic-language-tag.svg";
import EmailIcon from "../assets/ic-email.svg";


interface ProfileCardProps {
  userId?: number;
  username?: string;
  nickname: string;
  mbti: string;
  country: string;
  profileImage: string | null;
  infoTitle: string | null;
  infoContent: string | null;


  keywords:
    | {
        personalityKeywords?: string[];
        hobbyKeywords?: string[];
        topicKeywords?: string[];
      }
    | Array<{ id?: number; name: string }>
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
}

// 국가별 캐릭터 이미지 매핑
const countryCharacterImages: { [key: string]: string } = {
  US: AmericaProfileImg,
  KR: KoreaProfileImg,
  IT: ItalyProfileImg,
  EG: EgyptProfileImg,
  CN: ChinaProfileImg,
};

// 드롭다운 옵션
const campusOptions = [
  { value: "GLOBAL", label: "글로벌캠퍼스" },
  { value: "SEOUL", label: "서울캠퍼스" },
];

const languageOptions = [
  { value: "한국어", label: "한국어" },
  { value: "일본어", label: "일본어" },
  { value: "영어", label: "영어" },
  { value: "이탈리아어", label: "이탈리아어" },
  { value: "아랍어", label: "아랍어" },
  { value: "중국어", label: "중국어" },
];

const Card = styled.div<{ $isEditMode: boolean }>`
  width: 100%;
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
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
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--gray);
  border-radius: 0.5rem;
  background-color: var(--white);
  color: var(--black);
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;

  &:hover {
    border-color: var(--skyblue);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background-color: var(--gray-text-filled);
  }
`;

const ProfileCard = ({
  username,
  nickname,
  mbti,
  country,
  profileImage,
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
}: ProfileCardProps) => {
  const [editedData, setEditedData] = useState({
    infoTitle: infoTitle || "",
    infoContent: infoContent || "",
    profileImage: profileImage || null,
  });

  useEffect(() => {
    setEditedData(prev => ({
      ...prev,
      profileImage: profileImage || null, 
    }));
  }, [infoTitle, infoContent, profileImage]);
  
  

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState({
    campus: campus,
    nativeLanguages: nativeLanguages,
    learnLanguages: learnLanguages,
  });

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target as Node)
      );
      if (isOutside) setOpenDropdown(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSelect = (name: string, value: string) => {
    if (name === "campus") {
      setSelectedValues({ ...selectedValues, [name]: value as "GLOBAL" | "SEOUL" });
    } else if (name === "nativeLanguages" || name === "learnLanguages") {
      setSelectedValues({ ...selectedValues, [name]: [value] });
    }
    setOpenDropdown(null);
  };

  const characterImage =
    profileImage || countryCharacterImages[country] || "https://via.placeholder.com/200";

  const processedKeywords = [
    ...(Array.isArray((keywords as any)?.personalityKeywords)
      ? (keywords as any).personalityKeywords.map((k: string) => ({
          name: k,
          category: "PERSONALITY",
        }))
      : []),
    ...(Array.isArray((keywords as any)?.hobbyKeywords)
      ? (keywords as any).hobbyKeywords.map((k: string) => ({
          name: k,
          category: "HOBBY",
        }))
      : []),
    ...(Array.isArray((keywords as any)?.topicKeywords)
      ? (keywords as any).topicKeywords.map((k: string) => ({
          name: k,
          category: "TOPIC",
        }))
      : []),
  ];

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
  

  const displayName = username ? `${username} / ${nickname}` : nickname;
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
    {
      icon: EmailIcon,
      label: "이메일",
      value: email || "이메일은 비밀~",
      editable: false,
    },
  ];

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
                <IntroTitle className="H4">
                  {editedData.infoTitle || "자기소개 제목을 입력해주세요"}
                </IntroTitle>
                <IntroText className="Body1">
                  {editedData.infoContent || "자기소개 내용을 입력해주세요"}
                </IntroText>
              </>
            )}
            <TagSection>
              {processedKeywords.map((keyword, index) => (
                <Tag
                  key={index}
                  $category={keyword.category}
                  className="Body2"
                >
                  # {keyword.name}
                </Tag>
              ))}
            </TagSection>
          </IntroSection>


          <ContactGrid>
            {contactItems.map((item, index) => (
              <ContactItem key={index} $isEditable={isOwner && isEditMode && item.editable}>
                <ContactContentWrapper>
                  <ContactIconWrapper>
                    <img src={item.icon} alt={item.label} />
                  </ContactIconWrapper>

                    <ContactTextWrapper> 
                        <ContactLabel className="H4">{item.label}</ContactLabel>
                    
                        {isOwner && isEditMode && item.editable && item.options ? (
                        <DropdownContainer ref={(el: HTMLDivElement | null) => {dropdownRefs.current[item.dropdownName!] = el;}}>
                            <DropdownButton onClick={() => toggleDropdown(item.dropdownName!)}>
                              <span className="Body2">{item.value}</span>
                              <span>▼</span>
                            </DropdownButton>
                            {openDropdown === item.dropdownName && (
                              <DropdownMenu>
                                {item.options.map((option) => (
                                  <DropdownItem
                                    key={option.value}
                                    onClick={() => handleSelect(item.dropdownName!, option.value)}
                                    className="Body2"
                                  >
                                    {option.label}
                                  </DropdownItem>
                                ))}
                            </DropdownMenu>
                            )}
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
                    취소
                  </CancelButton>
                  <SaveButton className="Button1" onClick={handleSave}>
                    저장
                  </SaveButton>
                </ButtonGroup>
              ) : (
                <ButtonGroup>
                  <EditButton className="Button1" onClick={onEdit}>
                    <EditIconImg src={EditIcon} alt="수정" />
                    수정하기
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