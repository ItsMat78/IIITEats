-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: canteen_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `icon` varchar(50) DEFAULT 'fa-utensils',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Chinese','fa-bowl-rice'),(2,'Pizza','fa-pizza-slice'),(3,'Kathi Rolls','fa-scroll'),(4,'Maggi','fa-bacon'),(5,'Sandwiches','fa-bread-slice'),(6,'Indian Combos','fa-bowl-food'),(7,'Biryani','fa-fire');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `user_id` int NOT NULL,
  `menu_item_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`menu_item_id`),
  KEY `menu_item_id` (`menu_item_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `item_id` int NOT NULL,
  `stock_qty` int DEFAULT '50',
  PRIMARY KEY (`item_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,100),(2,100),(3,100),(4,100),(5,100),(6,100),(7,100),(8,100),(9,100),(10,100),(11,100),(12,100),(13,100),(14,100),(15,100),(16,100),(17,100),(18,100),(19,100),(20,100),(21,100),(22,100),(23,100),(24,100),(25,100),(26,100),(27,100);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_history`
--

DROP TABLE IF EXISTS `inventory_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `stock_qty` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_item_id` (`item_id`),
  KEY `idx_updated_at` (`updated_at`),
  CONSTRAINT `inventory_history_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_history`
--

LOCK TABLES `inventory_history` WRITE;
/*!40000 ALTER TABLE `inventory_history` DISABLE KEYS */;
INSERT INTO `inventory_history` VALUES (1,1,100,'2025-12-09 02:07:59'),(2,2,100,'2025-12-09 02:07:59'),(3,3,100,'2025-12-09 02:07:59'),(4,4,100,'2025-12-09 02:07:59'),(5,5,100,'2025-12-09 02:07:59'),(6,6,100,'2025-12-09 02:07:59'),(7,7,100,'2025-12-09 02:07:59'),(8,8,100,'2025-12-09 02:07:59'),(9,9,100,'2025-12-09 02:07:59'),(10,10,100,'2025-12-09 02:07:59'),(11,11,100,'2025-12-09 02:07:59'),(12,12,100,'2025-12-09 02:07:59'),(13,13,100,'2025-12-09 02:07:59'),(14,14,100,'2025-12-09 02:07:59'),(15,15,100,'2025-12-09 02:07:59'),(16,16,100,'2025-12-09 02:07:59'),(17,17,100,'2025-12-09 02:07:59'),(18,18,100,'2025-12-09 02:07:59'),(19,19,100,'2025-12-09 02:07:59'),(20,20,100,'2025-12-09 02:07:59'),(21,21,100,'2025-12-09 02:07:59'),(22,22,100,'2025-12-09 02:07:59'),(23,23,100,'2025-12-09 02:07:59'),(24,24,100,'2025-12-09 02:07:59'),(25,25,100,'2025-12-09 02:07:59'),(26,26,100,'2025-12-09 02:07:59'),(27,27,100,'2025-12-09 02:07:59');
/*!40000 ALTER TABLE `inventory_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category_id` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `prep_time_mins` int DEFAULT NULL,
  `calories` int DEFAULT NULL,
  `is_veg` tinyint(1) DEFAULT '1',
  `spicy_level` int DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,'Vegetable Chowmein',70.00,1,'/public/images/veg-chowmein.jpg',10,250,1,1),(2,'Egg Chowmein',80.00,1,'/public/images/egg-chowmein.jpg',12,300,0,1),(3,'Chicken Chowmein',90.00,1,'/public/images/chicken-chowmein.jpg',15,350,0,2),(4,'Vegetable Fried Rice',70.00,1,'/public/images/veg-fried-rice.jpg',10,280,1,1),(5,'Chicken Fried Rice',90.00,1,'/public/images/chicken-fried-rice.jpg',15,380,0,2),(6,'Paneer Chilly Dry (8 Pcs)',150.00,1,'/public/images/paneer-chilly-dry.jpg',20,400,1,3),(7,'Chicken Chilly Dry (8 Pcs)',175.00,1,'/public/images/chicken-chilly-dry.jpg',25,450,0,3),(8,'Mexican Pizza',100.00,2,'/public/images/mexican-pizza.jpg',20,500,1,2),(9,'Masala Paneer Pizza',120.00,2,'/public/images/masala-paneer-pizza.jpg',20,550,1,2),(10,'Chicken Fry Pizza',125.00,2,'/public/images/chicken-paneer-pizza.jpg',25,600,0,2),(11,'Cheese Pizza',90.00,2,'/public/images/cheese-pizza.jpg',15,450,1,0),(12,'Veg Kathi Roll',35.00,3,'/public/images/veg-roll.jpg',8,200,1,1),(13,'Aloo Kathi Roll',40.00,3,'/public/images/aloo-roll.jpg',8,220,1,1),(14,'Egg Kathi Roll',40.00,3,'/public/images/egg-roll.jpg',8,250,0,1),(15,'Chicken Kathi Roll',60.00,3,'/public/images/chicken-roll.jpg',10,300,0,2),(16,'Plain Maggi',28.00,4,'/public/images/plain-maggi.jpg',5,180,1,0),(17,'Masala Fry Maggi',35.00,4,'/public/images/masala-maggi.jpg',7,220,1,2),(18,'Maggi with Egg',43.00,4,'/public/images/egg-maggi.jpg',7,260,0,1),(19,'Veg Plain Sandwich',25.00,5,'/public/images/veg-plain-sandwich.jpg',5,150,1,0),(20,'Veg Grill Sandwich',35.00,5,'/public/images/veg-grill-sandwich.jpg',8,200,1,1),(21,'Paneer Grill Sandwich',60.00,5,'/public/images/paneer-grill-sandwich.jpg',10,280,1,1),(22,'Chicken Grill Sandwich',70.00,5,'/public/images/chicken-grill-sandwich.jpg',12,320,0,1),(23,'Paneer Butter Masala (5 Pcs)',125.00,6,'/public/images/paneer-butter-masala.jpg',15,600,1,1),(24,'Chicken Butter Masala (2 Pcs)',150.00,6,'/public/images/chicken-butter-masala.jpg',20,700,0,2),(25,'Chicken Curry (Home Style)',125.00,6,'/public/images/chicken-curry.jpg',20,650,0,3),(26,'Veg Biryani',130.00,7,'/public/images/veg-biryani.jpg',25,550,1,2),(27,'Chicken Biryani',150.00,7,'/public/images/chicken-biryani.jpg',30,650,0,3);
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `menu_item_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price_at_time` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `menu_item_id` (`menu_item_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (31,1,1,2,99.00),(32,1,15,1,50.00),(33,2,3,1,150.00),(34,2,5,2,115.00),(35,3,2,1,110.00),(36,3,8,1,100.00),(37,4,10,2,200.00),(38,4,7,1,250.00),(39,5,11,1,280.00),(40,5,4,1,40.00),(41,6,6,1,120.00),(42,6,14,1,160.00),(43,7,9,1,250.00),(44,7,2,1,110.00),(45,7,15,1,50.00),(46,8,1,1,99.00),(47,8,4,2,40.00),(48,9,12,1,200.00),(49,9,6,1,120.00),(50,9,5,1,57.50),(51,10,11,1,280.00),(52,10,15,1,50.00),(53,10,8,1,90.00),(54,11,10,2,200.00),(55,11,4,1,40.00),(56,11,6,1,40.00),(57,12,3,1,150.00),(58,12,14,1,160.00),(59,12,7,1,250.00),(60,12,5,1,57.50),(61,13,9,1,250.00),(62,13,12,1,200.00),(63,14,11,1,280.00),(64,14,2,1,110.00),(65,14,4,1,40.00),(66,14,15,1,50.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('new','cooking','ready','completed') DEFAULT 'new',
  `payment_method` varchar(50) DEFAULT 'UPI',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (15,1,249.00,'new','UPI','2025-12-10 01:51:05'),(16,2,380.00,'new','UPI','2025-12-10 01:48:05'),(17,3,210.00,'cooking','UPI','2025-12-10 01:38:05'),(18,4,450.00,'cooking','UPI','2025-12-10 01:41:05'),(19,5,320.00,'completed','UPI','2025-12-10 01:45:05'),(20,6,280.00,'ready','UPI','2025-12-10 01:28:05'),(21,7,520.00,'ready','UPI','2025-12-10 01:33:05'),(22,8,190.00,'ready','UPI','2025-12-10 01:35:05'),(23,9,350.00,'completed','UPI','2025-12-09 23:53:05'),(24,1,420.00,'completed','UPI','2025-12-09 22:53:05'),(25,2,280.00,'completed','UPI','2025-12-09 21:53:05'),(26,3,610.00,'completed','UPI','2025-12-09 20:53:05'),(27,10,390.00,'completed','UPI','2025-12-09 19:53:05'),(28,4,470.00,'completed','UPI','2025-12-09 01:53:05');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raw_materials`
--

DROP TABLE IF EXISTS `raw_materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raw_materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `stock_qty` int DEFAULT '0',
  `low_stock_threshold` int DEFAULT '5',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raw_materials`
--

LOCK TABLES `raw_materials` WRITE;
/*!40000 ALTER TABLE `raw_materials` DISABLE KEYS */;
INSERT INTO `raw_materials` VALUES (1,'Rice','kg',50,10,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(2,'Chicken Breast','kg',15,5,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(3,'Dal/Lentils','kg',30,8,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(4,'Tomatoes','kg',35,10,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(5,'Onions','kg',25,10,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(6,'Oil','L',10,3,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(7,'Spice Mix','kg',8,2,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(8,'Flour','kg',40,15,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(9,'Paneer','kg',12,3,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(10,'Eggs','pieces',200,50,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(11,'Potatoes','kg',20,8,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(12,'Garlic','kg',3,1,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(13,'Ginger','kg',2,1,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(14,'Green Chillies','kg',4,1,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(15,'Butter','kg',5,1,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(16,'Cheese','kg',3,1,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(17,'Bread','pieces',100,20,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(18,'Pizza Dough','kg',15,5,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(19,'Maggi Noodles','packs',150,30,'2025-12-10 02:16:25','2025-12-10 02:16:25'),(20,'Condiments Mix','kg',6,2,'2025-12-10 02:16:25','2025-12-10 02:16:25');
/*!40000 ALTER TABLE `raw_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raw_materials_history`
--

DROP TABLE IF EXISTS `raw_materials_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raw_materials_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_id` int NOT NULL,
  `stock_qty` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_material_id` (`material_id`),
  KEY `idx_updated_at` (`updated_at`),
  CONSTRAINT `raw_materials_history_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raw_materials_history`
--

LOCK TABLES `raw_materials_history` WRITE;
/*!40000 ALTER TABLE `raw_materials_history` DISABLE KEYS */;
INSERT INTO `raw_materials_history` VALUES (1,1,50,'2025-12-09 02:16:25'),(2,2,15,'2025-12-09 02:16:25'),(3,3,30,'2025-12-09 02:16:25'),(4,4,35,'2025-12-09 02:16:25'),(5,5,25,'2025-12-09 02:16:25'),(6,6,10,'2025-12-09 02:16:25'),(7,7,8,'2025-12-09 02:16:25'),(8,8,40,'2025-12-09 02:16:25'),(9,9,12,'2025-12-09 02:16:25'),(10,10,200,'2025-12-09 02:16:25'),(11,11,20,'2025-12-09 02:16:25'),(12,12,3,'2025-12-09 02:16:25'),(13,13,2,'2025-12-09 02:16:25'),(14,14,4,'2025-12-09 02:16:25'),(15,15,5,'2025-12-09 02:16:25'),(16,16,3,'2025-12-09 02:16:25'),(17,17,100,'2025-12-09 02:16:25'),(18,18,15,'2025-12-09 02:16:25'),(19,19,150,'2025-12-09 02:16:25'),(20,20,6,'2025-12-09 02:16:25');
/*!40000 ALTER TABLE `raw_materials_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `wallet_balance` decimal(10,2) DEFAULT '500.00',
  `is_admin` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (11,'Rajesh Kumar','9876543210',500.00,0,'2025-11-30 01:53:05'),(12,'Priya Singh','8765432109',1200.00,0,'2025-12-02 01:53:05'),(13,'Amit Patel','7654321098',300.00,0,'2025-12-05 01:53:05'),(14,'Neha Gupta','6543210987',800.00,0,'2025-12-07 01:53:05'),(15,'Vikram Sharma','5432109876',600.00,0,'2025-12-08 01:53:05'),(16,'Ananya Desai','4321098765',950.00,0,'2025-12-09 01:53:05'),(17,'Rohan Singh','3210987654',450.00,0,'2025-12-10 01:53:05'),(18,'Sneha Verma','2109876543',1100.00,0,'2025-12-10 01:53:05'),(19,'Arjun Das','1098765432',700.00,0,'2025-12-10 01:53:05'),(20,'Divya Kumar','9988776655',850.00,0,'2025-12-10 01:53:05');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-10 14:55:28
