import { useState } from "react"
import google from "../../assets/google.svg"
import facebook from "../../assets/facebook.svg"
import eye from "../../assets/eye.svg"
import RightScreen from "./rightScreen"
import InputField from "./inputField"
import {useNavigate} from "react-router-dom";

function signIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const navigate= useNavigate();
    const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };


  return (
    <section className="bg-[#2D5A4A] min-h-screen h-screen w-full flex items-center justify-center p-4 fixed inset-0">
      <div className="flex w-full max-w-6xl h-[90vh] bg-black rounded-3xl shadow-2xl overflow-hidden items-center justify-center">
        {/* Login Form Section */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 p-12 bg-black text-white">
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 mb-2">Expense Manager</h2>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">If you are already a member, easily log in to your account.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              label="Email"
              type="email"
              id="email"
              placeholder="Johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputField
              label="Password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              showPasswordToggle={true}
              showPassword={showPassword}
              onTogglePassword={togglePasswordVisibility}
              eyeIcon={eye}
            />

            <button
              type="submit"
              className="w-full bg-[#4ADE80] text-black font-semibold py-3 rounded-lg hover:bg-[#3BC470] transition-colors duration-200"
            >
              Sign In
            </button>
          </form>

          {/* Social Login */}
          <div className="flex justify-center space-x-4 mt-8">
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <img src={google || "/placeholder.svg"} alt="Google" className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <img src={facebook || "/placeholder.svg"} alt="Facebook" className="w-8 h-8" />
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Don't have an account?{" "}
            <a href="/signup" className="text-[#4ADE80] hover:underline">
              Sign Up
            </a>
          </p>
        </div>

        {/* Right Side Panel */}
        <RightScreen />
      </div>
    </section>
  )
}

export default signIn
