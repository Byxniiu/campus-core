import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './User/components/HomePage'
import StudentLogin from './User/components/LoginStudent'

function App() {

  return (
    <>
    {/* Home Page */}
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path="/login" element={<StudentLogin/>}/>
    </Routes>
      
    </>
  )
}

export default App
