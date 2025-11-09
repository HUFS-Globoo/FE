import { useEffect, useState } from "react";
import styled from "styled-components";
import ProfileCard from "../components/ProfileCard";
import ActivityTabs from "../components/ActivityTabs";
import axiosInstance from "../../axiosInstance";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: var(--gray-text-filled);
  padding: 3rem 0;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PageTitle = styled.h1`
  margin-bottom: 2.5rem;
`;

const Mypage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [languages, setLanguages] = useState<{ nativeCodes: string[]; learnCodes: string[] }>({
    nativeCodes: [],
    learnCodes: [],
  });
  const [keywords, setKeywords] = useState<{ personality: string[]; hobby: string[]; topic: string[] }>({
    personality: [],
    hobby: [],
    topic: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");

  const LANGUAGE_MAP: Record<string, string> = {
    ko: "한국어",
    en: "영어",
    es: "스페인어",
    fr: "프랑스어",
    ja: "일본어",
    zh: "중국어",
    de: "독일어",
    it: "이탈리아어",
  };

  const LANGUAGE_REVERSE_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(LANGUAGE_MAP).map(([k, v]) => [v, k])
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get("/api/users/me");
        const user = res.data;

        setUserData(user);

        setLanguages({
          nativeCodes: user.nativeLanguages || [],
          learnCodes: user.learnLanguages || [],
        });
        setKeywords({
          personality: user.personalityKeywords || [],
          hobby: user.hobbyKeywords || [],
          topic: user.topicKeywords || [],
        });

        console.log("내 정보:", user);
      } catch (error) {
        console.error("마이페이지 데이터 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 프로필 수정
  const handleProfileSave = async (updatedData: any) => {
    try {
      const finalData = {
        name: userData.name,
        nickname: updatedData.nickname || userData.nickname,
        mbti: updatedData.mbti || userData.mbti,
        profileImageUrl: updatedData.profileImageUrl || userData.profileImageUrl,
        infoTitle: updatedData.infoTitle || userData.infoTitle,
        infoContent: updatedData.infoContent || userData.infoContent,
        campus: updatedData.campus || userData.campus,
        country: updatedData.country || userData.country,
        email: userData.email,
        nativeLanguages: (updatedData.nativeLanguages || languages.nativeCodes || []).map(
          (lang: string) => LANGUAGE_REVERSE_MAP[lang] || lang
        ),
        learnLanguages: (updatedData.learnLanguages || languages.learnCodes || []).map(
          (lang: string) => LANGUAGE_REVERSE_MAP[lang] || lang
        ),
        personalityKeywords: updatedData.personalityKeywords || keywords.personality,
        hobbyKeywords: updatedData.hobbyKeywords || keywords.hobby,
        topicKeywords: updatedData.topicKeywords || keywords.topic,
      };

      console.log("PATCH body:", JSON.stringify(finalData, null, 2));

      await axiosInstance.patch("/api/users/me", finalData);
      alert("프로필이 성공적으로 수정되었습니다!");

      const refreshed = await axiosInstance.get("/api/users/me");
      const refreshedUser = refreshed.data;

      setUserData(refreshedUser);
      setLanguages({
        nativeCodes: refreshedUser.nativeLanguages || [],
        learnCodes: refreshedUser.learnLanguages || [],
      });
      setKeywords({
        personality: refreshedUser.personalityKeywords || [],
        hobby: refreshedUser.hobbyKeywords || [],
        topic: refreshedUser.topicKeywords || [],
      });
      setIsEditMode(false);
    } catch (error: any) {
      console.error("프로필 수정 실패:", error.response?.data || error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  // 프로필 이미지 업로드
  const handleProfileImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      await axiosInstance.post("/api/users/me/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const refreshed = await axiosInstance.get("/api/users/me");
      const refreshedUser = refreshed.data;
  
      if (refreshedUser.profileImageUrl) {
        refreshedUser.profileImageUrl =
          refreshedUser.profileImageUrl.replace(/([^:]\/)\/+/g, "$1") +
          `?t=${Date.now()}`;
      }
  
      setUserData({
        ...refreshedUser,
        _updateKey: Date.now(),
      });
  
      alert("프로필 이미지가 성공적으로 업로드되었습니다!");
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };
  

  return (
    <Container>
      <ContentWrapper>
        <PageTitle className="H1">My Page</PageTitle>

        {!isLoading && userData && (
        (() => {
          const cleanedProfileUrl = userData.profileImageUrl
            ? userData.profileImageUrl.replace(/([^:]\/)\/+/g, "$1")
            : null;
        
          return (
            <ProfileCard
              key={`${cleanedProfileUrl}-${userData._updateKey || ""}`}
              userId={userData.id}
              username={userData.username}
              nickname={userData.nickname}
              mbti={userData.mbti}
              country={userData.country}
              profileImage={cleanedProfileUrl}
              infoTitle={userData.infoTitle}
              infoContent={userData.infoContent}
              keywords={{
                personalityKeywords: keywords.personality,
                hobbyKeywords: keywords.hobby,
                topicKeywords: keywords.topic,
              }}
              campus={userData.campus}
              nativeLanguages={languages.nativeCodes.map(
                (code) => LANGUAGE_MAP[code] || code
              )}
              learnLanguages={languages.learnCodes.map(
                (code) => LANGUAGE_MAP[code] || code
              )}
              email={userData.email}
              isOwner={true}
              isEditMode={isEditMode}
              onEdit={() => setIsEditMode(true)}
              onSave={handleProfileSave}
              onCancel={() => setIsEditMode(false)}
              onImageUpload={handleProfileImageUpload}
            />
          );
        })()
      )}


        <ActivityTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          posts={[]} // 게시글 API 연동 예정
          comments={[]} // 댓글 API 연동 예정
        />
      </ContentWrapper>
    </Container>
  );
};

export default Mypage;
