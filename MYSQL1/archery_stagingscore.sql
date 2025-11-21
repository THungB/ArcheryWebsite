-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: archery
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Dumping data for table `stagingscore`
--

LOCK TABLES `stagingscore` WRITE;
/*!40000 ALTER TABLE `stagingscore` DISABLE KEYS */;
INSERT INTO `stagingscore` VALUES (1,1,1,1,'2025-11-20 01:04:46',225,'approved','[]'),(2,1,1,1,'2025-11-20 01:07:06',225,'pending','[]'),(3,1,1,1,'2025-11-20 01:07:07',225,'pending','[]'),(4,1,1,1,'2025-11-20 01:07:45',225,'pending','[]'),(5,1,1,2,'2025-11-20 01:23:41',127,'pending','[]'),(6,1,2,2,'2025-11-20 16:55:18',237,'approved','[]'),(7,1,5,2,'2025-11-20 18:21:43',60,'approved','[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"]'),(8,1,2,2,'2025-11-21 10:41:43',0,'pending','[]'),(9,1,7,3,'2025-11-21 11:02:32',0,'pending','[]'),(10,1,15,1,'2025-11-21 11:14:23',0,'pending','[{\"RangeId\":7,\"Ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"]]},{\"RangeId\":7,\"Ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"9\",\"9\",\"9\",\"9\",\"9\",\"9\"],[\"7\",\"8\",\"7\",\"5\",\"4\",\"5\"],[\"5\",\"6\",\"4\",\"6\",\"6\",\"2\"],[\"X\",\"X\",\"X\",\"M\",\"M\",\"M\"],[\"3\",\"4\",\"7\",\"8\",\"4\",\"5\"]]}]'),(11,1,23,2,'2025-11-21 11:31:44',720,'approved','[{\"rangeId\":7,\"ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"]]},{\"rangeId\":7,\"ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"]]}]');
/*!40000 ALTER TABLE `stagingscore` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-21 11:33:00
