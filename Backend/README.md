# Expense Manager — Backend API

## Folder Structure

```
Backend/
├── server.js                    ← Express app entry point
├── package.json
├── .env                         ← Environment variables (DO NOT commit)
├── .env.example                 ← Template for env vars
│
├── Auth/
│   └── authMiddleware.js        ← JWT verification middleware
│
├── Config/
│   └── db.js                    ← PostgreSQL connection pool
│
├── Controllers/
│   ├── authController.js        ← Signup, Signin, Refresh, Change Password
│   ├── userController.js        ← Get/Update Profile, Delete Account
│   ├── transactionController.js ← Add/Delete/Get Transactions
│   ├── settingsController.js    ← Get/Update Account Settings
│   ├── dashboardController.js   ← Dashboard Summary, Budget Alert
│   ├── reportController.js      ← Monthly/Daily/Yearly Reports
│   └── referenceController.js   ← Categories, Currencies, etc.
│
└── Routes/
    ├── authRoutes.js
    ├── userRoutes.js
    ├── transactionRoutes.js
    ├── settingsRoutes.js
    ├── dashboardRoutes.js
    ├── reportRoutes.js
    └── referenceRoutes.js
```

---

## Setup

### 1. Install dependencies
```bash
cd Backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials and secrets
```

### 3. Set up the database
```sql
-- Run the SQL file in psql or pgAdmin:
psql -U postgres -d expense_manager -f Expense_Manager_DataBase.sql
```

### 4. Start the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

---

## Frontend Integration

1. Copy `api.js` into `Frontend/src/services/api.js`
2. Create `Frontend/.env` with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Use the API services in your components:
   ```js
   import { authAPI, transactionAPI, dashboardAPI } from '../services/api'

   // Sign in
   const { data } = await authAPI.signin({ email, password })
   saveTokens(data.accessToken, data.refreshToken)

   // Get dashboard data
   const { data } = await dashboardAPI.getSummary()

   // Add transaction
   await transactionAPI.add({
     type: 'Expense',
     title: 'Grocery',
     amount: 45.50,
     date: '2025-07-01',
     time: '14:30',
     category_id: 1,
     payment_method_id: 2
   })
   ```

---

## API Reference

### AUTH  `/api/auth`
| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| POST   | /signup               | ✗    | Create account           |
| POST   | /signin               | ✗    | Sign in, returns tokens  |
| POST   | /refresh              | ✗    | Get new access token     |
| PUT    | /change-password      | ✓    | Change password          |

### USERS  `/api/users`
| Method | Endpoint   | Auth | Description                  |
|--------|------------|------|------------------------------|
| GET    | /profile   | ✓    | Full user profile + balance  |
| PUT    | /profile   | ✓    | Update name/email/avatar     |
| DELETE | /account   | ✓    | Permanently delete account   |

### TRANSACTIONS  `/api/transactions`
| Method | Endpoint        | Auth | Description                          |
|--------|-----------------|------|--------------------------------------|
| POST   | /               | ✓    | Add income or expense transaction    |
| GET    | /recent         | ✓    | Last N transactions (default 6)      |
| GET    | /history        | ✓    | Filtered + sorted history            |
| GET    | /:id            | ✓    | Single transaction detail            |
| DELETE | /all            | ✓    | Delete all (Danger Zone)             |
| DELETE | /:id            | ✓    | Delete one + reverse balance         |

### SETTINGS  `/api/settings`
| Method | Endpoint | Auth | Description                          |
|--------|----------|------|--------------------------------------|
| GET    | /        | ✓    | Get currency, timezone, budget       |
| PUT    | /        | ✓    | Update currency, timezone, budget    |

### DASHBOARD  `/api/dashboard`
| Method | Endpoint       | Auth | Description                          |
|--------|----------------|------|--------------------------------------|
| GET    | /summary       | ✓    | Stats, budget, top 5 expenses, recent|
| GET    | /budget-alert  | ✓    | safe / warning / exceeded alert      |

### REPORTS  `/api/reports`
| Method | Endpoint           | Auth | Query Params                     |
|--------|--------------------|------|----------------------------------|
| GET    | /monthly           | ✓    | `month=YYYY-MM`                  |
| GET    | /daily             | ✓    | `date=YYYY-MM-DD`                |
| GET    | /top-categories    | ✓    | `limit=5`                        |
| GET    | /yearly            | ✓    | `year=YYYY`                      |
| GET    | /payment-modes     | ✓    | `from_date`, `to_date`           |
| GET    | /income-vs-expense | ✓    | `from_date`, `to_date`           |

### REFERENCE  `/api/reference` (public, no auth)
| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| GET    | /categories      | All categories      |
| GET    | /currencies      | All currencies      |
| GET    | /payment-methods | All payment methods |
| GET    | /timezones       | All timezones       |

---

## Security Features

- **Bcrypt** password hashing (12 salt rounds)
- **JWT** access tokens (7d) + refresh tokens (30d)
- **Helmet** sets security HTTP headers
- **CORS** restricted to frontend origin
- **Rate limiting**: 100 req/15min globally, 10 req/15min on auth routes
- **Token auto-refresh** in the frontend API client
- All protected routes verify JWT via `authMiddleware`
- SQL uses parameterized queries (no SQL injection)
- Cascading deletes via PostgreSQL FK constraints
