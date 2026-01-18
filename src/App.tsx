import { Routes, Route, useLocation } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";

// 페이지 import
import Main from "./pages/Main";
import Login from "./pages/Login";
import Mypage from "./pages/Mypage";
import Message from "./pages/Message";
import RandomMatch from "./pages/RandomMatch";

// 회원가입 단계
import SignUp1 from "./pages/signup/SignUp1";
import SignUp2 from "./pages/signup/SignUp2";
import SignUp3 from "./pages/signup/SignUp3";
import SignUp4 from "./pages/signup/SignUp4";

// 스터디 관련
import StudyList from "./pages/study/StudyList";
import StudyDetail from "./pages/study/StudyDetail";
import StudyPost from "./pages/study/StudyPost";

// 프로필 관련
import ProfileList from "./pages/profile/ProfileList";
import ProfileDetail from "./pages/profile/ProfileDetail";
import ProfileLanding from "./pages/profile/ProfileLanding";

// 컴포넌트
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Context
import { SignupProvider } from "./contexts/SignupContext";

function App() {
  const location = useLocation();

  return (
    <>
      <GlobalStyle />

      <SignupProvider> 
        {location.pathname !== "/login" && location.pathname !== "/" && <Header />}

        <Routes>
          {/* 공개 페이지 (로그인 불필요) */}
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          
          {/* 회원가입 페이지 (로그인 불필요) */}
          <Route path="/signup/step1" element={<SignUp1 />} />
          <Route path="/signup/step2" element={<SignUp2 />} />
          <Route path="/signup/step3" element={<SignUp3 />} />
          <Route path="/signup/step4" element={<SignUp4 />} />

          {/* 보호된 페이지 (로그인 필요) - ProtectedRoute로 감싸기 */}
          <Route 
            path="/mypage" 
            element={
              <ProtectedRoute>
                <Mypage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/message" 
            element={
              <ProtectedRoute>
                <Message />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/random-match" 
            element={
              <ProtectedRoute>
                <RandomMatch />
              </ProtectedRoute>
            } 
          />

          {/* 스터디 관련 페이지 (로그인 필요) */}
          <Route 
            path="/study" 
            element={
              <ProtectedRoute>
                <StudyList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/study/:id" 
            element={
              <ProtectedRoute>
                <StudyDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/study/post" 
            element={
              <ProtectedRoute>
                <StudyPost />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/study/post/:id" 
            element={
              <ProtectedRoute>
                <StudyPost />
              </ProtectedRoute>
            } 
          />

          {/* 프로필 관련 페이지 (로그인 필요) */}
          <Route 
            path="/profile/landing" 
            element={
              <ProtectedRoute>
                <ProfileLanding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              <ProtectedRoute>
                <ProfileDetail />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </SignupProvider>
    </>
  );
}

export default App;
