import pool from '../config/db.js';
const history = async (req, res) => {
    const userId = req.user.id;
    const month = req.query.month || new Date().getMonth() + 1;
    if(!userId || !month) {
        return res.status(400).json({message: 'User ID and month are required'});
    }
    try{
        const query = 'SELECT * FROM get_transaction_history($1, $2)';
        const values = [userId, month];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(200).json({message: 'No history found for this month'});
        }
        return res.status(200).json(result.rows);
        
    }
    catch (error) {
        console.error('Error fetching history:', error);
        return res.status(500).json({message: 'Server error'});
    }
}

export default history;