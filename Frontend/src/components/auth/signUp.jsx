import eye from "../../assets/eye.svg"
import RightScreen from "./rightScreen"
import InputField from "./inputField"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI, setToken, setRefreshToken } from "../../api/api"

function SignUp() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [firstName, setFirstName]                 = useState("")
  const [lastName, setLastName]                   = useState("")
  const [email, setEmail]                         = useState("")
  const [password, setPassword]                   = useState("")
  const [loading, setLoading]                     = useState(false)
  const [error, setError]                         = useState("")

  const navigate = useNavigate()

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.")
      setLoading(false)
      return
    }

    try {
      const res = await authAPI.signup({
        first_name: firstName.trim(),
        last_name:  lastName.trim(),
        email:      email.trim(),
        password,
      })

      if (res.accessToken) { setToken(res.accessToken); setRefreshToken(res.refreshToken) }
      if (res.token)       { setToken(res.token) }
      if (res.user)        { localStorage.setItem("user", JSON.stringify(res.user)) }

      navigate("/signin")
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    // ✅ min-h-screen + overflow-y-auto so small screens can scroll instead of clipping
    <section className="bg-[#2D5A4A] min-h-screen w-full flex items-center justify-center p-4 overflow-y-auto">
      <div className="flex w-full max-w-5xl bg-black rounded-3xl shadow-2xl overflow-hidden my-auto">

        {/* LEFT */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 py-10 md:px-12 bg-black text-white">

          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 mb-2">Expense Manager</h2>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-400 text-sm">Start managing expenses smarter</p>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-700 rounded-lg px-4 py-2 mb-4">
              {error}
            </p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
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
              placeholder="Johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputField
              label="Password"
              placeholder="••••••••"
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
              className="w-full bg-[#4ADE80] text-black font-semibold py-3 rounded-lg
                         hover:bg-[#3BC470] transition-colors duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating Account…
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-8">
            Already have an account?{" "}
            <a href="/signin" className="text-[#4ADE80] hover:underline">
              Sign In
            </a>
          </p>
        </div>

        {/* RIGHT — hidden on small screens */}
        <div className="hidden lg:block lg:w-1/2">
          <RightScreen />
        </div>
      </div>
    </section>
  )
}

export default SignUp