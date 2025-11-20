-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: archery
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `roundrange`
--

DROP TABLE IF EXISTS `roundrange`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roundrange` (
  `id` int NOT NULL AUTO_INCREMENT,
  `round_id` int NOT NULL,
  `range_id` int NOT NULL,
  `sequence_number` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `round_id` (`round_id`),
  KEY `range_id` (`range_id`),
  CONSTRAINT `roundrange_ibfk_1` FOREIGN KEY (`round_id`) REFERENCES `round` (`round_id`),
  CONSTRAINT `roundrange_ibfk_2` FOREIGN KEY (`range_id`) REFERENCES `range` (`range_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roundrange`
--

LOCK TABLES `roundrange` WRITE;
/*!40000 ALTER TABLE `roundrange` DISABLE KEYS */;
INSERT INTO `roundrange` VALUES (1,1,7,1),(2,1,7,2),(3,2,6,1),(4,2,5,2),(5,2,4,3),(6,3,8,1),(7,3,7,2),(8,3,5,3),(9,3,3,4),(10,4,7,1),(11,4,6,2),(12,4,5,3),(13,4,3,4),(14,5,6,1),(15,5,5,2),(16,5,4,3),(17,5,3,4),(18,6,5,1),(19,6,4,2),(20,6,3,3),(21,6,2,4),(22,7,4,1),(23,7,3,2),(24,7,2,3),(25,7,2,4),(26,8,3,1),(27,8,2,2),(28,8,2,3),(29,8,2,4),(30,9,1,1),(31,10,5,1),(32,10,4,2),(33,10,3,3),(34,11,6,1),(35,11,5,2),(36,11,4,3),(37,12,8,1),(38,12,7,2),(39,12,5,3);
/*!40000 ALTER TABLE `roundrange` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-20 11:01:03
