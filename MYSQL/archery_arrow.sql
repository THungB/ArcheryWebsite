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
-- Table structure for table `arrow`
--

DROP TABLE IF EXISTS `arrow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arrow` (
  `arrow_id` int NOT NULL AUTO_INCREMENT,
  `end_id` int NOT NULL,
  `arrow_value` int NOT NULL,
  `is_x` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`arrow_id`),
  KEY `end_id` (`end_id`),
  CONSTRAINT `arrow_ibfk_1` FOREIGN KEY (`end_id`) REFERENCES `end` (`end_id`),
  CONSTRAINT `arrow_chk_1` CHECK ((`arrow_value` between 0 and 10))
) ENGINE=InnoDB AUTO_INCREMENT=325 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arrow`
--

LOCK TABLES `arrow` WRITE;
/*!40000 ALTER TABLE `arrow` DISABLE KEYS */;
INSERT INTO `arrow` VALUES (1,1,10,_binary '\0'),(2,1,10,_binary '\0'),(3,1,10,_binary '\0'),(4,1,10,_binary '\0'),(5,1,10,_binary '\0'),(6,1,10,_binary '\0'),(7,2,10,_binary '\0'),(8,2,10,_binary '\0'),(9,2,10,_binary '\0'),(10,2,10,_binary '\0'),(11,2,10,_binary '\0'),(12,2,10,_binary '\0'),(13,3,10,_binary '\0'),(14,3,10,_binary '\0'),(15,3,10,_binary '\0'),(16,3,10,_binary '\0'),(17,3,10,_binary '\0'),(18,3,10,_binary '\0'),(19,4,10,_binary '\0'),(20,4,10,_binary '\0'),(21,4,10,_binary '\0'),(22,4,10,_binary '\0'),(23,4,10,_binary '\0'),(24,4,10,_binary '\0'),(25,5,10,_binary '\0'),(26,5,10,_binary '\0'),(27,5,10,_binary '\0'),(28,5,10,_binary '\0'),(29,5,10,_binary '\0'),(30,5,10,_binary '\0'),(31,6,10,_binary '\0'),(32,6,10,_binary '\0'),(33,6,10,_binary '\0'),(34,6,10,_binary '\0'),(35,6,10,_binary '\0'),(36,6,10,_binary '\0'),(37,7,10,_binary '\0'),(38,7,10,_binary '\0'),(39,7,10,_binary '\0'),(40,7,10,_binary '\0'),(41,7,10,_binary '\0'),(42,7,10,_binary '\0'),(43,8,10,_binary '\0'),(44,8,10,_binary '\0'),(45,8,10,_binary '\0'),(46,8,10,_binary '\0'),(47,8,10,_binary '\0'),(48,8,10,_binary '\0'),(49,9,10,_binary '\0'),(50,9,10,_binary '\0'),(51,9,10,_binary '\0'),(52,9,10,_binary '\0'),(53,9,10,_binary '\0'),(54,9,10,_binary '\0'),(55,10,10,_binary '\0'),(56,10,10,_binary '\0'),(57,10,10,_binary '\0'),(58,10,10,_binary '\0'),(59,10,10,_binary '\0'),(60,10,10,_binary '\0'),(61,11,10,_binary '\0'),(62,11,10,_binary '\0'),(63,11,10,_binary '\0'),(64,11,10,_binary '\0'),(65,11,10,_binary '\0'),(66,11,10,_binary '\0'),(67,12,10,_binary '\0'),(68,12,10,_binary '\0'),(69,12,10,_binary '\0'),(70,12,10,_binary '\0'),(71,12,10,_binary '\0'),(72,12,10,_binary '\0'),(73,13,10,_binary ''),(74,13,0,_binary '\0'),(75,13,0,_binary '\0'),(76,13,9,_binary '\0'),(77,13,9,_binary '\0'),(78,13,9,_binary '\0'),(79,14,9,_binary '\0'),(80,14,9,_binary '\0'),(81,14,9,_binary '\0'),(82,14,10,_binary ''),(83,14,10,_binary ''),(84,14,10,_binary ''),(85,15,6,_binary '\0'),(86,15,6,_binary '\0'),(87,15,6,_binary '\0'),(88,15,7,_binary '\0'),(89,15,4,_binary '\0'),(90,15,2,_binary '\0'),(91,16,10,_binary ''),(92,16,8,_binary '\0'),(93,16,10,_binary ''),(94,16,8,_binary '\0'),(95,16,8,_binary '\0'),(96,16,10,_binary ''),(97,17,0,_binary '\0'),(98,17,2,_binary '\0'),(99,17,4,_binary '\0'),(100,17,9,_binary '\0'),(101,17,10,_binary ''),(102,17,4,_binary '\0'),(103,18,9,_binary '\0'),(104,18,9,_binary '\0'),(105,18,9,_binary '\0'),(106,18,9,_binary '\0'),(107,18,9,_binary '\0'),(108,18,9,_binary '\0'),(109,19,9,_binary '\0'),(110,19,9,_binary '\0'),(111,19,6,_binary '\0'),(112,19,10,_binary ''),(113,19,8,_binary '\0'),(114,19,0,_binary '\0'),(115,20,0,_binary '\0'),(116,20,10,_binary ''),(117,20,0,_binary '\0'),(118,20,9,_binary '\0'),(119,20,0,_binary '\0'),(120,20,9,_binary '\0'),(121,21,3,_binary '\0'),(122,21,3,_binary '\0'),(123,21,8,_binary '\0'),(124,21,6,_binary '\0'),(125,21,4,_binary '\0'),(126,21,6,_binary '\0'),(127,22,7,_binary '\0'),(128,22,5,_binary '\0'),(129,22,8,_binary '\0'),(130,22,5,_binary '\0'),(131,22,3,_binary '\0'),(132,22,6,_binary '\0'),(133,23,8,_binary '\0'),(134,23,4,_binary '\0'),(135,23,5,_binary '\0'),(136,23,5,_binary '\0'),(137,23,10,_binary ''),(138,23,10,_binary ''),(139,24,8,_binary '\0'),(140,24,4,_binary '\0'),(141,24,9,_binary '\0'),(142,24,5,_binary '\0'),(143,24,6,_binary '\0'),(144,24,10,_binary ''),(145,25,10,_binary ''),(146,25,10,_binary ''),(147,25,10,_binary ''),(148,25,10,_binary ''),(149,25,7,_binary '\0'),(150,25,10,_binary ''),(151,26,0,_binary '\0'),(152,26,0,_binary '\0'),(153,26,0,_binary '\0'),(154,26,10,_binary ''),(155,26,9,_binary '\0'),(156,26,9,_binary '\0'),(157,27,8,_binary '\0'),(158,27,8,_binary '\0'),(159,27,8,_binary '\0'),(160,27,8,_binary '\0'),(161,27,8,_binary '\0'),(162,27,8,_binary '\0'),(163,28,8,_binary '\0'),(164,28,8,_binary '\0'),(165,28,8,_binary '\0'),(166,28,8,_binary '\0'),(167,28,8,_binary '\0'),(168,28,8,_binary '\0'),(169,29,6,_binary '\0'),(170,29,7,_binary '\0'),(171,29,7,_binary '\0'),(172,29,7,_binary '\0'),(173,29,7,_binary '\0'),(174,29,7,_binary '\0'),(175,30,10,_binary ''),(176,30,10,_binary ''),(177,30,10,_binary ''),(178,30,10,_binary ''),(179,30,0,_binary '\0'),(180,30,0,_binary '\0'),(181,31,0,_binary '\0'),(182,31,10,_binary ''),(183,31,10,_binary ''),(184,31,10,_binary ''),(185,31,7,_binary '\0'),(186,31,4,_binary '\0'),(187,32,8,_binary '\0'),(188,32,6,_binary '\0'),(189,32,3,_binary '\0'),(190,32,2,_binary '\0'),(191,32,1,_binary '\0'),(192,32,2,_binary '\0'),(193,33,7,_binary '\0'),(194,33,8,_binary '\0'),(195,33,8,_binary '\0'),(196,33,4,_binary '\0'),(197,33,3,_binary '\0'),(198,33,4,_binary '\0'),(199,34,7,_binary '\0'),(200,34,10,_binary ''),(201,34,7,_binary '\0'),(202,34,10,_binary ''),(203,34,7,_binary '\0'),(204,34,0,_binary '\0'),(205,35,7,_binary '\0'),(206,35,5,_binary '\0'),(207,35,4,_binary '\0'),(208,35,3,_binary '\0'),(209,35,2,_binary '\0'),(210,35,3,_binary '\0'),(211,36,8,_binary '\0'),(212,36,8,_binary '\0'),(213,36,8,_binary '\0'),(214,36,10,_binary ''),(215,36,10,_binary ''),(216,36,10,_binary ''),(217,37,10,_binary ''),(218,37,10,_binary ''),(219,37,10,_binary ''),(220,37,10,_binary ''),(221,37,10,_binary ''),(222,37,10,_binary ''),(223,38,10,_binary ''),(224,38,10,_binary ''),(225,38,10,_binary ''),(226,38,10,_binary ''),(227,38,10,_binary ''),(228,38,10,_binary ''),(229,39,9,_binary '\0'),(230,39,8,_binary '\0'),(231,39,7,_binary '\0'),(232,39,4,_binary '\0'),(233,39,2,_binary '\0'),(234,39,0,_binary '\0'),(235,40,10,_binary ''),(236,40,10,_binary ''),(237,40,10,_binary ''),(238,40,5,_binary '\0'),(239,40,4,_binary '\0'),(240,40,0,_binary '\0'),(241,41,4,_binary '\0'),(242,41,4,_binary '\0'),(243,41,3,_binary '\0'),(244,41,2,_binary '\0'),(245,41,2,_binary '\0'),(246,41,1,_binary '\0'),(247,42,5,_binary '\0'),(248,42,4,_binary '\0'),(249,42,4,_binary '\0'),(250,42,4,_binary '\0'),(251,42,3,_binary '\0'),(252,42,3,_binary '\0'),(253,43,10,_binary ''),(254,43,10,_binary ''),(255,43,9,_binary '\0'),(256,43,6,_binary '\0'),(257,43,3,_binary '\0'),(258,43,0,_binary '\0'),(259,44,10,_binary ''),(260,44,7,_binary '\0'),(261,44,6,_binary '\0'),(262,44,5,_binary '\0'),(263,44,4,_binary '\0'),(264,44,2,_binary '\0'),(265,45,10,_binary ''),(266,45,10,_binary ''),(267,45,10,_binary ''),(268,45,10,_binary ''),(269,45,10,_binary ''),(270,45,10,_binary ''),(271,46,10,_binary ''),(272,46,10,_binary ''),(273,46,10,_binary ''),(274,46,10,_binary ''),(275,46,10,_binary ''),(276,46,10,_binary ''),(277,47,10,_binary ''),(278,47,10,_binary ''),(279,47,10,_binary ''),(280,47,10,_binary ''),(281,47,10,_binary ''),(282,47,10,_binary ''),(283,48,4,_binary '\0'),(284,48,4,_binary '\0'),(285,48,3,_binary '\0'),(286,48,3,_binary '\0'),(287,48,3,_binary '\0'),(288,48,2,_binary '\0'),(289,49,10,_binary ''),(290,49,10,_binary ''),(291,49,10,_binary ''),(292,49,10,_binary ''),(293,49,10,_binary ''),(294,49,10,_binary ''),(295,50,8,_binary '\0'),(296,50,6,_binary '\0'),(297,50,5,_binary '\0'),(298,50,4,_binary '\0'),(299,50,4,_binary '\0'),(300,50,3,_binary '\0'),(301,51,10,_binary ''),(302,51,10,_binary ''),(303,51,10,_binary ''),(304,51,7,_binary '\0'),(305,51,2,_binary '\0'),(306,51,0,_binary '\0'),(307,52,10,_binary ''),(308,52,8,_binary '\0'),(309,52,8,_binary '\0'),(310,52,7,_binary '\0'),(311,52,4,_binary '\0'),(312,52,0,_binary '\0'),(313,53,10,_binary ''),(314,53,9,_binary '\0'),(315,53,6,_binary '\0'),(316,53,6,_binary '\0'),(317,53,5,_binary '\0'),(318,53,4,_binary '\0'),(319,54,7,_binary '\0'),(320,54,5,_binary '\0'),(321,54,5,_binary '\0'),(322,54,4,_binary '\0'),(323,54,4,_binary '\0'),(324,54,4,_binary '\0');
/*!40000 ALTER TABLE `arrow` ENABLE KEYS */;
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
