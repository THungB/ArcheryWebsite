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
  `range_id` int NOT NULL,
  `end_number` int NOT NULL,
  `end_score` int NOT NULL,
  `round_range_id` int DEFAULT NULL,
  PRIMARY KEY (`end_id`),
  KEY `score_id` (`score_id`),
  KEY `range_id` (`range_id`),
  KEY `fk_end_roundrange` (`round_range_id`),
  CONSTRAINT `end_ibfk_1` FOREIGN KEY (`score_id`) REFERENCES `score` (`score_id`),
  CONSTRAINT `end_ibfk_2` FOREIGN KEY (`range_id`) REFERENCES `range` (`range_id`),
  CONSTRAINT `fk_end_roundrange` FOREIGN KEY (`round_range_id`) REFERENCES `roundrange` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `end`
--

LOCK TABLES `end` WRITE;
/*!40000 ALTER TABLE `end` DISABLE KEYS */;
INSERT INTO `end` VALUES (1,4,7,1,60,NULL),(2,4,7,2,60,NULL),(3,4,7,3,60,NULL),(4,4,7,4,60,NULL),(5,4,7,5,60,NULL),(6,4,7,6,60,NULL),(7,4,7,1,60,NULL),(8,4,7,2,60,NULL),(9,4,7,3,60,NULL),(10,4,7,4,60,NULL),(11,4,7,5,60,NULL),(12,4,7,6,60,NULL),(13,7,8,1,37,6),(14,7,8,2,57,6),(15,7,8,3,31,6),(16,7,8,4,54,6),(17,7,8,5,29,6),(18,7,8,6,54,6),(19,7,7,1,42,7),(20,7,7,2,28,7),(21,7,7,3,30,7),(22,7,7,4,34,7),(23,7,7,5,42,7),(24,7,7,6,42,7),(25,7,5,1,57,8),(26,7,5,2,28,8),(27,7,5,3,48,8),(28,7,5,4,48,8),(29,7,5,5,41,8),(30,7,5,6,40,8),(31,7,3,1,41,9),(32,7,3,2,22,9),(33,7,3,3,34,9),(34,7,3,4,41,9),(35,7,3,5,24,9),(36,7,3,6,54,9),(37,8,5,1,60,31),(38,8,5,2,60,31),(39,8,5,3,30,31),(40,8,5,4,39,31),(41,8,5,5,16,31),(42,8,5,6,23,31),(43,8,4,1,38,32),(44,8,4,2,34,32),(45,8,4,3,60,32),(46,8,4,4,60,32),(47,8,4,5,60,32),(48,8,4,6,19,32),(49,8,3,1,60,33),(50,8,3,2,30,33),(51,8,3,3,39,33),(52,8,3,4,37,33),(53,8,3,5,40,33),(54,8,3,6,29,33);
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

-- Dump completed on 2025-11-21 18:16:48
