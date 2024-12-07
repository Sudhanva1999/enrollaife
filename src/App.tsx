import './App.css'
import ChatInterface from './components/chatbot/chatbot';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FacultyProfilePage from './pages/FacultyProfilePage';
import CourseRegistrationPage from './pages/CourseRegistrationPage';
import AdminProfilePage from './pages/AdminProfilePage';
import LoginPage from './components/LoginSignup/Login.tsx';
import LayoutWithNavBar from './components/common/layoutWithNavbar.tsx';
import LayoutWithoutNavBar from './components/common/layoutWithoutNavbar.tsx';
import SignUpForm from './components/LoginSignup/Signup.tsx';
import UserProfilePage from './pages/UserProfilePage.tsx';
import ResetPassword from './components/LoginSignup/ResetPassword.tsx'

function App() {
  return (
      <Router>
        <Routes>
            <Route element={<LayoutWithNavBar/>}>
              <Route path="/user/profile" element={<UserProfilePage />} />
              <Route path="/faculty/:facultyId" element={<FacultyProfilePage />} />
              <Route path='/courses' element={<CourseRegistrationPage />} />
              <Route path="/admin" element={<AdminProfilePage />} />          
            </Route>
          <Route element={<LayoutWithoutNavBar/>}>
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/logout" element={<LoginPage />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="*" element={<LoginPage />} />
          </Route>
        </Routes>
      </Router>  
  )
}

export default App