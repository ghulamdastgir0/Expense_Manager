import { useState } from "react"
import google from "../../assets/google.svg"
import facebook from "../../assets/facebook.svg"
import eye from "../../assets/eye.svg"
import RightScreen from "./rightScreen"
import InputField from "./inputField"
import { useNavigate } from "react-router-dom"
import { authAPI, setToken, setRefreshToken } from "../../api/api"

function SignIn() {
  const [email, setEmail]             = useState("")
  const [password, setPassword]       = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]             = useState("")      // API / validation error message
  const [isLoading, setIsLoading]     = useState(false)   // disables button while fetching

  const navigate = useNavigate()

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)

  // ── Form submit → call /api/auth/signin ──────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Client-side basic validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.")
      return
    }

    setIsLoading(true)
    try {
      const res = await authAPI.signin({ email: email.trim(), password })

      // Save tokens & user in localStorage so api.js can attach them to future requests
      setToken(res.data.accessToken)
      setRefreshToken(res.data.refreshToken)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // Navigate to dashboard
      navigate("/dashboard")
    } catch (err) {
      // err.message comes from apiFetch — maps to data.message from backend
      setError(err.message || "Sign in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-[#2D5A4A] min-h-screen h-screen w-full flex items-center justify-center p-4 fixed inset-0">
      <div className="flex w-full max-w-6xl h-[90vh] bg-black rounded-3xl shadow-2xl overflow-hidden items-center justify-center">

        {/* ── Left: Login Form ── */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 p-12 bg-black text-white">
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 mb-2">Expense Manager</h2>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">
              If you are already a member, easily log in to your account.
            </p>
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

            {/* ── Error message from API ── */}
            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-700 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4ADE80] text-black font-semibold py-3 rounded-lg
                         hover:bg-[#3BC470] transition-colors duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  {/* Simple spinner */}
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing In…
                </>
              ) : (
                "Sign In"
              )}
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

        {/* ── Right: Feature Panel ── */}
        <RightScreen />
      </div>
    </section>
  )
}

export default SignIn