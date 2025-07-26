// Simplified Account Controller using PostgreSQL Procedures
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

// 1. GET user account details
export const getAccountDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query("SELECT * FROM get_account_details($1)", [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching account details" });
  }
};

// 2. GET user balance
export const getBalanceDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query("SELECT * FROM get_balance_details($1)", [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching balance" });
  }
};

// 3. PATCH user profile
export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { first_name, last_name, email, image_url } = req.body;
  try {
    await db.query("CALL update_user_profile($1, $2, $3, $4, $5)", [
      userId,
      first_name,
      last_name,
      email,
      image_url,
    ]);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating profile" });
  }
};

// 4. PATCH account settings
export const updateAccountSettings = async (req, res) => {
  const { userId } = req.params;
  const { currency_id, time_zone_id, budget_limit } = req.body;
  try {
    await db.query("CALL update_account_settings($1, $2, $3, $4)", [
      userId,
      currency_id,
      time_zone_id,
      budget_limit,
    ]);
    res.json({ message: "Account settings updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating account settings" });
  }
};

// 5. DELETE user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query("CALL delete_user($1)", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

// 6. GET preferences
export const getPreferences = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query("SELECT * FROM get_preferences($1)", [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching preferences" });
  }
};

// 7. PATCH password
export const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;
  try {
    const result = await db.query("SELECT password FROM users WHERE user_id = $1", [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const storedHash = result.rows[0].password;
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) return res.status(401).json({ error: "Current password is incorrect" });

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query("CALL update_password($1, $2)", [userId, newHash]);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// 8. DELETE all data except user
export const deleteAllUserData = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query("CALL delete_all_user_data($1)", [userId]);
    res.json({ message: "All user data deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user data" });
  }
};

// 9. GET dashboard stats
export const getDashboard = async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try{
        const query = 'SELECT * FROM get_dashboard($1)';
        const values = [userId];
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(200).json({ message: 'No dashboard data found' });
        }
        
        return res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// 10. login user
export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try{
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await pool.query(query, values);
        const user = result.rows[0];

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const token = jwt.sign({id: user.user_id, email: user.email}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        });
        return res.status(200).json({token, user: {id: user.user_id, email: user.email}});
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({message: 'Server error'});
    }
    
}

// 11. sign up user
export const signUpUser = async (req, res) => {
    const saltingRounds = 10;
    const { f_name, l_name, email, password } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, saltingRounds);

        await client.query(
            'CALL create_user($1, $2, $3, $4, $5)',
            [f_name, l_name, email, hashedPassword, null]
        );

        const userIdResult = await client.query('SELECT user_id FROM users WHERE email = $1', [email]);
        if (userIdResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "User not found" });
        }

        const token = jwt.sign(
            { id: userIdResult.rows[0].user_id, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        await client.query('COMMIT');

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: { f_name, l_name, email },
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Signup error:', error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        client.release();
    }
};
