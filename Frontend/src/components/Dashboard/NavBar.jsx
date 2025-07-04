import {
  LayoutGrid,
  Banknote,
  Users,
  BarChart3,
  Settings,
  LogOutIcon,
  HistoryIcon,
  MenuIcon,
  XIcon,
} from "lucide-react"
import { useState, useEffect } from "react"

function NavBar() {
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [isOpen, setIsOpen] = useState(false)

  const handleItemClick = (item) => {
    setActiveItem(item)
    // Close mobile menu when item is clicked
    if (window.innerWidth < 1024) {
      setIsOpen(false)
    }
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".navbar-container") && !event.target.closest(".menu-toggle")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const NavLinks = [
    { name: "Dashboard", icon: LayoutGrid, href: "/" },
    { name: "Transactions", icon: Banknote, href: "#" },
    { name: "Reports", icon: BarChart3, href: "#" },
    { name: "History", icon: HistoryIcon, href: "#" },
    { name: "Profile", icon: Users, href: "#" },
    { name: "Settings", icon: Settings, href: "#" },
  ]

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMenu}
        className={`menu-toggle lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#2D5A4A] text-white shadow-lg transition-all duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Toggle menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Backdrop Overlay for Mobile */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Navigation */}
      <div
        className={`navbar-container fixed lg:static top-0 left-0 bg-[#2D5A4A] flex flex-col h-screen z-50 shadow-xl transition-all duration-300 ease-in-out scrollbar-thin scrollbar-thumb-[#4ADE80] scrollbar-track-[#2D5A4A] ${
          isOpen ? "w-80 sm:w-72 translate-x-0" : "w-80 sm:w-72 -translate-x-full lg:translate-x-0 lg:w-64"
        }`}
      >
        {/* Header with Logo and Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-[#3D6A5A]">
          <div className="text-white text-xl font-bold tracking-wide">LOGO</div>
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-[#3D6A5A] transition-colors duration-200"
            aria-label="Close menu"
          >
            <XIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {NavLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={() => handleItemClick(link.name)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
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
                {activeItem === link.name && <div className="ml-auto w-2 h-2 bg-black rounded-full animate-pulse" />}
              </a>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#3D6A5A]">
          <a
            href="/"
            className="group flex items-center gap-3 px-4 py-3 text-white hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <LogOutIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="font-medium">Logout</span>
          </a>
        </div>
      </div>
    </>
  )
}

export default NavBar
