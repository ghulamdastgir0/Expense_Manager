import express from 'express';
import userRoutes from './routes/userRouters.js';
import transactionRoutes from './routes/transactionRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Expense Manager API');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
