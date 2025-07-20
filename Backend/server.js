import express from 'express';
import pool from './config/db.js';

// Import user routes
import userRoutes from './routes/userRoutes.js';
// Import transaction routes
import transactionRoutes from './routes/transactionRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Expense Manager API!');
});

// Test users route
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API routes
app.use('/api/user', userRoutes); 
app.use('/api/transactions', transactionRoutes);

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
