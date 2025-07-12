-- ======================
-- 1. USERS TABLE
-- ======================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
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

-- Create updated transaction_details table with amount column
CREATE TABLE transaction_details (
    transaction_id INTEGER REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    title VARCHAR(255),
    category_id INTEGER REFERENCES category(category_id),
    payment_method_id INTEGER REFERENCES paymentmethod(payment_method_id),
    amount NUMERIC(12,2) NOT NULL,
    retain_until DATE
);


-- USERS (10 entries)
INSERT INTO users (first_name, last_name, email, password, join_date, image_url) VALUES
('Daniyal', 'Khan', 'dani@gmail.com', 'hashed_pass_1', '2024-07-01', 'img1.png'),
('Sara', 'Ahmed', 'sara@gmail.com', 'hashed_pass_2', '2024-07-05', 'img2.png'),
('Ali', 'Raza', 'ali@gmail.com', 'hashed_pass_3', '2024-07-07', 'img3.png'),
('Zoya', 'Shah', 'zoya@gmail.com', 'hashed_pass_4', '2024-07-08', 'img4.png'),
('Umair', 'Tariq', 'umair@gmail.com', 'hashed_pass_5', '2024-07-09', 'img5.png'),
('Hina', 'Malik', 'hina@gmail.com', 'hashed_pass_6', '2024-07-10', 'img6.png'),
('Bilal', 'Yousaf', 'bilal@gmail.com', 'hashed_pass_7', '2024-07-11', 'img7.png'),
('Maira', 'Zubair', 'maira@gmail.com', 'hashed_pass_8', '2024-07-12', 'img8.png'),
('Ahsan', 'Saeed', 'ahsan@gmail.com', 'hashed_pass_9', '2024-07-13', 'img9.png'),
('Faiza', 'Anwar', 'faiza@gmail.com', 'faiza_pass_10', '2024-07-14', 'img10.png');

-- CURRENCY
INSERT INTO currency (currency_id, name, symbol) VALUES
('USD', 'United States Dollar', '$'),
('EUR', 'Euro', '€'),
('GBP', 'British Pound Sterling', '£'),
('JPY', 'Japanese Yen', '¥'),
('CNY', 'Chinese Yuan', '¥'),
('INR', 'Indian Rupee', '₹'),
('PKR', 'Pakistani Rupee', '₨'),
('AUD', 'Australian Dollar', 'A$'),
('CAD', 'Canadian Dollar', 'C$'),
('CHF', 'Swiss Franc', 'CHF'),
('SEK', 'Swedish Krona', 'kr'),
('NOK', 'Norwegian Krone', 'kr'),
('DKK', 'Danish Krone', 'kr'),
('RUB', 'Russian Ruble', '₽'),
('ZAR', 'South African Rand', 'R'),
('SGD', 'Singapore Dollar', 'S$'),
('HKD', 'Hong Kong Dollar', 'HK$'),
('KRW', 'South Korean Won', '₩'),
('TRY', 'Turkish Lira', '₺'),
('THB', 'Thai Baht', '฿'),
('AED', 'United Arab Emirates Dirham', 'د.إ'),
('SAR', 'Saudi Riyal', '﷼'),
('MYR', 'Malaysian Ringgit', 'RM'),
('IDR', 'Indonesian Rupiah', 'Rp'),
('PHP', 'Philippine Peso', '₱'),
('VND', 'Vietnamese Dong', '₫'),
('BRL', 'Brazilian Real', 'R$'),
('MXN', 'Mexican Peso', '$'),
('EGP', 'Egyptian Pound', '£'),
('NGN', 'Nigerian Naira', '₦');


-- TIMEZONE
INSERT INTO timezone (time_zone_id, country_name, utc_offset) VALUES
('Asia/Karachi', 'Pakistan', '+05:00'),
('America/New_York', 'USA', '-04:00');

-- ACCOUNT DETAILS
INSERT INTO accountdetail (user_id, currency_id, time_zone_id, budget_limit) VALUES
(1, 'PKR', 'Asia/Karachi', 100000.00),
(2, 'USD', 'America/New_York', 3000.00),
(3, 'PKR', 'Asia/Karachi', 50000.00),
(4, 'PKR', 'Asia/Karachi', 75000.00),
(5, 'PKR', 'Asia/Karachi', 90000.00),
(6, 'PKR', 'Asia/Karachi', 40000.00),
(7, 'USD', 'America/New_York', 2500.00),
(8, 'PKR', 'Asia/Karachi', 65000.00),
(9, 'PKR', 'Asia/Karachi', 85000.00),
(10, 'USD', 'America/New_York', 2000.00);

-- BALANCE DETAILS
INSERT INTO balance_detail (user_id, income, expenses, balance, previous_balance) VALUES
(1, 120000.00, 90000.00, 30000.00, 25000.00),
(2, 4000.00, 1800.00, 2200.00, 2000.00),
(3, 80000.00, 30000.00, 50000.00, 40000.00),
(4, 90000.00, 60000.00, 30000.00, 25000.00),
(5, 100000.00, 10000.00, 90000.00, 85000.00),
(6, 50000.00, 20000.00, 30000.00, 25000.00),
(7, 3500.00, 1000.00, 2500.00, 2400.00),
(8, 60000.00, 25000.00, 35000.00, 30000.00),
(9, 95000.00, 30000.00, 65000.00, 60000.00),
(10, 3000.00, 1000.00, 2000.00, 1900.00);

-- CATEGORY (from your image)
INSERT INTO category (name) VALUES
('Food'),
('Fuel'),
('Clothing'),
('Medical'),
('Loan'),
('Transport'),
('Salary'),
('Fun'),
('Personal'),
('Other');

-- PAYMENT METHODS
INSERT INTO paymentmethod (name) VALUES
('Credit Card'),
('Debit Card'),
('Cash'),
('Bank Transfer');

-- TRANSACTIONS
INSERT INTO transactions (user_id, type, transaction_date, transaction_time) VALUES
(1, 'expense', '2024-07-10', '14:30:00'),
(1, 'income', '2024-07-11', '11:00:00'),
(2, 'expense', '2024-07-09', '09:15:00'),
(3, 'expense', '2024-07-08', '16:45:00'),
(4, 'income', '2024-07-07', '13:20:00'),
(10, 'expense', '2024-07-06', '18:00:00'),
(6, 'expense', '2024-07-05', '12:00:00'),
(7, 'income', '2024-07-04', '10:00:00'),
(8, 'expense', '2024-07-03', '19:00:00'),
(9, 'income', '2024-07-02', '20:00:00');

-- TRANSACTION DETAILS
INSERT INTO transaction_details (
    transaction_id, title, category_id, payment_method_id, amount, retain_until
) VALUES
(1, 'Grocery Shopping', 1, 1, 450.00, make_date(EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1, 7, 1)),
(2, 'Bus Fare', 6, 2, 60.00, make_date(EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1, 7, 1)),
(3, 'Netflix Subscription', 8, 3, 1500.00, make_date(EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1, 7, 1)),
(4, 'Doctor Appointment', 4, 1, 3000.00, make_date(EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1, 7, 1)),
(5, 'Fuel Refill', 2, 2, 2300.00, make_date(EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1, 7, 1)),
(6, 'Electricity Bill', 3, 1, 5500.00, make_date(EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1, 7, 1)),
(7, 'Online Course', 5, 3, 7000.00, make_date(EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1, 7, 1)),
(8, 'Gym Membership', 9, 2, 1200.00, make_date(EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1, 7, 1)),
(9, 'Lunch with Friends', 1, 1, 900.00, make_date(EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1, 7, 1)),
(10, 'Book Purchase', 7, 3, 1800.00, make_date(EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1, 7, 1));



--Procedures
--1
CREATE OR REPLACE PROCEDURE create_user(
    fname VARCHAR,
    lname VARCHAR,
    new_email VARCHAR,
    password VARCHAR,
    image_url TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE email = new_email) THEN
        RAISE NOTICE 'Email already exists';
    ELSE
        INSERT INTO users (first_name, last_name, email, password, join_date, image_url)
        VALUES (fname, lname, new_email, password, CURRENT_DATE, image_url);
    END IF;
END;
$$;

--2
CREATE OR REPLACE PROCEDURE delete_user(id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM users WHERE user_id = id;
END;
$$;
--3
CREATE OR REPLACE PROCEDURE update_user_info(
    id INT,
    fname VARCHAR,
    lname VARCHAR,
    new_email VARCHAR,
    image TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE user_id = id) THEN
        UPDATE users
        SET
            first_name = fname,
            last_name = lname,
            email = new_email,
            image_url = image
        WHERE user_id = id;
    ELSE
        RAISE NOTICE 'User does not exist';
    END IF;
END;
$$;
--4
CREATE PROCEDURE update_account_settings(id INT, c_id varchar, tz_id varchar, b_limit int)
language plpgsql
AS $$
Begin
    IF EXISTS (SELECT 1 FROM users WHERE user_id = id) THEN
	Update accountdetail
	set 
	currency_id = c_id,
	time_zone_id = tz_id,
	budget_limit= b_limit
	where user_id= id;
	ELSE
        RAISE NOTICE 'User does not exist';
    END IF;
	
End;
$$;
--5
CREATE OR REPLACE PROCEDURE add_transaction(
    u_id INT,
    t_type TEXT,
    t_date DATE,
    t_time TIME,
    t_title TEXT,
    t_category_id INT,
    t_payment_method_id INT,
    amount NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    trans_id INT;
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = u_id) THEN
        RAISE NOTICE 'Failed Transaction! User not found';
        RETURN;
    END IF;

    -- Validate type
    IF NOT (t_type = 'Expense' OR t_type = 'Income') THEN
        RAISE NOTICE 'Failed Transaction! Invalid Payment Type';
        RETURN;
    END IF;

    -- Insert into transactions and get transaction_id
    INSERT INTO transactions (user_id, type, transaction_date, transaction_time, retain_until)
    VALUES (
        u_id, t_type, t_date, t_time,
        make_date(EXTRACT(YEAR FROM t_date)::INT + 1, EXTRACT(MONTH FROM t_date)::INT, 1)
    )
    RETURNING transaction_id INTO trans_id;

    -- Insert into transaction_details
    INSERT INTO transaction_details (
        transaction_id, title, category_id, payment_method_id, amount
    )
    VALUES (
        trans_id, t_title, t_category_id, t_payment_method_id, amount
    );

    -- Update balance
    IF t_type = 'Expense' THEN
        UPDATE balance_detail
        SET
            expenses = expenses + amount,
            balance = balance - amount
        WHERE user_id = u_id;
    ELSE
        UPDATE balance_detail
        SET
            income = income + amount,
            balance = balance + amount
        WHERE user_id = u_id;
    END IF;

    RAISE NOTICE 'Transaction added successfully';
END;
$$;


select * from users;
select * from accountdetail;