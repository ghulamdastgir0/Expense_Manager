"use client"
import { LayoutGrid, Banknote, Users, BarChart3, Settings, HistoryIcon, MenuIcon, XIcon } from "lucide-react"
import { useState, useEffect } from "react"

function NavBar({ currentPage, onNavigate }) {
  const [activeItem, setActiveItem] = useState(currentPage || "Dashboard")
  const [isOpen, setIsOpen] = useState(false)

  // ✅ FIX: avatar is null by default — empty circle shown when no image
  const [userProfile, setUserProfile] = useState({
    name: "User",
    email: "",
    avatar: null,
    isOnline: true,
  })

  // ✅ FIX: Re-read localStorage on every currentPage change (not just on mount).
  // When EditProfile saves and calls onNavigate("Profile"), currentPage changes,
  // this effect re-runs, and NavBar immediately shows the updated name + image.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        const user = JSON.parse(stored)
        setUserProfile({
          name:
            user.name ||
            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
            "User",
          email: user.email || "",
          avatar: user.image_url || null,
          isOnline: true,
        })
      }
    } catch {
      // use defaults
    }
  }, [currentPage])

  useEffect(() => {
    if (currentPage) {
      setActiveItem(currentPage === "AddTransaction" ? "Transactions" : currentPage)
    }
  }, [currentPage])

  const handleItemClick = (item) => {
    setActiveItem(item)
    if (onNavigate) onNavigate(item)
    if (window.innerWidth < 1024) setIsOpen(false)
  }

  const toggleMenu = () => setIsOpen((prev) => !prev)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !event.target.closest(".navbar-container") &&
        !event.target.closest(".menu-toggle")
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  const NavLinks = [
    { name: "Dashboard", icon: LayoutGrid },
    { name: "Transactions", icon: Banknote },
    { name: "Reports", icon: BarChart3 },
    { name: "History", icon: HistoryIcon },
    { name: "Profile", icon: Users },
    { name: "Settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMenu}
        className={`menu-toggle lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#2D5A4A] text-white shadow-lg transition-all duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Toggle menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`navbar-container fixed top-0 left-0 bg-[#2D5A4A] flex flex-col h-screen z-50 shadow-xl transition-all duration-300 ease-in-out ${
          isOpen
            ? "w-80 sm:w-72 translate-x-0"
            : "w-80 sm:w-72 -translate-x-full lg:translate-x-0 lg:w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#3D6A5A] flex-shrink-0">
          <div className="text-white text-xl font-bold tracking-wide">ExpenseTracker</div>
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-[#3D6A5A] transition-colors duration-200"
            aria-label="Close menu"
          >
            <XIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {NavLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(link.name)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 w-full text-left ${
                  activeItem === link.name
                    ? "bg-[#4ADE80] text-black shadow-lg"
                    : "text-white hover:bg-[#3D6A5A] hover:text-white"
                }`}
              >
                <link.icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    activeItem === link.name ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                <span className="font-medium">{link.name}</span>
                {activeItem === link.name && (
                  <div className="ml-auto w-2 h-2 bg-black rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-[#3D6A5A] flex-shrink-0">
          <div className="flex items-center gap-3 py-2">
            <div className="relative flex-shrink-0">
              {/* ✅ FIX: Show image only if avatar exists, otherwise empty circle */}
              {userProfile.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={`${userProfile.name}'s profile`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-600 border-2 border-gray-500" />
              )}
              {userProfile.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#2D5A4A] rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm truncate">{userProfile.name}</div>
              <div className="text-gray-300 text-xs truncate">{userProfile.email}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NavBar