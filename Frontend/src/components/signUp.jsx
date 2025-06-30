import google from "../assets/google.svg"
import faceebook from "../assets/facebook.svg"
import eye from "../assets/eye.svg"
import { useState } from "react"

function SignUp() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2D5A4A] p-4">
      <div className="flex w-full max-w-6xl h-[87vh] bg-black rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Panel - Sign Up Form */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 p-12 bg-black text-white">
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 mb-2">Expense Manager</h2>
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-gray-400 text-sm">Start managing your expenses smarter with your new account.</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fname" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="fname"
                  placeholder="John"
                  className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="lname" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lname"
                  placeholder="Doe"
                  className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Johndoe@gmail.com"
                className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>

              {/* Wrapper for input + icon */}
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
                {/* Eye icon inside input */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <button onClick={togglePasswordVisibility} type="button" className="focus:outline-none">
                    <img src={eye || "/placeholder.svg"} alt="Eye Icon" className="w-6 h-6 cursor-pointer" />
                  </button>
                </div>
              </div>
            </div>

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
              <img src={faceebook || "/placeholder.svg"} alt="Facebook" className="w-8 h-8" />
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Already have an account?{" "}
            <a href="/login" className="text-[#4ADE80] hover:underline">
              Sign In
            </a>
          </p>
        </div>

        {/* Right Panel - Expense Management Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4ADE80] to-[#22C55E] p-12 flex-col justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-96 h-96 border border-white/20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/20 rounded-full"></div>
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-white text-4xl font-bold mb-8 leading-tight">
              Take Control of
              <br />
              Your Finances
            </h2>

            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Smart Analytics</h3>
                  <p className="text-white/80 text-sm">Track spending patterns and insights</p>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Budget Goals</h3>
                  <p className="text-white/80 text-sm">Set and achieve your financial targets</p>
                </div>
              </div>

              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zm6 10V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Receipt Scanner</h3>
                  <p className="text-white/80 text-sm">Automatically capture and categorize</p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl p-6 relative">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-black font-semibold text-lg mb-2">
                Save 30% More
                <br />
                with Smart Tracking
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Users save an average of $500
                <br />
                per month by tracking their
                <br />
                expenses with our app.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4ADE80]">$2.5K</div>
                  <div className="text-xs text-gray-500">Avg. Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4ADE80]">85%</div>
                  <div className="text-xs text-gray-500">Goal Success</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4ADE80]">12K+</div>
                  <div className="text-xs text-gray-500">Happy Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
