import { useState } from "react";

function Loginpage() {
  const [count, setCount] = useState(0);

  return (
    <section className="bg-[#2D5A4A] min-h-screen h-screen w-full flex items-center justify-center p-4 fixed inset-0">
      <div className="bg-black flex flex-col md:flex-row rounded-2xl shadow-lg max-w-5xl w-full p-5 items-center justify-center">
        {/* Login Form Section */}
        <div className="w-full md:w-3/5 px-4 md:px-16">
          <h2 className="font-bold text-2xl text-white">Login</h2>
          <p className="text-xs mt-4 text-[#ffffff]">If you are already a member, easily log in</p>

          <div className="flex flex-col gap-4 text-white">
            <input
              className="p-2 mt-8 rounded-xl border"
              type="email"
              name="email"
              placeholder="Email"
            />
            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full"
                type="password"
                name="password"
                placeholder="Password"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="gray"
                className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2"
                viewBox="0 0 16 16"
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
            </div>
            <button className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300">
              Login
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>

          <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#ffffff]">
            <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Login with Google
          </button>

          <button className="bg-[#1a1a1a] border py-2 w-full rounded-xl mt-3 flex justify-center items-center text-sm hover:scale-105 duration-300 text-white">
            <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="25px" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M22.675 0h-21.35C.595 0 0 .594 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495V14.709h-3.13v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.794.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.59l-.467 3.622h-3.123V24h6.116C23.405 24 24 23.406 24 22.674V1.326C24 .594 23.405 0 22.675 0z" />
            </svg>
            Login with Facebook
          </button>

          <div className="mt-5 text-xs border-b border-gray py-4 text-white">
            <a href="#" className="text-white hover:text-green-400">Forgot your password?</a>
          </div>

          <div className="mt-3 text-xs flex justify-between items-center text-[#ffffff]">
            <p>Don't have an account?</p>
            <button className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300 text-white">
              Register
            </button>
          </div>
        </div>

        {/* Right Side Panel */}
        <div className="hidden md:block w-2/5 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8">Take Control of<br />Your Finances</h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-[#4ADE80] bg-opacity-20 rounded-full p-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Smart Analytics</h3>
                  <p className="text-sm opacity-90">Track spending patterns and insights</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-[#4ADE80] bg-opacity-20 rounded-full p-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Budget Goals</h3>
                  <p className="text-sm opacity-90">Set and achieve your financial targets</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-[#4ADE80] bg-opacity-20 rounded-full p-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Receipt Scanner</h3>
                  <p className="text-sm opacity-90">Automatically capture and categorize</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 text-gray-800">
              <h4 className="font-semibold text-lg mb-2">Track & Improve<br />Your Spending Habits</h4>
              <p className="text-sm text-gray-600 mb-6">Get clear insights into your spending.<br />Make informed decisions and<br />reach your financial goals.</p>

              <div className="flex justify-between items-end">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">$1.2K</div>
                  <div className="text-xs text-gray-500">Avg. Monthly Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">72%</div>
                  <div className="text-xs text-gray-500">Users Reached Targets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">8K+</div>
                  <div className="text-xs text-gray-500">Active Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Loginpage;
