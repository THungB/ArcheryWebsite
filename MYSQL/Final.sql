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
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory` VALUES ('20251120034023_AddArcherNewColumns','9.0.0'),('20251121131321_AddSystemLogs','9.0.0'),('20251121143355_UpdateCompetitionDetails','9.0.0');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archer`
--

DROP TABLE IF EXISTS `archer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `archer` (
  `archer_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('Male','Female','Other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_equipment_id` int NOT NULL DEFAULT '1',
  `user_id` int DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`archer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archer`
--

LOCK TABLES `archer` WRITE;
/*!40000 ALTER TABLE `archer` DISABLE KEYS */;
INSERT INTO `archer` VALUES (1,'Nguyen','Van A','Male','1995-05-15','a.nguyen@email.com',1,NULL,NULL),(2,'Tran','Thi B','Female','2005-08-20','b.tran@email.com',1,NULL,NULL),(3,'Le','Van C','Male','1970-01-10','c.le@email.com',2,NULL,NULL),(4,'Pham','Thi D','Female','2008-11-30','d.pham@email.com',3,NULL,NULL),(5,'Hoang','Van E','Male','1960-03-25','e.hoang@email.com',5,NULL,NULL),(6,'Do','Thi F','Female','2011-06-01','f.do@email.com',1,NULL,NULL),(7,'Vo','Van G','Male','1990-12-12','g.vo@email.com',2,NULL,NULL),(8,'Bui','Thi H','Female','1998-09-09','h.bui@email.com',4,NULL,NULL),(9,'Dang','Van I','Male','2007-02-14','i.dang@email.com',1,NULL,NULL),(10,'Ngo','Thi K','Female','1950-10-20','k.ngo@email.com',5,NULL,NULL);
/*!40000 ALTER TABLE `archer` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arrow`
--

LOCK TABLES `arrow` WRITE;
/*!40000 ALTER TABLE `arrow` DISABLE KEYS */;
INSERT INTO `arrow` VALUES (1,1,10,_binary ''),(2,1,10,_binary '\0'),(3,1,9,_binary '\0'),(4,1,9,_binary '\0'),(5,1,9,_binary '\0'),(6,1,9,_binary '\0'),(7,3,10,_binary ''),(8,3,10,_binary '\0'),(9,3,10,_binary '\0'),(10,3,9,_binary '\0'),(11,3,9,_binary '\0'),(12,3,9,_binary '\0'),(13,4,10,_binary '\0'),(14,4,10,_binary '\0'),(15,4,9,_binary '\0'),(16,4,9,_binary '\0'),(17,4,9,_binary '\0'),(18,4,8,_binary '\0'),(19,5,10,_binary ''),(20,5,10,_binary ''),(21,5,10,_binary '\0'),(22,5,10,_binary '\0'),(23,5,9,_binary '\0'),(24,5,9,_binary '\0'),(25,6,10,_binary '\0'),(26,6,9,_binary '\0'),(27,6,9,_binary '\0'),(28,6,8,_binary '\0'),(29,6,8,_binary '\0'),(30,6,8,_binary '\0'),(31,7,10,_binary ''),(32,7,10,_binary '\0'),(33,7,10,_binary '\0'),(34,7,10,_binary '\0'),(35,7,9,_binary '\0'),(36,7,9,_binary '\0'),(37,8,10,_binary '\0'),(38,8,10,_binary '\0'),(39,8,9,_binary '\0'),(40,8,9,_binary '\0'),(41,8,9,_binary '\0'),(42,8,9,_binary '\0'),(43,9,10,_binary '\0'),(44,9,9,_binary '\0'),(45,9,9,_binary '\0'),(46,9,8,_binary '\0'),(47,9,8,_binary '\0'),(48,9,7,_binary '\0'),(49,10,10,_binary ''),(50,10,10,_binary '\0'),(51,10,9,_binary '\0'),(52,10,9,_binary '\0'),(53,10,8,_binary '\0'),(54,10,8,_binary '\0'),(55,11,10,_binary '\0'),(56,11,10,_binary '\0'),(57,11,9,_binary '\0'),(58,11,8,_binary '\0'),(59,11,7,_binary '\0'),(60,11,6,_binary '\0'),(61,12,9,_binary '\0'),(62,12,9,_binary '\0'),(63,12,8,_binary '\0'),(64,12,8,_binary '\0'),(65,12,7,_binary '\0'),(66,12,7,_binary '\0'),(67,13,10,_binary ''),(68,13,10,_binary ''),(69,13,10,_binary '\0'),(70,13,9,_binary '\0'),(71,13,9,_binary '\0'),(72,13,8,_binary '\0'),(73,14,10,_binary '\0'),(74,14,9,_binary '\0'),(75,14,8,_binary '\0'),(76,14,7,_binary '\0'),(77,14,6,_binary '\0'),(78,14,0,_binary '\0'),(79,15,10,_binary ''),(80,15,10,_binary ''),(81,15,10,_binary ''),(82,15,10,_binary ''),(83,15,10,_binary ''),(84,15,10,_binary ''),(85,16,10,_binary ''),(86,16,10,_binary ''),(87,16,10,_binary ''),(88,16,10,_binary ''),(89,16,10,_binary ''),(90,16,10,_binary ''),(91,17,10,_binary ''),(92,17,10,_binary ''),(93,17,10,_binary ''),(94,17,10,_binary ''),(95,17,10,_binary ''),(96,17,10,_binary ''),(97,18,9,_binary '\0'),(98,18,8,_binary '\0'),(99,18,8,_binary '\0'),(100,18,7,_binary '\0'),(101,18,7,_binary '\0'),(102,18,6,_binary '\0'),(103,19,10,_binary ''),(104,19,8,_binary '\0'),(105,19,8,_binary '\0'),(106,19,8,_binary '\0'),(107,19,8,_binary '\0'),(108,19,0,_binary '\0'),(109,20,9,_binary '\0'),(110,20,8,_binary '\0'),(111,20,8,_binary '\0'),(112,20,7,_binary '\0'),(113,20,6,_binary '\0'),(114,20,6,_binary '\0'),(115,21,10,_binary ''),(116,21,10,_binary ''),(117,21,8,_binary '\0'),(118,21,8,_binary '\0'),(119,21,7,_binary '\0'),(120,21,5,_binary '\0'),(121,22,9,_binary '\0'),(122,22,8,_binary '\0'),(123,22,7,_binary '\0'),(124,22,6,_binary '\0'),(125,22,5,_binary '\0'),(126,22,5,_binary '\0'),(127,23,7,_binary '\0'),(128,23,7,_binary '\0'),(129,23,7,_binary '\0'),(130,23,7,_binary '\0'),(131,23,7,_binary '\0'),(132,23,7,_binary '\0'),(133,24,9,_binary '\0'),(134,24,8,_binary '\0'),(135,24,7,_binary '\0'),(136,24,6,_binary '\0'),(137,24,6,_binary '\0'),(138,24,5,_binary '\0'),(139,25,9,_binary '\0'),(140,25,7,_binary '\0'),(141,25,6,_binary '\0'),(142,25,6,_binary '\0'),(143,25,5,_binary '\0'),(144,25,5,_binary '\0'),(145,26,9,_binary '\0'),(146,26,7,_binary '\0'),(147,26,6,_binary '\0'),(148,26,6,_binary '\0'),(149,26,6,_binary '\0'),(150,26,5,_binary '\0'),(151,57,10,_binary ''),(152,57,10,_binary ''),(153,57,10,_binary ''),(154,57,10,_binary ''),(155,57,10,_binary ''),(156,57,10,_binary ''),(157,58,9,_binary '\0'),(158,58,8,_binary '\0'),(159,58,7,_binary '\0'),(160,58,7,_binary '\0'),(161,58,6,_binary '\0'),(162,58,5,_binary '\0'),(163,59,9,_binary '\0'),(164,59,9,_binary '\0'),(165,59,8,_binary '\0'),(166,59,8,_binary '\0'),(167,59,7,_binary '\0'),(168,59,6,_binary '\0'),(169,60,9,_binary '\0'),(170,60,9,_binary '\0'),(171,60,8,_binary '\0'),(172,60,8,_binary '\0'),(173,60,7,_binary '\0'),(174,60,7,_binary '\0'),(175,61,9,_binary '\0'),(176,61,9,_binary '\0'),(177,61,9,_binary '\0'),(178,61,8,_binary '\0'),(179,61,8,_binary '\0'),(180,61,7,_binary '\0'),(181,62,10,_binary ''),(182,62,9,_binary '\0'),(183,62,8,_binary '\0'),(184,62,7,_binary '\0'),(185,62,0,_binary '\0'),(186,62,0,_binary '\0'),(187,63,8,_binary '\0'),(188,63,8,_binary '\0'),(189,63,7,_binary '\0'),(190,63,7,_binary '\0'),(191,63,7,_binary '\0'),(192,63,6,_binary '\0'),(193,64,10,_binary ''),(194,64,10,_binary ''),(195,64,10,_binary ''),(196,64,10,_binary ''),(197,64,10,_binary ''),(198,64,10,_binary ''),(199,65,9,_binary '\0'),(200,65,7,_binary '\0'),(201,65,6,_binary '\0'),(202,65,6,_binary '\0'),(203,65,5,_binary '\0'),(204,65,4,_binary '\0'),(205,66,9,_binary '\0'),(206,66,9,_binary '\0'),(207,66,8,_binary '\0'),(208,66,7,_binary '\0'),(209,66,6,_binary '\0'),(210,66,5,_binary '\0'),(211,67,9,_binary '\0'),(212,67,8,_binary '\0'),(213,67,8,_binary '\0'),(214,67,7,_binary '\0'),(215,67,7,_binary '\0'),(216,67,6,_binary '\0'),(217,68,9,_binary '\0'),(218,68,8,_binary '\0'),(219,68,8,_binary '\0'),(220,68,6,_binary '\0'),(221,68,6,_binary '\0'),(222,68,5,_binary '\0');
/*!40000 ALTER TABLE `arrow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competition`
--

DROP TABLE IF EXISTS `competition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competition` (
  `comp_id` int NOT NULL AUTO_INCREMENT,
  `comp_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_club_championship` tinyint(1) NOT NULL DEFAULT '0',
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `location` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`comp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competition`
--

LOCK TABLES `competition` WRITE;
/*!40000 ALTER TABLE `competition` DISABLE KEYS */;
INSERT INTO `competition` VALUES (1,'Summer Club Championship 2024','2024-06-15','2024-06-16',1,NULL,NULL),(2,'Weekly Shoot Nov Week 1','2024-11-01','2024-11-01',0,NULL,NULL),(101,'Spring Opening Shoot 2025','2025-12-01','2025-12-03',0,NULL,NULL),(102,'National Qualification Round','2025-11-19','2025-11-23',1,NULL,NULL),(103,'Winter Club Championship 2024','2024-12-15','2024-12-16',1,NULL,NULL),(104,'Verified Test','2025-10-30','2025-11-30',1,'{\"rounds\":[1],\"divisions\":[\"Compound\",\"Barebow Recurve\"],\"classes\":[\"60\\u002B\",\"50\\u002B\",\"Open\"]}','123 Ngo Quyen Da Nang'),(105,'Testing','2025-11-15','2025-11-30',1,'{\"rounds\":[2,1],\"divisions\":[\"Compound Barebow\",\"Recurve Barebow\"],\"classes\":[\"Open\"]}','100 Lê Thánh Tôn '),(106,'Hi','2025-11-11','2025-12-04',0,'{\"rounds\":[1,2,4],\"divisions\":[\"Compound\",\"Compound Barebow\"],\"classes\":[\"Open\"]}',''),(107,'Autumn Opening Shoot 2025','2025-09-10','2025-09-12',0,'{\"rounds\":[1, 3]}','San van dong A'),(108,'September Ranking Round','2025-09-25','2025-09-26',1,'{\"rounds\":[1, 2]}','CLB Banh Mui Ten'),(109,'October Halloween Cup','2025-10-30','2025-10-31',0,'{\"rounds\":[3,4],\"divisions\":[],\"classes\":[]}','Cong vien trung tam'),(110,'November Qualification Series','2025-11-05','2025-11-08',1,'{\"rounds\":[1]}','Khu lien hop the thao'),(111,'Late Fall Championship 2025','2025-11-20','2025-11-22',1,'{\"rounds\":[1, 2, 4]}','San tap chinh');
/*!40000 ALTER TABLE `competition` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `end`
--

LOCK TABLES `end` WRITE;
/*!40000 ALTER TABLE `end` DISABLE KEYS */;
INSERT INTO `end` VALUES (1,1,1,56,1,1),(2,1,2,54,1,1),(3,1002,1,57,1,1),(4,1002,2,55,1,1),(5,1002,3,58,1,1),(6,1002,4,52,1,1),(7,1002,5,58,1,1),(8,1002,6,56,1,1),(9,1003,1,51,1,1),(10,1003,2,54,1,1),(11,1003,3,50,1,1),(12,1003,4,48,1,1),(13,1003,5,56,1,1),(14,1003,6,40,1,1),(15,1004,1,60,1,1),(16,1004,2,60,1,1),(17,1004,3,60,1,1),(18,1004,4,45,1,1),(19,1004,5,42,1,1),(20,1004,6,44,1,1),(21,1004,1,48,2,2),(22,1004,2,40,2,2),(23,1004,3,42,2,2),(24,1004,4,41,2,2),(25,1004,5,38,2,2),(26,1004,6,39,2,2),(27,2001,1,52,NULL,1),(28,2001,2,50,NULL,1),(29,2001,3,53,NULL,1),(30,2001,4,51,NULL,1),(31,2001,5,54,NULL,1),(32,2001,6,50,NULL,1),(33,2002,1,54,NULL,1),(34,2002,2,53,NULL,1),(35,2002,3,55,NULL,1),(36,2002,4,52,NULL,1),(37,2002,5,53,NULL,1),(38,2002,6,54,NULL,1),(39,2003,1,55,NULL,1),(40,2003,2,48,NULL,1),(41,2003,3,45,NULL,1),(42,2003,4,50,NULL,1),(43,2003,5,52,NULL,1),(44,2003,6,49,NULL,1),(45,2004,1,56,NULL,1),(46,2004,2,57,NULL,1),(47,2004,3,55,NULL,1),(48,2004,4,54,NULL,1),(49,2004,5,58,NULL,1),(50,2004,6,55,NULL,1),(51,2005,1,57,NULL,1),(52,2005,2,56,NULL,1),(53,2005,3,58,NULL,1),(54,2005,4,55,NULL,1),(55,2005,5,57,NULL,1),(56,2005,6,56,NULL,1),(57,2006,1,60,1,1),(58,2006,2,42,1,1),(59,2006,3,47,1,1),(60,2006,4,48,1,1),(61,2006,5,50,1,1),(62,2006,6,34,1,1),(63,2006,1,43,2,2),(64,2006,2,60,2,2),(65,2006,3,37,2,2),(66,2006,4,44,2,2),(67,2006,5,45,2,2),(68,2006,6,42,2,2);
/*!40000 ALTER TABLE `end` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment` (
  `equipment_id` int NOT NULL AUTO_INCREMENT,
  `division_type` enum('Recurve','Compound','Recurve Barebow','Compound Barebow','Longbow') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`equipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` VALUES (1,'Recurve'),(2,'Compound'),(3,'Recurve Barebow'),(4,'Compound Barebow'),(5,'Longbow');
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `range`
--

DROP TABLE IF EXISTS `range`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `range` (
  `range_id` int NOT NULL AUTO_INCREMENT,
  `distance_meters` int NOT NULL,
  `end_count` int NOT NULL,
  `face_size_cm` int NOT NULL DEFAULT '122',
  PRIMARY KEY (`range_id`),
  CONSTRAINT `range_chk_1` CHECK ((`distance_meters` in (18,20,30,40,50,60,70,90))),
  CONSTRAINT `range_chk_2` CHECK ((`end_count` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `range`
--

LOCK TABLES `range` WRITE;
/*!40000 ALTER TABLE `range` DISABLE KEYS */;
INSERT INTO `range` VALUES (1,70,6,122),(2,70,6,122),(3,50,6,80),(4,30,12,80),(5,60,5,122),(6,50,5,122),(7,40,5,122);
/*!40000 ALTER TABLE `range` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `round`
--

DROP TABLE IF EXISTS `round`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `round` (
  `round_id` int NOT NULL AUTO_INCREMENT,
  `round_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `valid_from` date NOT NULL DEFAULT '2000-01-01',
  `valid_to` date DEFAULT NULL,
  `round_family_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`round_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `round`
--

LOCK TABLES `round` WRITE;
/*!40000 ALTER TABLE `round` DISABLE KEYS */;
INSERT INTO `round` VALUES (1,'WA 70/720','Olympic Recurve Ranking Round','2020-01-01',NULL,'WA720'),(2,'WA 50/720','Compound Ranking Round','2020-01-01',NULL,'WA720'),(3,'Club 30','Beginner Round 30m','2020-01-01',NULL,'CLUB'),(4,'Canberra','90m, 70m, 60m','2020-01-01',NULL,'900');
/*!40000 ALTER TABLE `round` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `round_equivalence`
--

DROP TABLE IF EXISTS `round_equivalence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `round_equivalence` (
  `equivalence_id` int NOT NULL AUTO_INCREMENT,
  `round_id` int NOT NULL,
  `equivalent_round_id` int NOT NULL,
  `valid_from` date NOT NULL DEFAULT '2000-01-01',
  `valid_to` date DEFAULT NULL,
  PRIMARY KEY (`equivalence_id`),
  KEY `FK_RoundEquivalence_Round_Source` (`round_id`),
  KEY `FK_RoundEquivalence_Round_Target` (`equivalent_round_id`),
  CONSTRAINT `FK_RoundEquivalence_Round_Source` FOREIGN KEY (`round_id`) REFERENCES `round` (`round_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_RoundEquivalence_Round_Target` FOREIGN KEY (`equivalent_round_id`) REFERENCES `round` (`round_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `round_equivalence`
--

LOCK TABLES `round_equivalence` WRITE;
/*!40000 ALTER TABLE `round_equivalence` DISABLE KEYS */;
/*!40000 ALTER TABLE `round_equivalence` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roundrange`
--

LOCK TABLES `roundrange` WRITE;
/*!40000 ALTER TABLE `roundrange` DISABLE KEYS */;
INSERT INTO `roundrange` VALUES (1,1,1,1),(2,1,2,2),(3,2,3,1),(4,2,3,2),(5,3,4,1),(6,4,7,3),(7,4,6,2),(8,4,5,1);
/*!40000 ALTER TABLE `roundrange` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `score`
--

DROP TABLE IF EXISTS `score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `score` (
  `score_id` int NOT NULL AUTO_INCREMENT,
  `archer_id` int NOT NULL,
  `round_id` int NOT NULL,
  `comp_id` int DEFAULT NULL,
  `date_shot` date NOT NULL,
  `total_score` int NOT NULL,
  PRIMARY KEY (`score_id`),
  KEY `archer_id` (`archer_id`),
  KEY `round_id` (`round_id`),
  KEY `comp_id` (`comp_id`),
  CONSTRAINT `score_ibfk_1` FOREIGN KEY (`archer_id`) REFERENCES `archer` (`archer_id`),
  CONSTRAINT `score_ibfk_2` FOREIGN KEY (`round_id`) REFERENCES `round` (`round_id`),
  CONSTRAINT `score_ibfk_3` FOREIGN KEY (`comp_id`) REFERENCES `competition` (`comp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2050 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `score`
--

LOCK TABLES `score` WRITE;
/*!40000 ALTER TABLE `score` DISABLE KEYS */;
INSERT INTO `score` VALUES (2,3,2,1,'2024-06-15',680),(3,7,2,1,'2024-06-15',695),(4,2,1,2,'2024-11-01',600),(5,4,3,2,'2024-11-01',300),(1002,2,1,NULL,'2025-11-21',336),(2007,1,1,NULL,'2025-01-10',610),(2008,1,1,NULL,'2025-01-17',625),(2009,1,1,NULL,'2025-01-24',615),(2010,1,1,NULL,'2025-02-01',640),(2011,1,1,NULL,'2025-02-15',635),(2012,1,1,NULL,'2025-03-01',655),(2013,1,1,NULL,'2025-03-10',648),(2014,1,2,NULL,'2025-01-12',670),(2015,1,2,NULL,'2025-01-20',675),(2016,1,2,NULL,'2025-02-05',682),(2017,1,2,NULL,'2025-02-18',690),(2018,1,2,NULL,'2025-03-05',685),(2019,1,2,NULL,'2025-03-15',695),(2020,1,2,NULL,'2025-03-20',698),(2021,1,4,NULL,'2025-01-05',750),(2022,1,4,NULL,'2025-01-25',765),(2023,1,4,NULL,'2025-02-10',780),(2024,1,4,NULL,'2025-02-25',775),(2025,1,4,NULL,'2025-03-08',800),(2026,1,4,NULL,'2025-03-22',815),(2027,1,4,NULL,'2025-03-29',820),(2028,1,3,NULL,'2025-01-02',520),(2029,1,3,NULL,'2025-01-09',540),(2030,1,3,NULL,'2025-01-16',535),(2031,1,3,NULL,'2025-01-23',560),(2032,1,3,NULL,'2025-01-30',580),(2033,1,3,NULL,'2025-02-06',575),(2034,1,3,NULL,'2025-02-13',590),(2035,1,1,107,'2025-09-10',650),(2036,1,3,107,'2025-09-11',340),(2037,1,1,107,'2025-09-12',665),(2038,1,1,108,'2025-09-25',670),(2039,1,2,108,'2025-09-26',685),(2040,1,3,109,'2025-10-30',355),(2041,1,4,109,'2025-10-30',810),(2042,1,4,109,'2025-10-31',825),(2043,1,1,110,'2025-11-05',660),(2044,1,1,110,'2025-11-06',672),(2045,1,1,110,'2025-11-07',675),(2046,1,1,110,'2025-11-08',680),(2047,1,2,111,'2025-11-20',690),(2048,1,4,111,'2025-11-21',830),(2049,1,1,111,'2025-11-22',688);
/*!40000 ALTER TABLE `score` ENABLE KEYS */;
UNLOCK TABLES;

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
  `arrow_values` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`staging_id`),
  KEY `archer_id` (`archer_id`),
  KEY `round_id` (`round_id`),
  KEY `equipment_id` (`equipment_id`),
  CONSTRAINT `stagingscore_ibfk_1` FOREIGN KEY (`archer_id`) REFERENCES `archer` (`archer_id`),
  CONSTRAINT `stagingscore_ibfk_2` FOREIGN KEY (`round_id`) REFERENCES `round` (`round_id`),
  CONSTRAINT `stagingscore_ibfk_3` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stagingscore`
--

LOCK TABLES `stagingscore` WRITE;
/*!40000 ALTER TABLE `stagingscore` DISABLE KEYS */;
INSERT INTO `stagingscore` VALUES (1,1,1,1,'2025-11-21 20:25:52',299,'approved','[\n    {\n        \"rangeId\": 1,\n        \"ends\": [\n            [\"10\", \"9\", \"9\", \"8\", \"8\", \"7\"],\n            [\"X\", \"10\", \"9\", \"9\", \"8\", \"8\"],\n            [\"10\", \"10\", \"9\", \"8\", \"7\", \"6\"],\n            [\"9\", \"9\", \"8\", \"8\", \"7\", \"7\"],\n            [\"X\", \"X\", \"10\", \"9\", \"9\", \"8\"],\n            [\"10\", \"9\", \"8\", \"7\", \"6\", \"M\"]\n        ]\n    }\n]'),(2,2,1,1,'2025-11-21 19:25:52',336,'approved','[\n    {\n        \"rangeId\": 1,\n        \"ends\": [\n            [\"X\", \"10\", \"10\", \"9\", \"9\", \"9\"],\n            [\"10\", \"10\", \"9\", \"9\", \"9\", \"8\"],\n            [\"X\", \"X\", \"10\", \"10\", \"9\", \"9\"],\n            [\"10\", \"9\", \"9\", \"8\", \"8\", \"8\"],\n            [\"X\", \"10\", \"10\", \"10\", \"9\", \"9\"],\n            [\"10\", \"10\", \"9\", \"9\", \"9\", \"9\"]\n        ]\n    }\n]'),(3,3,2,2,'2025-11-20 20:25:52',150,'rejected','[]'),(4,1,1,3,'2025-11-21 22:21:47',559,'approved','[{\"rangeId\":1,\"ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"7\",\"8\",\"9\",\"8\",\"7\",\"6\"],[\"8\",\"8\",\"8\",\"X\",\"M\",\"8\"],[\"8\",\"9\",\"6\",\"8\",\"7\",\"6\"]]},{\"rangeId\":2,\"ends\":[[\"X\",\"7\",\"8\",\"5\",\"X\",\"8\"],[\"9\",\"8\",\"7\",\"6\",\"5\",\"5\"],[\"7\",\"7\",\"7\",\"7\",\"7\",\"7\"],[\"8\",\"7\",\"6\",\"5\",\"9\",\"6\"],[\"9\",\"7\",\"6\",\"6\",\"5\",\"5\"],[\"9\",\"7\",\"6\",\"6\",\"5\",\"6\"]]}]'),(5,1,1,3,'2025-11-21 23:34:46',552,'approved','[{\"rangeId\":1,\"ends\":[[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"9\",\"6\",\"8\",\"7\",\"7\",\"5\"],[\"7\",\"8\",\"6\",\"8\",\"9\",\"9\"],[\"8\",\"9\",\"9\",\"8\",\"7\",\"7\"],[\"8\",\"9\",\"9\",\"9\",\"8\",\"7\"],[\"X\",\"M\",\"M\",\"7\",\"8\",\"9\"]]},{\"rangeId\":2,\"ends\":[[\"7\",\"8\",\"8\",\"7\",\"7\",\"6\"],[\"X\",\"X\",\"X\",\"X\",\"X\",\"X\"],[\"9\",\"7\",\"6\",\"5\",\"4\",\"6\"],[\"8\",\"9\",\"9\",\"7\",\"5\",\"6\"],[\"9\",\"7\",\"8\",\"8\",\"7\",\"6\"],[\"8\",\"9\",\"8\",\"6\",\"5\",\"6\"]]}]'),(6,1,1,1,'2025-11-20 10:00:00',645,'approved','[{\"rangeId\":1,\"ends\":[[\"10\",\"9\",\"9\",\"8\",\"8\",\"7\"],[\"X\",\"10\",\"9\",\"9\",\"8\",\"8\"],[\"10\",\"10\",\"9\",\"8\",\"7\",\"6\"],[\"9\",\"9\",\"8\",\"8\",\"7\",\"7\"],[\"X\",\"X\",\"10\",\"9\",\"9\",\"8\"],[\"10\",\"9\",\"8\",\"7\",\"6\",\"M\"]]}]'),(7,1,2,1,'2025-11-21 14:30:00',680,'approved','[{\"rangeId\":1,\"ends\":[[\"X\",\"X\",\"10\",\"10\",\"9\",\"9\"],[\"10\",\"10\",\"9\",\"9\",\"9\",\"8\"],[\"X\",\"X\",\"10\",\"10\",\"9\",\"9\"],[\"10\",\"9\",\"9\",\"8\",\"8\",\"8\"],[\"X\",\"10\",\"10\",\"10\",\"9\",\"9\"],[\"10\",\"10\",\"9\",\"9\",\"9\",\"9\"]]}]'),(8,2,3,2,'2025-11-21 09:15:00',330,'approved','[]'),(9,1,1,1,'2025-11-22 08:00:00',655,'pending','[{\"rangeId\":1,\"ends\":[[\"X\",\"10\",\"9\",\"9\",\"8\",\"7\"],[\"X\",\"10\",\"10\",\"9\",\"8\",\"8\"],[\"10\",\"9\",\"9\",\"8\",\"7\",\"6\"],[\"9\",\"9\",\"9\",\"8\",\"7\",\"7\"],[\"X\",\"X\",\"10\",\"10\",\"9\",\"8\"],[\"10\",\"10\",\"8\",\"7\",\"6\",\"6\"]]}]'),(10,1,4,1,'2025-11-22 11:00:00',815,'pending','[]'),(11,3,1,3,'2025-11-22 10:45:00',580,'pending','[]');
/*!40000 ALTER TABLE `stagingscore` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_log`
--

DROP TABLE IF EXISTS `system_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `timestamp` datetime(6) NOT NULL,
  `level` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_log`
--

LOCK TABLES `system_log` WRITE;
/*!40000 ALTER TABLE `system_log` DISABLE KEYS */;
INSERT INTO `system_log` VALUES (1,'2025-11-21 21:14:13.860929','info','Recorder/Admin','Approved Score','Score ID 1002 approved for Archer ID 2. Total: 336','::1'),(2,'2025-11-21 21:14:20.882797','info','Recorder/Admin','Approved Score','Score ID 1003 approved for Archer ID 1. Total: 299','::1'),(3,'2025-11-21 22:22:44.572368','info','Recorder/Admin','Approved Score','Score ID 1004 approved for Archer ID 1. Total: 559','::1'),(4,'2025-11-21 23:35:16.205807','info','Recorder/Admin','Approved Score','Score ID 2006 approved for Archer ID 1. Total: 552','::1');
/*!40000 ALTER TABLE `system_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-22 14:18:20
