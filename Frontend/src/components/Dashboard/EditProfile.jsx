"use client"
import { useEffect, useState } from "react"
import { Save, X, Upload } from "lucide-react"
import Box from "./Box"
import InputField from "../auth/inputField"
import { userAPI } from "../../api/api"

function EditProfile({ onNavigate }) {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  // ✅ FIX: No hardcoded default image — null means show empty circle
  const [previewImage, setPreviewImage] = useState(null)

  // ✅ LOAD USER DATA
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await userAPI.getProfile()
        const user = res.data.user

        setFormData({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          // ✅ FIX: phone does not exist in DB — removed
          image_url: user.image_url || null,
        })

        // ✅ FIX: Only set preview if image_url exists in DB, otherwise null (empty circle)
        setPreviewImage(user.image_url || null)
      } catch (err) {
        console.error(err)
      }
    }

    loadUser()
  }, [])

  // ✅ HANDLE INPUT
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // ✅ IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target.result)
      setFormData((prev) => ({
        ...prev,
        image_url: e.target.result,
      }))
    }
    reader.readAsDataURL(file)
  }

  // ✅ VALIDATION
  const validate = () => {
    const newErrors = {}

    if (!formData.first_name?.trim()) {
      newErrors.first_name = "First name required"
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Last name required"
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)

    try {
      const res = await userAPI.updateProfile(formData)

      // ✅ FIX: Write updated user back to localStorage so NavBar
      // picks up the new name and image immediately on re-render
      const updatedUser = res.data?.user
      if (updatedUser) {
        const existing = JSON.parse(localStorage.getItem("user") || "{}")
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...existing,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            image_url: updatedUser.image_url || null,
          })
        )
      }

      alert("Profile updated successfully")
      onNavigate("Profile")
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-black text-white space-y-8">
      <h1 className="text-3xl font-bold">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* IMAGE */}
        <Box title="Profile Picture">
          {/* ✅ FIX: Show image if uploaded/exists, otherwise show empty circle */}
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile preview"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600" />
          )}

          <label className="cursor-pointer bg-green-500 px-4 py-2 rounded-lg text-black">
            <Upload className="w-4 h-4 inline" /> Upload
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </label>
        </Box>

        {/* INPUTS */}
        <Box title="Info">

          <div>
            <InputField
              label="First Name"
              value={formData.first_name || ""}
              onChange={(e) =>
                handleInputChange("first_name", e.target.value)
              }
            />
            {errors.first_name && (
              <p className="text-red-400 text-sm">{errors.first_name}</p>
            )}
          </div>

          <div>
            <InputField
              label="Last Name"
              value={formData.last_name || ""}
              onChange={(e) =>
                handleInputChange("last_name", e.target.value)
              }
            />
            {errors.last_name && (
              <p className="text-red-400 text-sm">{errors.last_name}</p>
            )}
          </div>

          <div>
            <InputField
              label="Email"
              value={formData.email || ""}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              }
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email}</p>
            )}
          </div>

        </Box>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-500 text-black px-6 py-2 rounded-lg"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 inline" />
            {isLoading ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={() => onNavigate("Profile")}
            className="bg-gray-600 px-6 py-2 rounded-lg"
          >
            <X className="w-4 h-4 inline" /> Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile