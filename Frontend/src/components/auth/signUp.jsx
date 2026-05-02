import google from "../../assets/google.svg"
import facebook from "../../assets/facebook.svg"
import eye from "../../assets/eye.svg"
import RightScreen from "./rightScreen"
import InputField from "./inputField"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SignUp() {
  const API = "http://localhost:5000/api"

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev)
  }

  // ===== SIGNUP API =====
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password, // backend will bcrypt this
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Signup failed")
      }

      // optional: store JWT if backend returns it
      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      alert("Account created successfully")
      navigate("/signin")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2D5A4A] p-4">
      <div className="flex w-full max-w-6xl h-[90vh] bg-black rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 p-12 bg-black text-white">

          <div className="mb-8">
            <h2 className="text-sm text-gray-400">Expense Manager</h2>
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-gray-400 text-sm">
              Start managing expenses smarter
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-400 mb-4 text-sm">{error}</p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <InputField
                label="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputField
              label="Password"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              eyeIcon={eye}
              showPasswordToggle
              showPassword={isPasswordVisible}
              onTogglePassword={togglePasswordVisibility}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4ADE80] text-black font-semibold py-3 rounded-lg hover:bg-[#3BC470] transition"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* SOCIAL */}
          <div className="flex justify-center space-x-4 mt-8">
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <img src={google} alt="Google" className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <img src={facebook} alt="Facebook" className="w-8 h-8" />
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Already have an account?{" "}
            <a href="/signin" className="text-[#4ADE80]">
              Sign In
            </a>
          </p>
        </div>

        {/* RIGHT */}
        <RightScreen />
      </div>
    </div>
  )
}

export default SignUp