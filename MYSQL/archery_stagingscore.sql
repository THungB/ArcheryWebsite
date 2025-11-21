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
-- Table structure for table `stagingscore`
--

DROP TABLE IF EXISTS `stagingscore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stagingscore` (
  `staging_id` int NOT NULL AUTO_INCREMENT,
  `archer_id` int NOT NULL,
  `round_id` int NOT NULL,
  `equipment_id` int NOT NULL,
  `date_time` datetime NOT NULL,
  `raw_score` int NOT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `arrow_values` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`staging_id`),
  KEY `archer_id` (`archer_id`),
  KEY `round_id` (`round_id`),
  KEY `equipment_id` (`equipment_id`),
  CONSTRAINT `stagingscore_ibfk_1` FOREIGN KEY (`archer_id`) REFERENCES `archer` (`archer_id`),
  CONSTRAINT `stagingscore_ibfk_2` FOREIGN KEY (`round_id`) REFERENCES `round` (`round_id`),
  CONSTRAINT `stagingscore_ibfk_3` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stagingscore`
--

LOCK TABLES `stagingscore` WRITE;
/*!40000 ALTER TABLE `stagingscore` DISABLE KEYS */;
INSERT INTO `stagingscore` VALUES (1,1,1,1,'2025-11-20 01:04:46',225,'approved','[]'),(2,1,1,1,'2025-11-20 01:07:06',225,'pending','[]'),(3,1,1,1,'2025-11-20 01:07:07',225,'pending','[]'),(4,1,1,1,'2025-11-20 01:07:45',225,'pending','[]'),(5,1,1,2,'2025-11-20 01:23:41',127,'pending','[]'),(6,1,2,2,'2025-11-20 16:55:18',237,'approved','[]'),(7,1,5,2,'2025-11-20 18:21:43',60,'approved','[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"]'),(8,1,2,2,'2025-11-21 10:41:43',0,'pending','[]'),(9,1,7,3,'2025-11-21 11:02:32',0,'pending','[]'),(10,1,15,1,'2025-11-21 11:14:23',0,'pending','[{\"RangeId\":7,\"Ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"]]},{\"RangeId\":7,\"Ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"9\",\"9\",\"9\",\"9\",\"9\",\"9\"],[\"7\",\"8\",\"7\",\"5\",\"4\",\"5\"],[\"5\",\"6\",\"4\",\"6\",\"6\",\"2\"],[\"X\",\"X\",\"X\",\"M\",\"M\",\"M\"],[\"3\",\"4\",\"7\",\"8\",\"4\",\"5\"]]}]'),(11,1,23,2,'2025-11-21 11:31:44',720,'approved','[{\"rangeId\":7,\"ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"]]},{\"rangeId\":7,\"ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"]]}]'),(12,1,3,2,'2025-11-21 11:55:07',958,'approved','[{\"rangeId\":8,\"ends\":[[\"X\",\"M\",\"0\",\"9\",\"9\",\"9\"],[\"9\",\"9\",\"9\",\"X\",\"X\",\"X\"],[\"6\",\"6\",\"6\",\"7\",\"4\",\"2\"],[\"X\",\"8\",\"X\",\"8\",\"8\",\"X\"],[\"M\",\"2\",\"4\",\"9\",\"X\",\"4\"],[\"9\",\"9\",\"9\",\"9\",\"9\",\"9\"]]},{\"rangeId\":7,\"ends\":[[\"9\",\"9\",\"6\",\"X\",\"8\",\"M\"],[\"M\",\"X\",\"M\",\"9\",\"M\",\"9\"],[\"3\",\"3\",\"8\",\"6\",\"4\",\"6\"],[\"7\",\"5\",\"8\",\"5\",\"3\",\"6\"],[\"8\",\"4\",\"5\",\"5\",\"X\",\"X\"],[\"8\",\"4\",\"9\",\"5\",\"6\",\"X\"]]},{\"rangeId\":5,\"ends\":[[\"X\",\"X\",\"X\",\"X\",\"7\",\"X\"],[\"M\",\"M\",\"M\",\"X\",\"9\",\"9\"],[\"8\",\"8\",\"8\",\"8\",\"8\",\"8\"],[\"8\",\"8\",\"8\",\"8\",\"8\",\"8\"],[\"6\",\"7\",\"7\",\"7\",\"7\",\"7\"],[\"X\",\"X\",\"X\",\"X\",\"M\",\"M\"]]},{\"rangeId\":3,\"ends\":[[\"M\",\"X\",\"X\",\"X\",\"7\",\"4\"],[\"8\",\"6\",\"3\",\"2\",\"1\",\"2\"],[\"7\",\"8\",\"8\",\"4\",\"3\",\"4\"],[\"7\",\"X\",\"7\",\"X\",\"7\",\"M\"],[\"7\",\"5\",\"4\",\"3\",\"2\",\"3\"],[\"8\",\"8\",\"8\",\"X\",\"X\",\"X\"]]}]'),(13,1,10,5,'2025-11-21 14:27:14',734,'approved','[{\"rangeId\":5,\"ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"M\",\"7\",\"8\",\"9\",\"4\",\"2\"],[\"X\",\"4\",\"5\",\"M\",\"X\",\"X\"],[\"4\",\"4\",\"3\",\"2\",\"2\",\"1\"],[\"4\",\"5\",\"3\",\"4\",\"3\",\"4\"]]},{\"rangeId\":4,\"ends\":[[\"6\",\"3\",\"X\",\"X\",\"M\",\"9\"],[\"X\",\"2\",\"4\",\"6\",\"7\",\"5\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"3\",\"4\",\"3\",\"2\",\"3\",\"4\"]]},{\"rangeId\":3,\"ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"8\",\"4\",\"6\",\"4\",\"3\",\"5\"],[\"2\",\"7\",\"X\",\"M\",\"X\",\"X\"],[\"7\",\"8\",\"8\",\"X\",\"M\",\"4\"],[\"X\",\"9\",\"6\",\"5\",\"4\",\"6\"],[\"7\",\"5\",\"5\",\"4\",\"4\",\"4\"]]}]');
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

-- Dump completed on 2025-11-21 18:16:49
