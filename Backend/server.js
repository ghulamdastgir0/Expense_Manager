import express from 'express';
import loginUserRoute from './routes/signInUserRoute.js';
import signUpUserRoute from './routes/signUpUserRoute.js';

const app = express();
const port= 3000;
app.use(express.json());

app.use('/', loginUserRoute);
app.use('/', signUpUserRoute);

app.get('/', (req, res) => {
    res.send('Welcome to the Expense Manager API');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});