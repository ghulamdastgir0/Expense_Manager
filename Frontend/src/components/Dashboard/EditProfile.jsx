"use client"
import { useState } from "react"
import { Save, X, Camera, Upload } from "lucide-react"
import Box from "./Box"
import InputField from "../auth/inputField"
import profileimage from "../../assets/pic1.png" // Importing the user profile image

function EditProfile({ onNavigate }) {
  // Initial profile data - this would typically come from your auth/database system
  const initialProfile = {
    name: "Chris Flores",
    email: "lucia.rodriguez@example.com",
    phone: "+1 (555) 123-4567",
    avatar: profileimage,
    bio: "Financial enthusiast focused on smart budgeting and investment strategies. Love tracking expenses and optimizing savings.",
  }

  const [formData, setFormData] = useState(initialProfile)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(initialProfile.avatar)

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Please select a valid image file",
        }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Image size should be less than 5MB",
        }))
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target.result)
        setFormData((prev) => ({
          ...prev,
          avatar: e.target.result,
        }))
      }
      reader.readAsDataURL(file)

      // Clear any previous errors
      setErrors((prev) => ({
        ...prev,
        avatar: "",
      }))
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-$$$$]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Profile updated:", formData)
      alert("Profile updated successfully!")

      // Navigate back to profile page
      onNavigate("Profile")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    onNavigate("Profile")
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-black text-white space-y-8">
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
          <p className="text-gray-300 text-sm">Update your personal information and preferences</p>
        </div>
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ===== PROFILE PICTURE SECTION ===== */}
        <Box title="Profile Picture" subtitle="Upload a new profile picture" className="shadow-lg">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Current/Preview Image */}
            <div className="relative">
              <img
                src={previewImage || "/placeholder.svg?height=120&width=120"}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=120&width=120"
                }}
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-4">
              <div>
                <label
                  htmlFor="avatar-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4ADE80] text-black rounded-lg hover:bg-[#3BC470] transition-colors duration-200 font-medium cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Choose New Picture
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-400">
                Recommended: Square image, at least 200x200px. Max file size: 1MB.
              </p>
              {errors.avatar && <p className="text-red-400 text-sm">{errors.avatar}</p>}
            </div>
          </div>
        </Box>

        {/* ===== PERSONAL INFORMATION SECTION ===== */}
        <Box title="Personal Information" subtitle="Update your basic information" className="shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <InputField
                label="Full Name"
                type="text"
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <InputField
                label="Email Address"
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <InputField
                label="Phone Number"
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
            </div>

          </div>
        </Box>

        {/* ===== BIO SECTION ===== */}
        <Box title="About You" subtitle="Tell others about yourself" className="shadow-lg">
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              placeholder="Write a short bio about yourself..."
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">{formData.bio.length}/500 characters</span>
              {errors.bio && <p className="text-red-400 text-sm">{errors.bio}</p>}
            </div>
          </div>
        </Box>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-[#4ADE80] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#3BC470] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center justify-center gap-2 bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile
