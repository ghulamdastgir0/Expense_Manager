import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const loginUser = async (req, res) => {
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
        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        });
        return res.status(200).json({token, user: {id: user.id, email: user.email}});
    } catch (error) {   
        console.error('Login error:', error);
        return res.status(500).json({message: 'Server error'});
    }
    
}

export default loginUser;