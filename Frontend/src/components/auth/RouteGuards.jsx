import { Navigate } from "react-router-dom"
import { isTokenValid } from "../../utils/auth"

export const PublicRoute = ({ children }) => {
  const valid = isTokenValid()
  console.log("PublicRoute valid:", valid)   // ← check this after login
  return valid ? <Navigate to="/dashboard" replace /> : children
}

export const ProtectedRoute = ({ children }) => {
  const valid = isTokenValid()
  console.log("ProtectedRoute valid:", valid)
  return valid ? children : <Navigate to="/signin" replace />
}