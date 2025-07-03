import google from "../../assets/google.svg"
import facebook from "../../assets/facebook.svg"
import eye from "../../assets/eye.svg"
import RightScreen from "./rightScreen"
import InputField from "./inputField"
import { useState } from "react"

function SignUp() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2D5A4A] p-4">
      <div className="flex w-full max-w-6xl h-[90vh] bg-black rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Panel - Sign Up Form */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 p-12 bg-black text-white">
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 mb-2">Expense Manager</h2>
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-gray-400 text-sm">Start managing your expenses smarter with your new account.</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Name"
                type="text"
                id="fname"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <InputField
                label="Last Name"
                type="text"
                id="lname"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

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
              showPassword={isPasswordVisible}
              onTogglePassword={togglePasswordVisibility}
              eyeIcon={eye}
            />

            <button
              type="submit"
              className="w-full bg-[#4ADE80] text-black font-semibold py-3 rounded-lg hover:bg-[#3BC470] transition-colors duration-200"
            >
              Sign Up
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
            Already have an account?{" "}
            <a href="/signin" className="text-[#4ADE80] hover:underline">
              Sign In
            </a>
          </p>
        </div>

        {/* Right Panel - Expense Management Features */}
        <RightScreen />
      </div>
    </div>
  )
}

export default SignUp
