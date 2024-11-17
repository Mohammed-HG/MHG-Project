CREATE TABLE `contacts` (
  `contact_id` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(15) DEFAULT NULL,
  `LastName` varchar(20) DEFAULT NULL,
  `Phone_Number` varchar(10) DEFAULT NULL,
  `contact_Email` varchar(255) DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`contact_id`),
  KEY `FK_User_Id` (`UserId`),
  CONSTRAINT `FK_User_Id` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci