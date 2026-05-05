import './App.css'
import SignUp from './components/auth/signUp'
import SignIn from './components/auth/signIn'
import LandingPage from './components/auth/LandingPage'
import Dashboard from './components/Dashboard/Dashboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PublicRoute, ProtectedRoute } from './components/auth/RouteGuards'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={
            <PublicRoute><LandingPage /></PublicRoute>
          } />
          <Route path='/signup' element={
            <PublicRoute><SignUp /></PublicRoute>
          } />
          <Route path='/signin' element={
            <PublicRoute><SignIn /></PublicRoute>
          } />
          <Route path='/dashboard' element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
        </Routes>
      </Router>
    </>
  )
}

export default App