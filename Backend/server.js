import express from 'express';
import pool from './config/db.js';
const app = express();
const port= 3000;
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello Server!');
});
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('select * from users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});