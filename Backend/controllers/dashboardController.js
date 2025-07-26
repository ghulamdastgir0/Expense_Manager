import pool from '../config/db.js';
const getDashboard = async (req, res) => {
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
}

export default getDashboard;