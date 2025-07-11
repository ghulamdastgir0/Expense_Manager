-- ======================
-- 1. USERS TABLE
-- ======================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password TEXT,
    join_date DATE,
    image_url TEXT
);

-- ======================
-- 2. CURRENCY TABLE
-- ======================
CREATE TABLE currency (
    currency_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50),
    symbol VARCHAR(5)
);

-- ======================
-- 3. TIMEZONE TABLE
-- ======================
CREATE TABLE timezone (
    time_zone_id VARCHAR(50) PRIMARY KEY,
    country_name VARCHAR(100),
    utc_offset VARCHAR(10)
);

-- ======================
-- 4. ACCOUNT DETAIL TABLE
-- ======================
CREATE TABLE accountdetail (
    user_id INTEGER PRIMARY KEY,
    currency_id VARCHAR(10),
    time_zone_id VARCHAR(50),
    budget_limit NUMERIC(12,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_id) REFERENCES currency(currency_id),
    FOREIGN KEY (time_zone_id) REFERENCES timezone(time_zone_id)
);

-- ======================
-- 5. BALANCE DETAIL TABLE
-- ======================
CREATE TABLE balance_detail (
    user_id INTEGER PRIMARY KEY,
    income NUMERIC(12,2),
    expenses NUMERIC(12,2),
    balance NUMERIC(12,2),
    previous_balance NUMERIC(12,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ======================
-- 6. CATEGORY TABLE
-- ======================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

-- ======================
-- 7. PAYMENT METHOD TABLE
-- ======================
CREATE TABLE paymentmethod (
    payment_method_id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

-- ======================
-- 8. TRANSACTIONS TABLE
-- ======================
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    type VARCHAR(20),
    transaction_date DATE,
    transaction_time TIME WITHOUT TIME ZONE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ======================
-- 9. TRANSACTION DETAILS TABLE
-- ======================
CREATE TABLE transaction_details (
    transaction_id INTEGER PRIMARY KEY,
    title VARCHAR(255),
    category_id INTEGER,
    payment_method_id INTEGER,
    retain_until DATE,
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (payment_method_id) REFERENCES paymentmethod(payment_method_id)
);
