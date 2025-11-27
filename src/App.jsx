import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './User/pages/HomePage'
import SignInPage from './User/pages/StudentSignin'
import StudentSignUpPage from './User/pages/SignupStudent'
import OTPVerificationPage from './User/pages/OtpPageStudent'
import StudentHomePage from './User/pages/StudentHomePage'
import EventCalendarPage from './User/pages/EventNews'
import ClassSchedulePage from './User/pages/ClassSchedulePage'
import EmergencyAssistPage from './User/pages/EmergencyAssistPage'

function App() {

  return (
    <>
    {/* Home Page */}
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path="/student-signup" element={<StudentSignUpPage/>}/>
      <Route path="/student-signin" element={<SignInPage/>}/>
      <Route path='/otp-verification' element={<OTPVerificationPage/>}/>
      <Route path='/student-home-page' element={<StudentHomePage/>}/>
      <Route path='/event-news' element={<EventCalendarPage/>}/>
      <Route path='/class-schedule' element={<ClassSchedulePage/>}/>
      <Route path='/emergency-assist' element={<EmergencyAssistPage/>}/>
    </Routes>
      
    </>
  )
}

export default App
