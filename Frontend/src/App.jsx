import { useState } from 'react'
import './App.css'
import SignUp from './components/auth/signUp'
import SignIn from './components/auth/signIn'
import LandingPage from './components/auth/LandingPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />

      </Routes>
      </Router>
    </>
  )
}

export default App
