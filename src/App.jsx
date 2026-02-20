import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './User/pages/HomePage';
import SignInPage from './User/pages/StudentSignin';
import StudentSignUpPage from './User/pages/SignupStudent';
import OTPVerificationPage from './User/pages/OtpPageStudent';
import StudentHomePage from './User/pages/StudentHomePage';
import EventCalendarPage from './User/pages/EventNews';
import ClassSchedulePage from './User/pages/ClassSchedulePage';
import EmergencyAssistPage from './User/pages/EmergencyAssistPage';
import CounselingForm from './User/pages/CounselingForm';
import CounselingStats from './User/pages/CounselingStats';
import SOSSystem from './User/pages/SOSSystem';
import StudyPods from './User/pages/StudyPods';
import StudyPodCreate from './User/pages/StudyPodCreate';
import StudyMaterials from './User/pages/StudyMaterials';
import AdminLogin from './Admin/AdminLogin';
import AdminCoreDashboard from './Admin/AdminCoreDashboard';
import FacultyDashboard from './Faculty/FacultyDashboard';
import FacultyRegister from './Faculty/FacultyRegister';
import FacultyOTPVerification from './Faculty/FacultyOTPVerification';
import FacultyWaitingApproval from './Faculty/FacultyWaitingApproval';
import CounselorLogin from './Counselors/CounselorLogin';
import CounselorHome from './Counselors/CounselorHome';
import FacultyLogin from './Faculty/FacultyLogin';
import StaffLogin from './Non-Teaching Staff/StaffLogin';
import StaffHomepage from './Non-Teaching Staff/StaffHomepage';
import ProtectedRoute from './components/common/ProtectedRoute';

import ToastProvider from './components/common/ToastProvider';
import Footer from './User/components/footer';
import ActiveStatusChecker from './components/ActiveStatusChecker';

function App() {
  return (
    <div className="App">
      <>
        <ToastProvider />
        <ActiveStatusChecker />
        {/*Home Page */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/*Student*/}
          <Route path="/student-signup" element={<StudentSignUpPage />} />
          <Route path="/student-signin" element={<SignInPage />} />
          <Route path="/otp-verification" element={<OTPVerificationPage />} />
          <Route path="/student-home-page" element={<StudentHomePage />} />
          <Route path="/event-news" element={<EventCalendarPage />} />
          <Route path="/class-schedule" element={<ClassSchedulePage />} />
          <Route path="/emergency-assist" element={<EmergencyAssistPage />} />
          <Route path="/counseling-form" element={<CounselingForm />} />
          <Route path="/counseling-stats" element={<CounselingStats />} />
          <Route path="/sos-system" element={<SOSSystem />} />

          <Route path="study-pod-list" element={<StudyPods />} />
          <Route path="/study-pod-create" element={<StudyPodCreate />} />
          <Route path="/study-materials" element={<StudyMaterials />} />

          {/*ADMIN*/}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-core-dashboard" element={<AdminCoreDashboard />} />

          {/*FACULTIES*/}
          <Route path="/faculty-register" element={<FacultyRegister />} />
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/faculty-otp-verification" element={<FacultyOTPVerification />} />
          <Route path="/faculty-waiting-approval" element={<FacultyWaitingApproval />} />
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />

          {/*Counselor*/}
          <Route path="/counselor-login" element={<CounselorLogin />} />
          <Route path="/counselor-home" element={<CounselorHome />} />

          {/*NON-TEACHING STAFFS*/}
          <Route path="/non-teaching-login" element={<StaffLogin />} />
          <Route
            path="/non-teaching-homepage"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffHomepage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </>
    </div>
  );
}

export default App;
