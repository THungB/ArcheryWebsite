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
-- Table structure for table `round`
--

DROP TABLE IF EXISTS `round`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `round` (
  `round_id` int NOT NULL AUTO_INCREMENT,
  `round_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`round_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `round`
--

LOCK TABLES `round` WRITE;
/*!40000 ALTER TABLE `round` DISABLE KEYS */;
INSERT INTO `round` VALUES (1,'WA720','Two ranges of 6 ends at one distance'),(2,'WA900','60m, 50m, 40m – 5 ends each'),(3,'WA1440','90m, 70m, 50m, 30m'),(4,'Metric I','70m, 60m, 50m, 30m'),(5,'Metric II','60m, 50m, 40m, 30m'),(6,'Metric III','50m, 40m, 30m, 20m'),(7,'Metric IV','40m, 30m, 20m, 10m'),(8,'Metric V','30m, 20m, 15m, 10m'),(9,'Indoor18','18m indoor round'),(10,'Short Canberra','50m, 40m, 30m'),(11,'Canberra','60m, 50m, 40m'),(12,'Long Canberra','90m, 70m, 50m'),(13,'WA720','70m Outdoor Round'),(14,'WA900','60m, 50m, 40m – 5 ends each'),(15,'WA1440','90m, 70m, 50m, 30m'),(16,'Metric I','70m, 60m, 50m, 30m'),(17,'Metric II','60m, 50m, 40m, 30m'),(18,'Metric III','50m, 40m, 30m, 20m'),(19,'Metric IV','40m, 30m, 20m, 10m'),(20,'Metric V','30m, 20m, 15m, 10m'),(21,'Indoor18','18m indoor round'),(22,'Short Canberra','50m, 40m, 30m'),(23,'Canberra','60m, 50m, 40m'),(24,'Long Canberra','90m, 70m, 50m');
/*!40000 ALTER TABLE `round` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-20 11:01:04
