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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stagingscore`
--

LOCK TABLES `stagingscore` WRITE;
/*!40000 ALTER TABLE `stagingscore` DISABLE KEYS */;
INSERT INTO `stagingscore` VALUES (1,1,1,1,'2025-11-21 20:25:52',560,'pending','[\n    {\n        \"rangeId\": 1,\n        \"ends\": [\n            [\"10\", \"9\", \"9\", \"8\", \"8\", \"7\"],\n            [\"X\", \"10\", \"9\", \"9\", \"8\", \"8\"],\n            [\"10\", \"10\", \"9\", \"8\", \"7\", \"6\"],\n            [\"9\", \"9\", \"8\", \"8\", \"7\", \"7\"],\n            [\"X\", \"X\", \"10\", \"9\", \"9\", \"8\"],\n            [\"10\", \"9\", \"8\", \"7\", \"6\", \"M\"]\n        ]\n    }\n]'),(2,2,1,1,'2025-11-21 19:25:52',620,'pending','[\n    {\n        \"rangeId\": 1,\n        \"ends\": [\n            [\"X\", \"10\", \"10\", \"9\", \"9\", \"9\"],\n            [\"10\", \"10\", \"9\", \"9\", \"9\", \"8\"],\n            [\"X\", \"X\", \"10\", \"10\", \"9\", \"9\"],\n            [\"10\", \"9\", \"9\", \"8\", \"8\", \"8\"],\n            [\"X\", \"10\", \"10\", \"10\", \"9\", \"9\"],\n            [\"10\", \"10\", \"9\", \"9\", \"9\", \"9\"]\n        ]\n    }\n]'),(3,3,2,2,'2025-11-20 20:25:52',150,'rejected','[]');
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

-- Dump completed on 2025-11-21 20:28:35
