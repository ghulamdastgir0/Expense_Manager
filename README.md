# 💸 Expense Tracker App

A full-stack personal finance management app built using **React (Vite)**, **Tailwind CSS**, **Node.js**, **Express**, and **PostgreSQL**. It allows users to register, manage transactions, track their expenses and income, and set budgets with real-time insights.

---

## 🚀 Tech Stack

### 🖥️ Frontend
- [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
- [Tailwind CSS](https://tailwindcss.com/)
- React Router
- Axios

### ⚙️ Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [pg (node-postgres)](https://node-postgres.com/)
- [JWT](https://jwt.io/) for authentication
- [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing

---

## 📁 Features

- 🔐 User Registration and Login
- 📤 Create/Read/Update/Delete Transactions
- 📊 Categorize income & expenses
- 💰 Track total income, expenses, balance, and previous balance
- 🌍 Supports multiple currencies and timezones
- 🧾 Upload and retain transaction receipts (optionally)
- 👤 Profile settings & image update
- 🧠 Backend built with clean modular structure using stored procedures and constraints

---

## 🧪 Prerequisites

- Node.js ≥ 16.x
- PostgreSQL ≥ 13.x

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/expense-tracker-app.git
cd expense-tracker-app
```

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure Environment Variables

Create `.env` files for both client and server.

#### `server/.env`

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/your_db_name
JWT_SECRET=your_jwt_secret
```

---

### 4. Setup the Database

- Import the provided SQL schema from `/server/db/schema.sql`
- Run seed scripts or use the provided stored procedures to insert sample data

---

### 5. Run the App

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) to view the frontend.

---

## 📸 Screenshots

<img width="1887" height="866" alt="image" src="https://github.com/user-attachments/assets/bb194e9d-0570-4a84-a9b1-729877dac3a3" />
<img width="1887" height="884" alt="image" src="https://github.com/user-attachments/assets/309242d7-7491-4fda-9f29-12db9631d39d" />
<img width="1853" height="859" alt="image" src="https://github.com/user-attachments/assets/07418d68-2bc5-4cba-bed6-b734b8e3e78a" />




---

## 📌 Project Structure

```
expense-tracker-app/
│
├── client/             # React + Vite Frontend
│   ├── src/
│   └── tailwind.config.js
│
├── server/             # Node.js + Express Backend
│   ├── db/             # SQL scripts & connection
│   ├── routes/         # API routes
│   ├── controllers/    # Business logic
│   └── middlewares/
│
├── README.md
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

Thanks to:
- PostgreSQL Community
- Tailwind CSS for utility-first UI
- Vite for blazing-fast frontend builds
