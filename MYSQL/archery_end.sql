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
-- Table structure for table `end`
--

DROP TABLE IF EXISTS `end`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `end` (
  `end_id` int NOT NULL AUTO_INCREMENT,
  `score_id` int NOT NULL,
  `end_number` int NOT NULL,
  `end_score` int NOT NULL,
  `round_range_id` int DEFAULT NULL,
  `range_id` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`end_id`),
  KEY `score_id` (`score_id`),
  KEY `fk_end_roundrange` (`round_range_id`),
  KEY `end_ibfk_2` (`range_id`),
  CONSTRAINT `end_ibfk_1` FOREIGN KEY (`score_id`) REFERENCES `score` (`score_id`),
  CONSTRAINT `end_ibfk_2` FOREIGN KEY (`range_id`) REFERENCES `range` (`range_id`),
  CONSTRAINT `fk_end_roundrange` FOREIGN KEY (`round_range_id`) REFERENCES `roundrange` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `end`
--

LOCK TABLES `end` WRITE;
/*!40000 ALTER TABLE `end` DISABLE KEYS */;
INSERT INTO `end` VALUES (1,1,1,56,1,1),(2,1,2,54,1,1),(3,1002,1,57,1,1),(4,1002,2,55,1,1),(5,1002,3,58,1,1),(6,1002,4,52,1,1),(7,1002,5,58,1,1),(8,1002,6,56,1,1),(9,1003,1,51,1,1),(10,1003,2,54,1,1),(11,1003,3,50,1,1),(12,1003,4,48,1,1),(13,1003,5,56,1,1),(14,1003,6,40,1,1),(15,1004,1,60,1,1),(16,1004,2,60,1,1),(17,1004,3,60,1,1),(18,1004,4,45,1,1),(19,1004,5,42,1,1),(20,1004,6,44,1,1),(21,1004,1,48,2,2),(22,1004,2,40,2,2),(23,1004,3,42,2,2),(24,1004,4,41,2,2),(25,1004,5,38,2,2),(26,1004,6,39,2,2);
/*!40000 ALTER TABLE `end` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-21 22:44:26
