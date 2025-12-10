-- Add user_name column to orders table for guest orders
USE canteen_db;

-- Add user_name field to store guest names
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_name VARCHAR(100) DEFAULT NULL;

-- Make user_id nullable for guest orders
ALTER TABLE orders MODIFY COLUMN user_id INT DEFAULT NULL;

SELECT 'Orders table updated to support guest orders' as status;
