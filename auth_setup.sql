-- Add password column to users table
USE canteen_db;

-- Add password field if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Update existing users with sample passwords (In production, these should be hashed!)
-- For demo purposes, we're using plain text passwords
UPDATE users SET password = 'password123' WHERE id = 11;
UPDATE users SET password = 'password123' WHERE id = 12;
UPDATE users SET password = 'password123' WHERE id = 13;
UPDATE users SET password = 'password123' WHERE id = 14;
UPDATE users SET password = 'password123' WHERE id = 15;
UPDATE users SET password = 'password123' WHERE id = 16;
UPDATE users SET password = 'password123' WHERE id = 17;
UPDATE users SET password = 'password123' WHERE id = 18;
UPDATE users SET password = 'password123' WHERE id = 19;
UPDATE users SET password = 'password123' WHERE id = 20;

-- Add a sample student user with specific credentials
INSERT INTO users (username, phone, wallet_balance, is_admin, password)
VALUES ('student', '9999999999', 500.00, 0, 'campueats123')
ON DUPLICATE KEY UPDATE password = 'campueats123', wallet_balance = 500.00;

-- Add an admin user
INSERT INTO users (username, phone, wallet_balance, is_admin, password)
VALUES ('admin', '8888888888', 1000.00, 1, 'admin123')
ON DUPLICATE KEY UPDATE password = 'admin123', is_admin = 1;

SELECT 'Users table updated with passwords' as status;
