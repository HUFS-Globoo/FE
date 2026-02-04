import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import ActivityTabs from "../components/ActivityTabs";
import axiosInstance from "../../axiosInstance";
import type { Post, Comment, AppliedStudy } from "../types/mypage&profile.types";
import { updateComment, deleteComment } from "../api/commentAPI";
import { getProfileSrc } from "../utils/profileImage";
import { SUPPORTED_LANGUAGE_CODES } from "../utils/languages";


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

const WithdrawButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 64px;`;

const WithdrawButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--gray-wf);
  background-color: var(--white);
  color: var(--gray-700);
  cursor: pointer;
  
  &:hover {
    background-color: var(--gray-400);
    background: var(--gray-text-filled);
  }

  &:active {
  transform: translateY(1px);
}
`;

const PageTitle = styled.h1`
  margin-bottom: 2.5rem;
  color: var(--primary);
`;

const Mypage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const location = useLocation();
  const initialTab =
  (location.state as any)?.activeTab === "comments" ? "comments" : "posts";
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
  const [activeTab, setActiveTab] =
  useState<"posts" | "comments" | "applied">(initialTab);  
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [myComments, setMyComments] = useState<Comment[]>([]);
  const [myAppliedStudies, setMyAppliedStudies] = useState<AppliedStudy[]>([]);

  const LANGUAGE_MAP: Record<string, string> = useMemo(() => 
    Object.fromEntries(
      SUPPORTED_LANGUAGE_CODES.map(code => [
        code,
        t(`randomMatch.languages.${code}`)
      ])
    ), [t]
  );

  const LANGUAGE_REVERSE_MAP: Record<string, string> = useMemo(() => 
    Object.fromEntries(
      Object.entries(LANGUAGE_MAP).map(([k, v]) => [v, k])
    ), [LANGUAGE_MAP]
  );

  const fetchMyKeywords = useCallback(async () => {
      try {
        const res = await axiosInstance.get("/api/users/me/keywords");
        const kw = res.data;

        setKeywords({
          personality: kw.personality ?? [],
          hobby: kw.hobby ?? [],
          topic: kw.topic ?? [],
        });

        console.log("내 키워드:", kw);
      } catch (error) {
        console.error("내 키워드 조회 실패:", error);
      }
    }, []);

    const fetchMyAppliedStudies = async () => {
  try {
    const res = await axiosInstance.get("/api/me/studies/applied");
    setMyAppliedStudies(res.data?.data ?? []);
  } catch (e) {
    console.error("신청한 스터디 조회 실패:", e);
  }
};

    
  useEffect(() => {

    const fetchUserData = async () => {
    try {
      const res = await axiosInstance.get("/api/users/me");
      const user = res.data;

      const useDefaultProfile =
        localStorage.getItem("useDefaultProfileImage") === "true";
      if (useDefaultProfile) user.profileImageUrl = null;

      setUserData(user);
      setLanguages({
        nativeCodes: user.nativeLanguages || [],
        learnCodes: user.learnLanguages || [],
      });

      console.log("내 정보:", user);
    } catch (error) {
      console.error("마이페이지 데이터 조회 실패:", error);
    }
  };

    const fetchMyPosts = async () => {
      try {
        const res = await axiosInstance.get("/api/users/me/study-posts");
        const data = res.data as any[];

        const mapped: Post[] = data.map((post) => ({
          id: post.id,
          status: post.status as "모집중" | "마감",
          currentParticipants: post.currentParticipants,
          maxParticipants: post.capacity,
          title: post.title,
          tags: [
            ...(post.campuses || []),
            ...(post.languages || []),
          ],
          createdAt: post.createdAt,
        }));

        setMyPosts(mapped);
      } catch (error) {
      console.error("내가 작성한 스터디 글 조회 실패:", error);
      }
    };

    const fetchMyComments = async () => {
      try {
        const res = await axiosInstance.get("/api/users/me/comments");
        const data = res.data as any[];

        const mapped: Comment[] = await Promise.all(
          data.map(async (comment) => {
            try {
              const postRes = await axiosInstance.get(
                `/api/studies/${comment.postId}`
              );
              const post = postRes.data.data;

              const tags = [
                ...(post.campuses || []),
                ...(post.languages || []),
              ];

              return {
                id: comment.id,
                postId: comment.postId,
                postTitle: post.title,
                content: comment.content,
                status: post.status as "모집중" | "마감",
                currentParticipants: post.currentParticipants,
                maxParticipants: post.capacity,
                tags,
              } as Comment;
            } catch (e) {
              console.error(
                `댓글 ${comment.id}의 게시글 정보 조회 실패:`,
                e
              );

              return {
                id: comment.id,
                postId: comment.postId,
                postTitle: t("mypage.comments.postTitleFallback"),
                content: comment.content,
              } as Comment;
            }
          })
        );

        setMyComments(mapped);
      } catch (error) {
      console.error("내가 작성한 댓글 조회 실패:", error);
      }
    };

    (async () => {
    try {
      await Promise.all([
        fetchUserData(),
        fetchMyKeywords(),
        fetchMyPosts(),
        fetchMyComments(),
        fetchMyAppliedStudies(),
      ]);
    } finally {
      setIsLoading(false);
    }
  })();
}, [fetchMyKeywords]);


const handleAppliedStudyClick = (studyId: number) => {
  navigate(`/study/${studyId}`);
};


 const handleProfileSave = async (updatedData: any) => {
  try {
    // 1) 서버에 보낼 데이터 구성 (이미지 건들지 않음)
    const finalData: any = {
      name: userData.name,
      nickname: updatedData.nickname || userData.nickname,
      mbti: updatedData.mbti || userData.mbti,
      infoTitle: updatedData.infoTitle || userData.infoTitle,
      infoContent: updatedData.infoContent || userData.infoContent,
      campus: updatedData.campus || userData.campus,
      country: updatedData.country || userData.country,
      email: userData.email,
    };

    // 🔹 profileImageUrl은 여기서 아예 안 보냄
    // (이미지 변경은 업로드/리셋 핸들러에서만!)

    await axiosInstance.patch("/api/users/me", finalData);

    // 2) 언어 코드 처리 그대로 유지
    const finalNative = (updatedData.nativeLanguages ?? languages.nativeCodes)
      .map((lang: string) => LANGUAGE_REVERSE_MAP[lang] || lang);

    const finalLearn = (updatedData.learnLanguages ?? languages.learnCodes)
      .map((lang: string) => LANGUAGE_REVERSE_MAP[lang] || lang);

    const languagePutData = {
      nativeCodes: finalNative,
      learnCodes: finalLearn,
    };

    await axiosInstance.put("/api/users/me/languages", languagePutData);

    alert(t("mypage.alert.profileUpdateSuccess"));

    // 3) 내 정보 다시 불러오기
    const refreshed = await axiosInstance.get("/api/users/me");
    const refreshedUser = refreshed.data;
    console.log("리셋 후 서버 profileImageUrl:", refreshedUser.profileImageUrl);

    // 🔹 로컬스토리지 플래그는 건드리지 않음
    // 대신, 플래그 값에 따라 보여줄 URL만 조정
    const useDefaultProfile =
      localStorage.getItem("useDefaultProfileImage") === "true";

    if (useDefaultProfile) {
      refreshedUser.profileImageUrl = null;
    } else if (refreshedUser.profileImageUrl) {
      refreshedUser.profileImageUrl =
        refreshedUser.profileImageUrl.replace(/([^:]\/)\/+/g, "$1") +
        `?t=${Date.now()}`;
    }

    setUserData({
      ...refreshedUser,
      _updateKey: Date.now(),
    });

    setLanguages({
      nativeCodes: refreshedUser.nativeLanguages || [],
      learnCodes: refreshedUser.learnLanguages || [],
    });

    await fetchMyKeywords();

    setIsEditMode(false);
  } catch (error) {
    console.error("프로필 수정 실패:", error);
    alert(t("mypage.alert.profileUpdateError"));
  }
};

  

  // 프로필 이미지 업로드
  const handleProfileImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      await axiosInstance.post("/api/users/me/profile-image", formData
      );

      localStorage.setItem("useDefaultProfileImage", "false");
  
      const refreshed = await axiosInstance.get("/api/users/me");
      const refreshedUser = refreshed.data;
  
      if (refreshedUser.profileImageUrl) {
        refreshedUser.profileImageUrl =
          refreshedUser.profileImageUrl.replace(/([^:]\/)\/+/g, "$1") +
          `?t=${Date.now()}`;
      }
  
      setUserData((prev: any) => ({
  ...prev,
  profileImageUrl: refreshedUser.profileImageUrl, // 또는 캐시버스터 붙인 값
  _updateKey: Date.now(),
}));
  
      alert("프로필 이미지가 성공적으로 업로드되었습니다!");
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      alert(t("mypage.alert.imageUploadError"));
    }
  };

  //이미지 리셋 헨들러(업로드한 이미지 -> 기본 국적 이미지로 변경)
const handleProfileImageReset = async () => {
  if (!userData) return;

  const ok = window.confirm(
    t("mypage.confirm.resetProfileImage")
  );
  if (!ok) return;

  try {
    await axiosInstance.delete("/api/users/me/profile-image");

    localStorage.setItem("useDefaultProfileImage", "true");

    setUserData((prev: any) => ({
  ...prev,
  profileImageUrl: null,
  _updateKey: Date.now(),
}));

    alert(t("mypage.alert.imageResetSuccess"));
  } catch (error) {
    console.error("프로필 이미지 삭제(리셋) 실패:", error);
    alert(t("mypage.alert.imageResetError"));
  }
};


  const handlePostClick = (postId: number) => {
    navigate(`/study/${postId}`);
  };

  const handleCommentEdit = async (
    commentId: number,
    postId: number,
    content: string
  ) => {
    if (!content.trim()) {
      alert(t("mypage.alert.commentEmpty"));
      return;
    }

    try {
      await updateComment(postId, commentId, { content });
      // 상태도 같이 업데이트 (리렌더용)
      setMyComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content } : c
        )
      );
      alert(t("mypage.alert.commentEditSuccess"));
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert(t("mypage.alert.commentEditError"));
    }
  };

  const handleCommentDelete = async (commentId: number, postId: number) => {
    if (!window.confirm(t("mypage.confirm.deleteComment"))) return;

    try {
      await deleteComment(postId, commentId);
      setMyComments((prev) => prev.filter((c) => c.id !== commentId));
      alert(t("mypage.alert.commentDeleteSuccess"));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert(t("mypage.alert.commentDeleteError"));
    }
  };

  //탈퇴
  const handleWithdraw = async () => {
  const ok = window.confirm(
    t("mypage.confirm.withdraw")
  );
  if (!ok) return;

  try {
    await axiosInstance.delete("/api/users/me");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); 
    localStorage.removeItem("userId");

    alert(t("mypage.alert.withdrawSuccess"));

    navigate("/signup/step1");
  } catch (error) {
    console.error("회원탈퇴 실패:", error);
    alert(t("mypage.alert.withdrawError"));
  }
};

//내가 작성한 글과 신청한 스터디 게시글 id를 비교하여 내 글에 내가 신청한 케이스를 제외시킨다.
const myPostIdSet = new Set(myPosts.map((post) => post.id));

const filteredAppliedStudies = myAppliedStudies.filter(
  (study) => !myPostIdSet.has(study.studyId)
);


  return (
    <Container>
      <ContentWrapper>
        <PageTitle className="H1">{t("mypage.title")}</PageTitle>

        {!isLoading && userData && (
        (() => {
         const profileSrc = getProfileSrc(
            userData.profileImageUrl,
            userData.country
          );
          console.log("[Mypage] userData.country =", userData.country);
          console.log("[Mypage] profileSrc =", profileSrc);

        
          return (
            <ProfileCard
              userId={userData.id}
              username={userData.username}
              name={userData.name}
              nickname={userData.nickname}
              mbti={userData.mbti}
              country={userData.country}
              profileImageUrl={profileSrc}
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
              onImageReset={handleProfileImageReset} 
            />
          );
        })()
      )}


        <ActivityTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          posts={myPosts}
          comments={myComments}
          appliedStudies={filteredAppliedStudies}
          onPostClick={handlePostClick}  
          onAppliedStudyClick={handleAppliedStudyClick}           
          onCommentEdit={handleCommentEdit}          
          onCommentDelete={handleCommentDelete}
        />

        <WithdrawButtonRow>
            <WithdrawButton onClick={handleWithdraw} className="Button1">
              {t("mypage.withdrawButton")}
            </WithdrawButton>
        </WithdrawButtonRow>
      </ContentWrapper>
    </Container>
  );
};

export default Mypage;
