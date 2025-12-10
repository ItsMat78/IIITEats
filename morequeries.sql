USE canteen_db;

-- 1. Clear old data to avoid duplicates
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE categories;
TRUNCATE TABLE inventory;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. Insert Real Categories (from your menu sheet)
INSERT INTO categories (id, name, icon) VALUES 
(1, 'Chinese', 'fa-bowl-rice'),
(2, 'Pizza', 'fa-pizza-slice'),
(3, 'Kathi Rolls', 'fa-scroll'),
(4, 'Maggi', 'fa-bacon'),
(5, 'Sandwiches', 'fa-bread-slice'),
(6, 'Indian Combos', 'fa-bowl-food'),
(7, 'Biryani', 'fa-fire');

-- 3. Insert REAL Menu Items (Prices from your image)
INSERT INTO menu_items (name, price, category_id, is_veg, spicy_level, image_url, prep_time_mins, calories) VALUES 
-- CHINESE
('Vegetable Chowmein', 70.00, 1, TRUE, 1, '/public/images/veg-chowmein.jpg', 10, 250),
('Egg Chowmein', 80.00, 1, FALSE, 1, '/public/images/egg-chowmein.jpg', 12, 300),
('Chicken Chowmein', 90.00, 1, FALSE, 2, '/public/images/chicken-chowmein.jpg', 15, 350),
('Vegetable Fried Rice', 70.00, 1, TRUE, 1, '/public/images/veg-fried-rice.jpg', 10, 280),
('Chicken Fried Rice', 90.00, 1, FALSE, 2, '/public/images/chicken-fried-rice.jpg', 15, 380),
('Paneer Chilly Dry (8 Pcs)', 150.00, 1, TRUE, 3, '/public/images/paneer-chilly-dry.jpg', 20, 400),
('Chicken Chilly Dry (8 Pcs)', 175.00, 1, FALSE, 3, '/public/images/chicken-chilly-dry.jpg', 25, 450),

-- PIZZA
('Mexican Pizza', 100.00, 2, TRUE, 2, '/public/images/mexican-pizza.jpg', 20, 500),
('Masala Paneer Pizza', 120.00, 2, TRUE, 2, '/public/images/masala-paneer-pizza.jpg', 20, 550),
('Chicken Fry Pizza', 125.00, 2, FALSE, 2, '/public/images/chicken-paneer-pizza.jpg', 25, 600),
('Cheese Pizza', 90.00, 2, TRUE, 0, '/public/images/cheese-pizza.jpg', 15, 450),

-- KATHI ROLLS
('Veg Kathi Roll', 35.00, 3, TRUE, 1, '/public/images/veg-roll.jpg', 8, 200),
('Aloo Kathi Roll', 40.00, 3, TRUE, 1, '/public/images/aloo-roll.jpg', 8, 220),
('Egg Kathi Roll', 40.00, 3, FALSE, 1, '/public/images/egg-roll.jpg', 8, 250),
('Chicken Kathi Roll', 60.00, 3, FALSE, 2, '/public/images/chicken-roll.jpg', 10, 300),

-- MAGGI
('Plain Maggi', 28.00, 4, TRUE, 0, '/public/images/plain-maggi.jpg', 5, 180),
('Masala Fry Maggi', 35.00, 4, TRUE, 2, '/public/images/masala-maggi.jpg', 7, 220),
('Maggi with Egg', 43.00, 4, FALSE, 1, '/public/images/egg-maggi.jpg', 7, 260), -- Calculated 28+15 based on menu "Add on"

-- SANDWICHES
('Veg Plain Sandwich', 25.00, 5, TRUE, 0, '/public/images/veg-plain-sandwich.jpg', 5, 150),
('Veg Grill Sandwich', 35.00, 5, TRUE, 1, '/public/images/veg-grill-sandwich.jpg', 8, 200),
('Paneer Grill Sandwich', 60.00, 5, TRUE, 1, '/public/images/paneer-grill-sandwich.jpg', 10, 280),
('Chicken Grill Sandwich', 70.00, 5, FALSE, 1, '/public/images/chicken-grill-sandwich.jpg', 12, 320),

-- INDIAN COMBOS
('Paneer Butter Masala (5 Pcs)', 125.00, 6, TRUE, 1, '/public/images/paneer-butter-masala.jpg', 15, 600),
('Chicken Butter Masala (2 Pcs)', 150.00, 6, FALSE, 2, '/public/images/chicken-butter-masala.jpg', 20, 700),
('Chicken Curry (Home Style)', 125.00, 6, FALSE, 3, '/public/images/chicken-curry.jpg', 20, 650),

-- BIRYANI
('Veg Biryani', 130.00, 7, TRUE, 2, '/public/images/veg-biryani.jpg', 25, 550),
('Chicken Biryani', 150.00, 7, FALSE, 3, '/public/images/chicken-biryani.jpg', 30, 650);

-- 4. Fill Inventory (Set all to 100 stock)
INSERT INTO inventory (item_id, stock_qty) 
SELECT id, 100 FROM menu_items;

SELECT * FROM menu_items;