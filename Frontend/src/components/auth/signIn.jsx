import bcrypt from "bcryptjs"
import pool from "../Config/db.js"

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" })
    }

    const user = users[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = localStorage.getItem("token")
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}