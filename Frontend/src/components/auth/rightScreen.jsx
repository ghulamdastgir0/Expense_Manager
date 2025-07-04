function RightScreen() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4ADE80] to-[#22C55E] p-12 flex-col justify-center relative overflow-hidden h-full">
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
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Smart Analytics
              </h3>
              <p className="text-white/80 text-sm">
                Track spending patterns and insights
              </p>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              <p className="text-white/80 text-sm">
                Set and achieve your financial targets
              </p>
            </div>
          </div>

          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zm6 10V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Receipt Scanner
              </h3>
              <p className="text-white/80 text-sm">
                Automatically capture and categorize
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl p-6 relative">
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
  );
}
export default RightScreen;
