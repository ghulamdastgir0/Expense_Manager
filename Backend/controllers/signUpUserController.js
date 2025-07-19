import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();
const saltingRounds = 10;

const signUpUser = async (req, res) => {
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

export default signUpUser;
