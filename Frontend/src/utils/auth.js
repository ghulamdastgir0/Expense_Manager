import { jwtDecode } from "jwt-decode"

export const isTokenValid = () => {
    const token = localStorage.getItem("token")
  console.log("Token:", token)        // ← check this in browser console
  if (!token) return false

  try {
    const decoded = jwtDecode(token)
    console.log("Decoded:", decoded)  // ← check if exp exists
    if (!decoded.exp) return true
    return decoded.exp > Date.now() / 1000
  } catch (e) {
    console.error("JWT error:", e)    // ← check if decode is failing
    return false
  }
}