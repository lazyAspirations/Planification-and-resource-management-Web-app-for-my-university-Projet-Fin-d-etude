-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 27, 2025 at 09:04 PM
-- Server version: 8.0.42
-- PHP Version: 8.1.2-1ubuntu2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `PFE`
--
CREATE DATABASE IF NOT EXISTS `PFE` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `PFE`;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int NOT NULL,
  `nom` varchar(20) DEFAULT NULL,
  `prenom` varchar(20) DEFAULT NULL,
  `date_nec` date DEFAULT NULL,
  `email` varchar(55) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `cle` varchar(13) DEFAULT NULL,
  `admin_secret` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `nom`, `prenom`, `date_nec`, `email`, `password`, `cle`, `admin_secret`) VALUES
(1, 'ould Aissa', 'Ahmed', '2004-01-19', 'ouldAissa4589@gmail.com', '$2b$08$jRyC2oQwgwVUb.QPXJv8J.5rDGNwDeHXWHrSLDJYUASV/HCSk/rsi', NULL, 'I love cats'),
(2, 'Kamech', 'Abdallah', '2004-01-19', 'KamechAbdallah8763@gmail.com', '$2b$08$xu99Hv3vM7uh5wZP8AZEo.YJS3xK7G63cROSsakgGe/snzwx8jPjq', NULL, 'I hate cats');

-- --------------------------------------------------------

--
-- Table structure for table `enseignant`
--

DROP TABLE IF EXISTS `enseignant`;
CREATE TABLE `enseignant` (
  `id` int NOT NULL,
  `Nss` varchar(15) DEFAULT NULL,
  `nom` varchar(20) DEFAULT NULL,
  `prenom` varchar(20) DEFAULT NULL,
  `date_Nec` date DEFAULT NULL,
  `grade` varchar(50) DEFAULT NULL,
  `emailPro` varchar(55) DEFAULT NULL,
  `email` varchar(55) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `cle` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `enseignant`
--

INSERT INTO `enseignant` (`id`, `Nss`, `nom`, `prenom`, `date_Nec`, `grade`, `emailPro`, `email`, `password`, `cle`) VALUES
(5, '60-19-5659883-6', 'Lahiani', 'Nesrine', '1989-03-21', 'Maitre Assistant B', NULL, NULL, NULL, '#PR123456789123'),
(6, '89-19-7131546-4', 'HADJHENNI', 'Malika', NULL, 'Maitre Assistant A', 'a@gmail.com', NULL, '$2b$08$wGe5yrnpmKRvl6IBsNQY4uXmqnZLoJ77O3N//LrGZSc1feGhLRHP6', NULL),
(8, '64-13-7670188-0', 'MAZOUZ', 'Ilhem', NULL, NULL, NULL, NULL, NULL, NULL),
(11, '68-42-1219759-9', 'OUKID', 'Lamia', NULL, 'Maitre De Conférence B', NULL, NULL, NULL, NULL),
(13, '92-41-4092140-6', 'FERDI', 'Imene', NULL, 'Maitre Assistant B', 'Imene.ferdi@univ-constantine2.dz', NULL, '$2b$08$qTyC6NRwUlTnE5yBL1lBBeNvn5YpvQe4rN20TuK3/av9AveZhFbDu', NULL),
(14, '64-37-8803781-4', 'KAMECHE', 'Abdallah Hicham', NULL, 'Maitre Assistant B', NULL, NULL, NULL, NULL),
(19, '84-26-6233919-5', 'Hadj Yahia', 'Ouahid', NULL, 'Maitre Assistant A', 'o.hadjyahia@gmail.com', NULL, '$2b$08$c0TdU11je/H0Pf5cKJ1pS.Lq32Viz7eFdEX193BE4z86MH5xo/7Hi', NULL),
(21, '65-54-3128253-4', 'Mancer', 'Yassmine', NULL, 'Maitre Assistant A', 'yasmoncer@gmail.com', NULL, '$2b$08$dd.0OzkJVzDphdseBdkwcuosmQeEDjlvIwOObmFpxo46.LZdvnRTK', NULL),
(22, '74-23-1043719-8', 'abc', 'bcd efg', '2004-01-17', 'Maitre Assistant A', 'ab@gmail.com', NULL, '$2b$08$EBs79GHX4s4iagZTiWUxY.vu6Cs0ii58mYth8.qToN2VEtffMW9Ea', NULL),
(23, '68-25-5607163-3', 'Abed', 'Hafida', NULL, 'Professeur', 'hafidabouarfa@hotmail.com', NULL, NULL, NULL),
(25, '61-16-2716207-1', 'Aroussi', 'Sana', NULL, 'Maitre Assistant A', 's_aroussi@esi.dz', 'Aroussi@gmail.com', '$2b$08$MZvUAl7C14vGh9v9bUAox.qsSAdJH29sInp7vHZw9jW.Ljx232RTm', NULL),
(28, '71-43-9478939-5', 'Bacha', 'Sihem', NULL, 'Maitre de Conférence B', NULL, NULL, NULL, NULL),
(29, '91-56-7263739-6', 'Bala', 'Mahfoud', NULL, 'Maitre de Conférence B', 'mahfoud.bala@gmail.com', NULL, NULL, NULL),
(30, '10-05-4668911-8', 'Boucetta', 'Zouhel', NULL, 'Maitre Assistant A', 'boucettazouhel@yahoo.fr', NULL, NULL, NULL),
(31, '10-02-5073912-1', 'Boumahdi', 'Fatima', NULL, 'Maitre de Conférence B', 'fati-boumahdi@yahoo.fr', NULL, NULL, NULL),
(32, '82-55-3170301-3', 'Boucettia', 'Nerhimene', NULL, 'Professeur', 'nboustia@hotmail.com', NULL, NULL, NULL),
(33, '67-42-1426772-1', 'Cherfa', 'Imene', NULL, 'Maitre Assistant A', 'cherimene@yahoo.fr', NULL, NULL, NULL),
(34, '76-34-7588732-9', 'Cherif-Zahar', 'Sid-Ahmed Amine', NULL, 'Maitre Assistant A', 'cherif.zahar@gmail.com', NULL, NULL, NULL),
(35, '83-45-3366908-0', 'Chikhi', 'Nacim Fateh', NULL, 'Maitre De Conférence A', 'nacim.chikhi@univ-blida.dz', NULL, NULL, NULL),
(36, '74-34-9162286-7', 'Mezzi', 'Melyara', NULL, 'Maitre de Conférence B', NULL, NULL, NULL, NULL),
(37, '71-53-7945063-1', 'Fareh', 'Messaouda', NULL, 'Maitre Assistant A', 'farehm@gmail.com', NULL, NULL, NULL),
(38, '74-14-3011713-3', 'Ferfera', 'Sofiane', NULL, 'Maitre Assistant A', 'soufer82@gmail.com', NULL, NULL, NULL),
(39, '74-25-2467824-5', 'Guessoum', 'Dalila', NULL, 'Maitre Assistant A', 'guessoumdali@gmail.com', NULL, NULL, NULL),
(40, '67-16-8515043-3', 'Hamouda', 'Mohamed', NULL, 'Maitre Assistant A', 'medhamouda@hotmail.com', NULL, NULL, NULL),
(41, '73-25-2766530-7', 'Oukid', 'Saliha', NULL, 'Professeur', NULL, NULL, NULL, NULL),
(42, '61-56-7201617-5', 'Ghebghoub', 'Yasmina', NULL, 'Maitre De Conférence B', NULL, NULL, NULL, NULL),
(43, '99-36-5066119-4', 'Khdiri', 'Abd el Razek', NULL, 'Maitre Assistant B', NULL, NULL, NULL, NULL),
(44, '91-15-2348241-0', 'Ben Ramdan', 'Djamila', NULL, 'Maitre Assistant A', NULL, NULL, NULL, NULL),
(45, '86-53-8091247-2', 'Meskhaldji', 'Khouloud', NULL, 'Maitre Assistant A', NULL, NULL, NULL, NULL),
(46, '91-49-2090740-0', 'Nehal', 'Djillali', NULL, 'Maitre Assistant A', 'djilali.nehal@yahoo.fr', NULL, NULL, NULL),
(47, '61-57-7733033-8', 'Ouahrani', 'Leila', NULL, 'Maitre Assistant A', 'louahrani@hotmail.com', NULL, NULL, NULL),
(48, '96-38-8080876-9', 'Ould-Aissa', 'Ahmed', NULL, 'Professeur-Ing', 'ouldaisa@yahoo.fr', NULL, NULL, NULL),
(49, '86-01-3365168-2', 'Nasri', 'Ahlem', NULL, 'Maitre Assistant B', NULL, NULL, NULL, NULL),
(50, '87-15-4702065-2', 'Touahri', 'Dalila', NULL, 'Maitre Assistant B', 'touahri_dalila@yahoo.fr', NULL, NULL, NULL),
(51, '70-18-8230011-1', 'Toubaline', 'Nesrine', NULL, 'Maitre de Conférence B', 'toubaline_n@hotmail.com', NULL, NULL, NULL),
(52, '65-19-3027036-1', 'Zair', 'Mustapha', NULL, 'Maitre Assistant A', 'zamusta19@yahoo.fr', NULL, NULL, NULL),
(53, '65-07-2642647-5', 'Laouci', 'Zineb', NULL, 'Maitre de Conférence B', 'zinebl90@gmail.com', NULL, NULL, NULL),
(54, '78-19-4238244-8', 'Chikhi', 'Imane', NULL, 'Maitre Assistant A', 'chikhi.imane@gmail.com', NULL, NULL, NULL),
(55, '62-44-6663592-8', 'Ykhlef', 'Hadjer', NULL, 'Maitre de Conférence B', 'ykhlef.hadjer@gmail.com', NULL, NULL, NULL),
(56, '84-04-7314754-3', 'Ouled-Khaoua', 'Mohamed', NULL, 'Professeur', 'mouldkhaoua@gmail.com', NULL, NULL, NULL),
(57, '78-12-7209955-8', 'Arkam', 'Meriem', NULL, 'Maitre Assistant A', NULL, NULL, NULL, NULL),
(58, '74-56-8519888-3', 'Boutoumi', 'Bachira', NULL, 'Maitre Assistant A', NULL, NULL, NULL, NULL),
(59, '60-09-7315581-0', 'Chrighin', 'Souraya', NULL, 'Maitre Assistant B', NULL, NULL, NULL, NULL),
(60, '70-55-1133666-2', 'Zahra', 'Fatma Zohra', NULL, 'Maitre Assistant A', NULL, NULL, NULL, NULL),
(61, '70-23-3285638-1', 'Boudraa', 'Soussen', NULL, 'Maitre Assistant B', NULL, NULL, NULL, NULL),
(62, '93-25-9147305-2', 'MIDOUN', 'Khadidja', NULL, 'Maitre Assistant B', 'k_midoun@esi.dz', NULL, NULL, NULL),
(63, '81-40-9389239-6', 'HAYAT', 'Daoud', NULL, 'Maitre Assistant B', 'hayat.daoud@hotmail.com', NULL, NULL, NULL),
(64, '78-08-4577710-6', 'Benyahia', 'Mohamed', NULL, 'Maitre Assistant A', NULL, NULL, NULL, NULL),
(65, '98-29-8626486-7', 'Benaissi', 'Selami', NULL, 'Maitre Assistant B', NULL, NULL, NULL, NULL),
(66, '74-17-5090611-4', 'Djeddar', 'Afrah', NULL, 'Maitre de Conférence B', NULL, NULL, NULL, NULL),
(67, '93-30-3334408-7', 'Douga', 'Yassine', NULL, 'Maitre de Conférence B', NULL, NULL, NULL, NULL),
(68, '65-18-2362656-8', 'Bay', 'Fella', NULL, 'Maitre Assistant B', NULL, NULL, NULL, NULL),
(69, '91-01-9304053-6', 'Hirech', 'Silia', NULL, 'Maitre Assistant B', NULL, NULL, NULL, NULL),
(70, '70-23-2915536-9', 'Riali', 'Ishak', NULL, 'Maitre Assistant B', 'ishakriali@gmail.com', NULL, NULL, NULL),
(71, '10-47-3400899-9', 'Sahnoune', 'Zakaria', NULL, 'Maitre Assistant B', 'z.sahnoune@univ-blida.dz', NULL, NULL, NULL),
(72, '10-47-3350149-8', 'Tabdji', 'Rachida', NULL, 'Maitre de Conférence B', NULL, NULL, NULL, NULL),
(73, '86-21-9628522-7', 'Boufrouaa', 'Nawel', NULL, 'Maitre Assistant B', NULL, NULL, NULL, NULL),
(121, '98-04-7221373-2', 'Dilmi', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(122, '78-08-5020917-8', 'Ouziri', 'ichraf', NULL, NULL, NULL, NULL, NULL, NULL),
(123, '98-45-3243522-9', 'HABANI', 'sadek', NULL, NULL, NULL, NULL, NULL, NULL),
(124, '61-17-3833885-7', 'LASLOUNI', 'Warda', NULL, NULL, NULL, NULL, NULL, NULL),
(125, '92-23-8297611-8', 'Belarbi', 'FATINE MERIEME', NULL, NULL, NULL, NULL, NULL, NULL),
(126, '10-06-6536367-8', 'tobji', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(127, '69-34-3867827-8', 'Mraouefel', 'Ahlame', NULL, NULL, NULL, NULL, NULL, NULL),
(128, '70-37-5219269-4', 'ELMOUSSAOUI', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(129, '98-53-9915657-2', 'DJEMEA', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Triggers `enseignant`
--
DROP TRIGGER IF EXISTS `trg_enseignant_update`;
DELIMITER $$
CREATE TRIGGER `trg_enseignant_update` AFTER INSERT ON `enseignant` FOR EACH ROW BEGIN
  INSERT INTO table_metadata (table_name, last_updated)
  VALUES ('enseignant', NOW())
  ON DUPLICATE KEY UPDATE last_updated = NOW();
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_enseignant_update_d`;
DELIMITER $$
CREATE TRIGGER `trg_enseignant_update_d` AFTER DELETE ON `enseignant` FOR EACH ROW BEGIN
  INSERT INTO table_metadata (table_name, last_updated)
  VALUES ('enseignant', NOW())
  ON DUPLICATE KEY UPDATE last_updated = NOW();
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_enseignant_update_u`;
DELIMITER $$
CREATE TRIGGER `trg_enseignant_update_u` AFTER UPDATE ON `enseignant` FOR EACH ROW BEGIN
  INSERT INTO table_metadata (table_name, last_updated)
  VALUES ('enseignant', NOW())
  ON DUPLICATE KEY UPDATE last_updated = NOW();
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `enseignant_module`
--

DROP TABLE IF EXISTS `enseignant_module`;
CREATE TABLE `enseignant_module` (
  `id_enseignant` int NOT NULL,
  `id_module` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `enseignant_module`
--
DROP TRIGGER IF EXISTS `trg_enseignant_module_module_update`;
DELIMITER $$
CREATE TRIGGER `trg_enseignant_module_module_update` AFTER INSERT ON `enseignant_module` FOR EACH ROW BEGIN
  INSERT INTO table_metadata (table_name, last_updated)
  VALUES ('enseignant_module', NOW())
  ON DUPLICATE KEY UPDATE last_updated = NOW();
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_enseignant_module_update_d`;
DELIMITER $$
CREATE TRIGGER `trg_enseignant_module_update_d` AFTER DELETE ON `enseignant_module` FOR EACH ROW BEGIN
  INSERT INTO table_metadata (table_name, last_updated)
  VALUES ('enseignant_module', NOW())
  ON DUPLICATE KEY UPDATE last_updated = NOW();
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_enseignant_module_update_u`;
DELIMITER $$
CREATE TRIGGER `trg_enseignant_module_update_u` AFTER UPDATE ON `enseignant_module` FOR EACH ROW BEGIN
  INSERT INTO table_metadata (table_name, last_updated)
  VALUES ('enseignant_module', NOW())
  ON DUPLICATE KEY UPDATE last_updated = NOW();
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `EnsPreferences`
--

DROP TABLE IF EXISTS `EnsPreferences`;
CREATE TABLE `EnsPreferences` (
  `id_enseignant` int NOT NULL,
  `displayRequests` tinyint(1) DEFAULT '0',
  `language` varchar(10) DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `EnsPreferences`
--

INSERT INTO `EnsPreferences` (`id_enseignant`, `displayRequests`, `language`) VALUES
(25, 0, 'fr');

-- --------------------------------------------------------

--
-- Table structure for table `etudiant`
--

DROP TABLE IF EXISTS `etudiant`;
CREATE TABLE `etudiant` (
  `id` int NOT NULL,
  `nom` varchar(20) DEFAULT NULL,
  `prenom` varchar(20) DEFAULT NULL,
  `date_nec` text,
  `id_groupe` int DEFAULT NULL,
  `email` varchar(55) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `cle` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `emailPro` varchar(255) DEFAULT NULL,
  `matricule` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `etudiant`
--

INSERT INTO `etudiant` (`id`, `nom`, `prenom`, `date_nec`, `id_groupe`, `email`, `password`, `cle`, `emailPro`, `matricule`) VALUES
(1, 'Aissat', 'Moncef', '19/01/2004', 23, 'AissatMoncef@gmail.com', '$2b$08$SWeeXPyAgUuXnRHxTUYbQexkeO698jcyTxWx5i1XJacWY7n/Ee1ZC', NULL, 'studentEmail@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `EtuPreferences`
--

DROP TABLE IF EXISTS `EtuPreferences`;
CREATE TABLE `EtuPreferences` (
  `id_etudiant` int NOT NULL,
  `displayRequests` tinyint(1) DEFAULT '0',
  `language` varchar(10) DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `EtuPreferences`
--

INSERT INTO `EtuPreferences` (`id_etudiant`, `displayRequests`, `language`) VALUES
(1, 0, 'en');

-- --------------------------------------------------------

--
-- Table structure for table `etu_ens_salle`
--

DROP TABLE IF EXISTS `etu_ens_salle`;
CREATE TABLE `etu_ens_salle` (
  `id` int NOT NULL,
  `id_etudiant` int DEFAULT NULL,
  `id_enseignant` int DEFAULT NULL,
  `id_salle` varchar(20) DEFAULT NULL,
  `id_examen` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evenement`
--

DROP TABLE IF EXISTS `evenement`;
CREATE TABLE `evenement` (
  `id` int NOT NULL,
  `Jour` enum('Sunday','Monday','Tuesday','Wednesday','Thursday','Saturday') NOT NULL,
  `horaire` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id_salle` varchar(5) DEFAULT NULL,
  `id_enseignant` int DEFAULT NULL,
  `id_module` varchar(20) DEFAULT NULL,
  `id_section` int DEFAULT NULL,
  `id_groupe` int DEFAULT '0',
  `type_Even` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `expiration_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `examen`
--

DROP TABLE IF EXISTS `examen`;
CREATE TABLE `examen` (
  `id` int NOT NULL,
  `day` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `id_module` varchar(20) DEFAULT NULL,
  `id_spec` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `examen_salle`
--

DROP TABLE IF EXISTS `examen_salle`;
CREATE TABLE `examen_salle` (
  `id_examen` int NOT NULL,
  `id_salle` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groupe`
--

DROP TABLE IF EXISTS `groupe`;
CREATE TABLE `groupe` (
  `id` int NOT NULL,
  `id_section` int DEFAULT NULL,
  `num_Grp` int DEFAULT NULL,
  `nbr_etud` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `groupe`
--

INSERT INTO `groupe` (`id`, `id_section`, `num_Grp`, `nbr_etud`) VALUES
(23, 7, 1, 30),
(24, 7, 2, 30),
(25, 8, 1, 30),
(26, 8, 2, 30),
(27, 9, 1, 30),
(28, 9, 2, 30),
(29, 10, 1, 30),
(30, 10, 2, 30),
(31, 10, 3, 30),
(32, 11, 1, 30),
(33, 11, 2, 30),
(34, 12, 1, 30),
(36, 12, 2, 30),
(37, 12, 3, 30),
(38, 13, 1, 30),
(39, 13, 2, 30),
(40, 13, 3, 30),
(41, 13, 4, 30),
(42, 14, 1, 30),
(43, 14, 2, 30),
(45, 14, 3, 30),
(46, 15, 1, 30),
(47, 15, 2, 30),
(48, 16, 1, 30),
(50, 16, 2, 30),
(51, 17, 1, 30),
(53, 17, 2, 30);

-- --------------------------------------------------------

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
CREATE TABLE `module` (
  `id` varchar(20) NOT NULL,
  `nom_C` varchar(100) DEFAULT NULL,
  `chargeCours` int DEFAULT NULL,
  `chargeTd` int DEFAULT NULL,
  `chargeTp` int DEFAULT NULL,
  `id_specialite` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `niveau`
--

DROP TABLE IF EXISTS `niveau`;
CREATE TABLE `niveau` (
  `id` varchar(4) NOT NULL,
  `nom_C` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `niveau`
--

INSERT INTO `niveau` (`id`, `nom_C`) VALUES
('ING1', 'Ingénieur 1ère année'),
('ING2', 'Ingénieur 2ème année'),
('ING3', 'Ingénieur 3ème année'),
('ING4', 'Ingénieur 4ème année'),
('ING5', 'Ingénieur 5ème année'),
('L1', 'Licence 1ère année'),
('L2', 'Licence 2ème année'),
('L3', 'Licence 3ème année'),
('M1', 'Master 1ère année'),
('M2', 'Master 2ème année');

-- --------------------------------------------------------

--
-- Table structure for table `notifAdmEns`
--

DROP TABLE IF EXISTS `notifAdmEns`;
CREATE TABLE `notifAdmEns` (
  `id` int NOT NULL,
  `NotifFrom` enum('Enseignant','Etudiant') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DateTime` varchar(255) DEFAULT NULL,
  `horaire` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Jour` enum('Sunday','Monday','Tuesday','Wednesday','Thursday','Saturday') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id_salle` varchar(5) DEFAULT NULL,
  `id_enseignant` int DEFAULT NULL,
  `id_module` varchar(20) DEFAULT NULL,
  `id_section` int DEFAULT NULL,
  `id_groupe` int DEFAULT NULL,
  `type_Seance` enum('LECTURE','TUTORIAL','LAB','ONLINELECTURE','ONLINETUTORIAL','ONLINELAB') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `multipurpose` varchar(255) DEFAULT NULL,
  `type_demande` enum('ajout','modif','supp','abse','tempo','sonda','poll_end','intero','demIntero') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` int DEFAULT NULL,
  `id_seance` int DEFAULT NULL,
  `seenbyens` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `notifAdmEns`
--
DROP TRIGGER IF EXISTS `before_notifAdmEns_insert`;
DELIMITER $$
CREATE TRIGGER `before_notifAdmEns_insert` BEFORE INSERT ON `notifAdmEns` FOR EACH ROW BEGIN
    -- Vérifier les règles seulement si status est NULL ou -1
    IF (NEW.status IS NULL OR NEW.status = -1) THEN
        -- 1. type_demande=modif et id_seance doit être unique
        IF NEW.type_demande = 'modif' THEN
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE id_seance = NEW.id_seance 
                AND type_demande = 'modif' 
                AND (status IS NULL OR status = -1)
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande de modification existe déjà pour cette séance';
            END IF;
            
            -- 3. Pas de modif sur un id_seance qui a type_demande=supp
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE id_seance = NEW.id_seance 
                AND type_demande = 'supp' 
                AND (status IS NULL OR status = -1)
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande de suppression existe déjà pour cette séance';
            END IF;
        END IF;
        
        -- 2. type_demande=supp et id_seance doit être unique
        IF NEW.type_demande = 'supp' THEN
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE id_seance = NEW.id_seance 
                AND type_demande = 'supp' 
                AND (status IS NULL OR status = -1)
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande de suppression existe déjà pour cette séance';
            END IF;
            
            -- 4. Pas de supp sur un id_seance qui a type_demande=modif
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE id_seance = NEW.id_seance 
                AND type_demande = 'modif' 
                AND (status IS NULL OR status = -1)
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande de modification existe déjà pour cette séance';
            END IF;
        END IF;
        
        -- 5. type_demande=abse et id_seance doit être unique
        IF NEW.type_demande = 'abse' THEN
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE id_seance = NEW.id_seance 
                AND type_demande = 'abse' 
                AND (status IS NULL OR status = -1)
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande d'absence existe déjà pour cette séance';
            END IF;
        END IF;
        
        -- 6. type_demande=ajout doit être unique
        IF NEW.type_demande = 'ajout' THEN
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE type_demande = 'ajout' 
                AND (status IS NULL OR status = -1)
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande d'ajout existe déjà';
            END IF;
        END IF;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `before_notifAdmEns_update`;
DELIMITER $$
CREATE TRIGGER `before_notifAdmEns_update` BEFORE UPDATE ON `notifAdmEns` FOR EACH ROW BEGIN
    -- Vérifier les règles seulement si status est NULL ou -1
    IF (NEW.status IS NULL OR NEW.status = -1) THEN
        -- 1. type_demande=modif et id_seance doit être unique
        IF NEW.type_demande = 'modif' THEN
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE id_seance = NEW.id_seance 
                AND type_demande = 'modif' 
                AND (status IS NULL OR status = -1)
                AND id <> NEW.id
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande de modification existe déjà pour cette séance';
            END IF;
            
            -- 3. Pas de modif sur un id_seance qui a type_demande=supp
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE id_seance = NEW.id_seance 
                AND type_demande = 'supp' 
                AND (status IS NULL OR status = -1)
                AND id <> NEW.id
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande de suppression existe déjà pour cette séance';
            END IF;
        END IF;
        
        -- 2. type_demande=supp et id_seance doit être unique
        IF NEW.type_demande = 'supp' THEN
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE id_seance = NEW.id_seance 
                AND type_demande = 'supp' 
                AND (status IS NULL OR status = -1)
                AND id <> NEW.id
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande de suppression existe déjà pour cette séance';
            END IF;
            
            -- 4. Pas de supp sur un id_seance qui a type_demande=modif
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE id_seance = NEW.id_seance 
                AND type_demande = 'modif' 
                AND (status IS NULL OR status = -1)
                AND id <> NEW.id
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande de modification existe déjà pour cette séance';
            END IF;
        END IF;
        
        -- 5. type_demande=abse et id_seance doit être unique
        IF NEW.type_demande = 'abse' THEN
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE id_seance = NEW.id_seance 
                AND type_demande = 'abse' 
                AND (status IS NULL OR status = -1)
                AND id <> NEW.id
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande d'absence existe déjà pour cette séance';
            END IF;
        END IF;
        
        -- 6. type_demande=ajout doit être unique
        IF NEW.type_demande = 'ajout' THEN
            IF EXISTS (
                SELECT 1 FROM notifAdmEns 
                WHERE type_demande = 'ajout' 
                AND (status IS NULL OR status = -1)
                AND id <> NEW.id
            ) THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Une demande d'ajout existe déjà';
            END IF;
        END IF;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `update_seenbyens_on_status_change`;
DELIMITER $$
CREATE TRIGGER `update_seenbyens_on_status_change` BEFORE UPDATE ON `notifAdmEns` FOR EACH ROW BEGIN
    -- Check if status is being changed to 1 or 0
    IF (NEW.status IN (0, 1) AND (OLD.status IS NULL OR OLD.status = -1 OR OLD.status NOT IN (0, 1))) THEN
        -- Set seenbyens to NULL when status changes to 1 or 0
        SET NEW.seenbyens = NULL;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `notifEnsEtu`
--

DROP TABLE IF EXISTS `notifEnsEtu`;
CREATE TABLE `notifEnsEtu` (
  `id` int NOT NULL,
  `NotifFrom` enum('Enseignant','Etudiant') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DateTime` varchar(255) DEFAULT NULL,
  `horaire` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Jour` enum('Sunday','Monday','Tuesday','Wednesday','Thursday','Saturday') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id_salle` varchar(5) DEFAULT NULL,
  `id_enseignant` int DEFAULT NULL,
  `id_module` varchar(20) DEFAULT NULL,
  `id_section` int DEFAULT NULL,
  `id_groupe` int DEFAULT NULL,
  `type_Seance` enum('LECTURE','TUTORIAL','LAB','ONLINELECTURE','ONLINETUTORIAL','ONLINELAB') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `multipurpose` varchar(255) DEFAULT NULL,
  `type_demande` enum('ajout','modif','supp','abse','tempo','sonda','poll_end','intero') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `id_seance` int DEFAULT NULL,
  `seenbyetu` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifEtuAdm`
--

DROP TABLE IF EXISTS `notifEtuAdm`;
CREATE TABLE `notifEtuAdm` (
  `id` int NOT NULL,
  `NotifFrom` enum('Enseignant','Etudiant') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DateTime` varchar(255) DEFAULT NULL,
  `horaire` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Jour` enum('Sunday','Monday','Tuesday','Wednesday','Thursday','Saturday') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id_salle` varchar(5) DEFAULT NULL,
  `id_enseignant` int DEFAULT NULL,
  `id_module` varchar(20) DEFAULT NULL,
  `id_section` int DEFAULT NULL,
  `id_groupe` int DEFAULT NULL,
  `type_Seance` enum('LECTURE','TUTORIAL','LAB','ONLINELECTURE','ONLINETUTORIAL','ONLINELAB') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `multipurpose` varchar(255) DEFAULT NULL,
  `type_demande` enum('ajout','modif','supp','abse','tempo','sonda') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `id_seance` int DEFAULT NULL,
  `vue` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salle`
--

DROP TABLE IF EXISTS `salle`;
CREATE TABLE `salle` (
  `id` varchar(20) NOT NULL,
  `Pv` int DEFAULT NULL,
  `N_Salle` int DEFAULT NULL,
  `utilite` enum('LECTURE','TUTORIAL','LAB','ONLINE') DEFAULT NULL,
  `capacite_salle` int DEFAULT NULL,
  `soustravaux` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `salle`
--

INSERT INTO `salle` (`id`, `Pv`, `N_Salle`, `utilite`, `capacite_salle`, `soustravaux`) VALUES
('1/190', 1, 190, 'TUTORIAL', 180, 1),
('1/225', 1, 225, 'LAB', 50, 0),
('1/262', 1, 262, 'LAB', 40, 0),
('1/264', 1, 264, 'LAB', 40, 0),
('2/108', 2, 108, 'LECTURE', 180, 0),
('2/123', 2, 123, 'LECTURE', 40, 0),
('2/134', 2, 134, 'TUTORIAL', 40, 0),
('2/140', 2, 140, 'TUTORIAL', 180, 0),
('2/3', 2, 3, 'TUTORIAL', 40, 0),
('2/36', 2, 36, 'TUTORIAL', 40, 0),
('2/7', 2, 7, 'TUTORIAL', 40, 0),
('3/120', 3, 120, 'LECTURE', 180, 0),
('3/158', 3, 158, 'LECTURE', 180, 0),
('3/184', 3, 184, 'LECTURE', 180, 0),
('3/186', 3, 186, 'TUTORIAL', 40, 0),
('3/202', 3, 202, 'LAB', 50, 0),
('9/160', 9, 160, 'TUTORIAL', 40, 0),
('9/162', 9, 162, 'TUTORIAL', 40, 0),
('9/189', 9, 189, 'TUTORIAL', 180, 0);

--
-- Triggers `salle`
--
DROP TRIGGER IF EXISTS `before_insert_set_id`;
DELIMITER $$
CREATE TRIGGER `before_insert_set_id` BEFORE INSERT ON `salle` FOR EACH ROW BEGIN
    -- Automatically combine Pv and N_Salle to set id
    SET NEW.id = CONCAT(NEW.Pv, '/', NEW.N_Salle);
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_salle_salle_update`;
DELIMITER $$
CREATE TRIGGER `trg_salle_salle_update` AFTER INSERT ON `salle` FOR EACH ROW BEGIN
  INSERT INTO table_metadata (table_name, last_updated)
  VALUES ('salle', NOW())
  ON DUPLICATE KEY UPDATE last_updated = NOW();
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_salle_update_d`;
DELIMITER $$
CREATE TRIGGER `trg_salle_update_d` AFTER DELETE ON `salle` FOR EACH ROW BEGIN
  INSERT INTO table_metadata (table_name, last_updated)
  VALUES ('salle', NOW())
  ON DUPLICATE KEY UPDATE last_updated = NOW();
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_salle_update_u`;
DELIMITER $$
CREATE TRIGGER `trg_salle_update_u` AFTER UPDATE ON `salle` FOR EACH ROW BEGIN
  INSERT INTO table_metadata (table_name, last_updated)
  VALUES ('salle', NOW())
  ON DUPLICATE KEY UPDATE last_updated = NOW();
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `seance`
--

DROP TABLE IF EXISTS `seance`;
CREATE TABLE `seance` (
  `id` int NOT NULL,
  `Jour` enum('Sunday','Monday','Tuesday','Wednesday','Thursday','Saturday') NOT NULL,
  `horaire` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id_salle` varchar(5) DEFAULT NULL,
  `id_enseignant` int DEFAULT NULL,
  `id_module` varchar(20) DEFAULT NULL,
  `id_section` int DEFAULT NULL,
  `id_groupe` int DEFAULT '0',
  `type_Seance` enum('LECTURE','TUTORIAL','LAB','ONLINELECTURE','ONLINETUTORIAL','ONLINELAB') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `expiration_date` datetime DEFAULT NULL,
  `exp_intero` datetime DEFAULT NULL
) ;

--
-- Triggers `seance`
--
DROP TRIGGER IF EXISTS `check_group_availability`;
DELIMITER $$
CREATE TRIGGER `check_group_availability` BEFORE INSERT ON `seance` FOR EACH ROW BEGIN
    DECLARE conflict_count INT;
    
    IF NEW.id_groupe IS NOT NULL THEN
        SELECT COUNT(*) INTO conflict_count
        FROM seance
        WHERE id_groupe = NEW.id_groupe
        AND Jour = NEW.Jour
        AND horaire = NEW.horaire
        AND id != NEW.id;
        
        IF conflict_count > 0 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Group already has a session scheduled at this time';
        END IF;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `check_salle_capacity`;
DELIMITER $$
CREATE TRIGGER `check_salle_capacity` BEFORE INSERT ON `seance` FOR EACH ROW BEGIN
    DECLARE salle_capacity INT;
    DECLARE group_size INT;
    
    SELECT capacite_salle INTO salle_capacity 
    FROM salle 
    WHERE id = NEW.id_salle;
    
    SELECT nbr_etud INTO group_size 
    FROM groupe 
    WHERE id = NEW.id_groupe;
    
    IF group_size > salle_capacity THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Salle capacity is insufficient for this group';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `set_expiration_null`;
DELIMITER $$
CREATE TRIGGER `set_expiration_null` BEFORE INSERT ON `seance` FOR EACH ROW BEGIN
    -- If expiration_date is NULL, it means the session is not temporary
    -- If expiration_date has a value, it means the session is temporary
    -- This modified version removes dependency on is_temporary column
    IF NEW.expiration_date IS NULL THEN
        -- For non-temporary sessions, ensure expiration_date is NULL
        SET NEW.expiration_date = NULL;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_check_id_specialite_insert`;
DELIMITER $$
CREATE TRIGGER `trg_check_id_specialite_insert` BEFORE INSERT ON `seance` FOR EACH ROW BEGIN
  DECLARE id_specialite_module INT;
  DECLARE id_spec_from_ref INT;
  DECLARE error_msg VARCHAR(255);

  -- Get the module's specialty
  SELECT id_specialite INTO id_specialite_module
  FROM module
  WHERE id = NEW.id_module;

  -- Determine the reference specialty (section or group's section)
  IF NEW.id_section IS NOT NULL THEN
    SELECT id_spec INTO id_spec_from_ref
    FROM section
    WHERE id = NEW.id_section;
  ELSEIF NEW.id_groupe IS NOT NULL THEN
    SELECT s.id_spec INTO id_spec_from_ref
    FROM groupe g
    JOIN section s ON g.id_section = s.id
    WHERE g.id = NEW.id_groupe;
  ELSE
    -- Handle NULL case (if allowed)
    SET id_spec_from_ref = NULL;
  END IF;

  -- Check for mismatch
  IF id_spec_from_ref IS NOT NULL AND id_specialite_module != id_spec_from_ref THEN
    SET error_msg = CONCAT(
      'Module specialty (', id_specialite_module, 
      ') does not match reference specialty (', id_spec_from_ref, ')'
    );
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_msg;
  END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_check_id_specialite_update`;
DELIMITER $$
CREATE TRIGGER `trg_check_id_specialite_update` BEFORE UPDATE ON `seance` FOR EACH ROW BEGIN
  DECLARE id_specialite_module INT;
  DECLARE id_spec_from_ref INT;
  DECLARE error_msg VARCHAR(255);

  -- Get the module's specialty (from the NEW value)
  SELECT id_specialite INTO id_specialite_module
  FROM module
  WHERE id = NEW.id_module;

  -- Determine the reference specialty (section or group's section)
  IF NEW.id_section IS NOT NULL THEN
    SELECT id_spec INTO id_spec_from_ref
    FROM section
    WHERE id = NEW.id_section;
  ELSEIF NEW.id_groupe IS NOT NULL THEN
    SELECT s.id_spec INTO id_spec_from_ref
    FROM groupe g
    JOIN section s ON g.id_section = s.id
    WHERE g.id = NEW.id_groupe;
  ELSE
    -- Handle NULL case (if allowed)
    SET id_spec_from_ref = NULL;
  END IF;

  -- Check for mismatch
  IF id_spec_from_ref IS NOT NULL AND id_specialite_module != id_spec_from_ref THEN
    SET error_msg = CONCAT(
      'Module specialty (', id_specialite_module, 
      ') does not match reference specialty (', id_spec_from_ref, ')'
    );
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_msg;
  END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `update_expiration_null`;
DELIMITER $$
CREATE TRIGGER `update_expiration_null` BEFORE UPDATE ON `seance` FOR EACH ROW BEGIN
    -- Similarly for updates
    IF NEW.expiration_date IS NULL THEN
        -- For non-temporary sessions, ensure expiration_date is NULL
        SET NEW.expiration_date = NULL;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `validate_online_session_references`;
DELIMITER $$
CREATE TRIGGER `validate_online_session_references` BEFORE INSERT ON `seance` FOR EACH ROW BEGIN
    -- For online labs and tutorials: must have group, cannot have section
    IF NEW.type_Seance IN ('ONLINELAB', 'ONLINETUTORIAL') THEN
        IF NEW.id_groupe IS NULL OR NEW.id_section IS NOT NULL THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'ONLINELAB/ONLINETUTORIAL must have a group and cannot have a section';
        END IF;
    
    -- For online lectures: must have section, cannot have group
    ELSEIF NEW.type_Seance = 'ONLINELECTURE' THEN
        IF NEW.id_section IS NULL OR NEW.id_groupe IS NOT NULL THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'ONLINELECTURE must have a section and cannot have a group';
        END IF;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `validate_online_session_references_update`;
DELIMITER $$
CREATE TRIGGER `validate_online_session_references_update` BEFORE UPDATE ON `seance` FOR EACH ROW BEGIN
    -- For online labs and tutorials: must have group, cannot have section
    IF NEW.type_Seance IN ('ONLINELAB', 'ONLINETUTORIAL') THEN
        IF NEW.id_groupe IS NULL OR NEW.id_section IS NOT NULL THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'ONLINELAB/ONLINETUTORIAL must have a group and cannot have a section';
        END IF;
    
    -- For online lectures: must have section, cannot have group
    ELSEIF NEW.type_Seance = 'ONLINELECTURE' THEN
        IF NEW.id_section IS NULL OR NEW.id_groupe IS NOT NULL THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'ONLINELECTURE must have a section and cannot have a group';
        END IF;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `validate_online_sessions_no_salle`;
DELIMITER $$
CREATE TRIGGER `validate_online_sessions_no_salle` BEFORE INSERT ON `seance` FOR EACH ROW BEGIN
    IF NEW.type_Seance IN ('ONLINELAB', 'ONLINELECTURE', 'ONLINETUTORIAL') AND NEW.id_salle IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot assign a room to an online session';
    END IF;
    
    IF NEW.type_Seance NOT IN ('ONLINELAB', 'ONLINELECTURE', 'ONLINETUTORIAL') AND NEW.id_salle IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Physical sessions must have a room assigned';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `validate_online_sessions_no_salle_update`;
DELIMITER $$
CREATE TRIGGER `validate_online_sessions_no_salle_update` BEFORE UPDATE ON `seance` FOR EACH ROW BEGIN
    IF NEW.type_Seance IN ('ONLINELAB', 'ONLINELECTURE', 'ONLINETUTORIAL') AND NEW.id_salle IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot assign a room to an online session';
    END IF;
    
    IF NEW.type_Seance NOT IN ('ONLINELAB', 'ONLINELECTURE', 'ONLINETUTORIAL') AND NEW.id_salle IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Physical sessions must have a room assigned';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `validate_salle_soustravaux`;
DELIMITER $$
CREATE TRIGGER `validate_salle_soustravaux` BEFORE INSERT ON `seance` FOR EACH ROW BEGIN
    DECLARE is_under_maintenance TINYINT;

    -- Vérifier si la salle est en travaux
    SELECT soustravaux INTO is_under_maintenance
    FROM salle
    WHERE id = NEW.id_salle;

    -- Si la salle est en travaux, empêcher l'insertion
    IF is_under_maintenance = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La salle est en travaux et ne peut pas être affectée.';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `validate_salle_soustravaux_update`;
DELIMITER $$
CREATE TRIGGER `validate_salle_soustravaux_update` BEFORE UPDATE ON `seance` FOR EACH ROW BEGIN
    DECLARE is_under_maintenance TINYINT;

    -- Vérifier si la salle est en travaux
    SELECT soustravaux INTO is_under_maintenance
    FROM salle
    WHERE id = NEW.id_salle;

    -- Si la salle est en travaux, empêcher la mise à jour
    IF is_under_maintenance = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La salle est en travaux et ne peut pas être affectée.';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `validate_salle_type`;
DELIMITER $$
CREATE TRIGGER `validate_salle_type` BEFORE INSERT ON `seance` FOR EACH ROW BEGIN
    DECLARE salle_type ENUM('LECTURE', 'TUTORIAL', 'LAB', 'ONLINE');

    -- Get the salle type for the given salle ID
    SELECT utilite INTO salle_type FROM salle WHERE id = NEW.id_salle;

    -- Ensure salle type matches seance type exactly
    IF NEW.type_Seance != salle_type THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Salle type does not match seance type';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `validate_teacher_assignments`;
DELIMITER $$
CREATE TRIGGER `validate_teacher_assignments` BEFORE INSERT ON `seance` FOR EACH ROW BEGIN
  IF NEW.id_enseignant IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM enseignant_module 
      WHERE id_enseignant = NEW.id_enseignant AND id_module = NEW.id_module
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Teacher is not assigned to this module';
    END IF;
  END IF;

  IF NEW.type_Seance = 'LECTURE' AND NEW.id_groupe IS NOT NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot assign group to LECTURE - only section allowed';
  END IF;

  IF NEW.type_Seance IN ('TUTORIAL', 'LAB') AND NEW.id_section IS NOT NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot assign section to TUTORIAL/LAB - only group allowed';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
CREATE TABLE `section` (
  `id` int NOT NULL,
  `Nom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id_spec` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`id`, `Nom`, `id_spec`) VALUES
(10, '1stSecAi', 8),
(13, '1stSecGl', 11),
(7, '1stSecIsil', 1),
(14, '1stSecSec', 7),
(8, '1stSecSiq', 2),
(11, '2ndSecAi', 8),
(15, '2ndSecSec', 7),
(9, '2ndSecSiq', 2),
(12, '3rdSecAi', 8),
(16, '3rdSecSec', 7),
(17, '4thSecSec', 7);

-- --------------------------------------------------------

--
-- Table structure for table `sondage`
--

DROP TABLE IF EXISTS `sondage`;
CREATE TABLE `sondage` (
  `id` int NOT NULL,
  `id_module` varchar(20) DEFAULT NULL,
  `id_enseignant` int DEFAULT NULL,
  `temps_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_section` int NOT NULL,
  `id_groupe` int DEFAULT NULL,
  `titre` varchar(30) DEFAULT NULL,
  `option_1` varchar(25) DEFAULT NULL,
  `nbr_1` int DEFAULT '0',
  `option_2` varchar(25) DEFAULT NULL,
  `nbr_2` int DEFAULT '0',
  `option_3` varchar(25) DEFAULT NULL,
  `nbr_3` int DEFAULT '0',
  `option_4` varchar(25) DEFAULT NULL,
  `nbr_4` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `specialite`
--

DROP TABLE IF EXISTS `specialite`;
CREATE TABLE `specialite` (
  `id` int NOT NULL,
  `abr` varchar(5) DEFAULT NULL,
  `nom_C` varchar(255) DEFAULT NULL,
  `id_niveau` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `specialite`
--

INSERT INTO `specialite` (`id`, `abr`, `nom_C`, `id_niveau`) VALUES
(1, 'ISIL', 'Ingénierie des Systèmes Informatiques et Logiciels', 'L3'),
(2, 'SIQ', 'Système informatiques', 'L3'),
(4, 'TC', 'Tronc Commun', 'L1'),
(5, 'TC', 'Tronc Commun', 'L2'),
(7, 'SSI', 'Sécurité des Systèmes d’Information', 'M1'),
(8, 'IA', 'Ingénierie des Systèmes Intelligents', 'M1'),
(9, 'TAL', 'Traitement Automatique de la Langue', 'M1'),
(10, 'SIR', 'Systèmes Informatiques et Réseaux', 'M1'),
(11, 'IL', 'Ingénierie du Logiciel', 'M1');

-- --------------------------------------------------------

--
-- Table structure for table `table_metadata`
--

DROP TABLE IF EXISTS `table_metadata`;
CREATE TABLE `table_metadata` (
  `table_name` varchar(100) NOT NULL,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `table_metadata`
--

INSERT INTO `table_metadata` (`table_name`, `last_updated`) VALUES
('admin', '2025-05-24 13:25:19'),
('enseignant', '2025-05-27 16:42:48'),
('enseignant_module', '2025-05-27 10:09:43'),
('etudiant', '2025-05-26 23:15:54'),
('groupe', '2025-05-26 12:36:09'),
('module', '2025-05-26 20:55:03'),
('niveau', '2025-05-24 12:27:47'),
('salle', '2025-05-26 15:21:18'),
('section', '2025-05-26 12:23:05'),
('specialite', '2025-05-23 18:01:41');

-- --------------------------------------------------------

--
-- Table structure for table `voters`
--

DROP TABLE IF EXISTS `voters`;
CREATE TABLE `voters` (
  `id` int NOT NULL,
  `poll_id` int NOT NULL,
  `id_etud` int DEFAULT NULL,
  `choix` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enseignant`
--
ALTER TABLE `enseignant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nom_prenom_enseignant` (`nom`,`prenom`);

--
-- Indexes for table `enseignant_module`
--
ALTER TABLE `enseignant_module`
  ADD PRIMARY KEY (`id_enseignant`,`id_module`),
  ADD KEY `fk_enseignant_module_module` (`id_module`);

--
-- Indexes for table `EnsPreferences`
--
ALTER TABLE `EnsPreferences`
  ADD PRIMARY KEY (`id_enseignant`);

--
-- Indexes for table `etudiant`
--
ALTER TABLE `etudiant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_groupe` (`id_groupe`);

--
-- Indexes for table `EtuPreferences`
--
ALTER TABLE `EtuPreferences`
  ADD PRIMARY KEY (`id_etudiant`);

--
-- Indexes for table `etu_ens_salle`
--
ALTER TABLE `etu_ens_salle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_etu_ens_salle_etudiant` (`id_etudiant`),
  ADD KEY `fk_etu_ens_salle_enseignant` (`id_enseignant`),
  ADD KEY `fk_etu_ens_salle_examen_salle` (`id_examen`,`id_salle`);

--
-- Indexes for table `evenement`
--
ALTER TABLE `evenement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_jour_horaire_id_groupe` (`Jour`,`horaire`,`id_groupe`),
  ADD UNIQUE KEY `unique_jour_horaire_id_section` (`Jour`,`horaire`,`id_section`),
  ADD UNIQUE KEY `unique_jour_horaire_id_salle` (`Jour`,`horaire`,`id_salle`),
  ADD UNIQUE KEY `unique_jour_horaire_id_enseignant` (`Jour`,`horaire`,`id_enseignant`),
  ADD KEY `id_salle` (`id_salle`),
  ADD KEY `id_enseignant` (`id_enseignant`),
  ADD KEY `id_module` (`id_module`),
  ADD KEY `id_groupe` (`id_groupe`),
  ADD KEY `fk_seance_section` (`id_section`);

--
-- Indexes for table `examen`
--
ALTER TABLE `examen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_examen_module` (`id_module`),
  ADD KEY `fk_examen_spec` (`id_spec`);

--
-- Indexes for table `examen_salle`
--
ALTER TABLE `examen_salle`
  ADD PRIMARY KEY (`id_examen`,`id_salle`),
  ADD KEY `fk_examen_salle_salle` (`id_salle`);

--
-- Indexes for table `groupe`
--
ALTER TABLE `groupe`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_section_groupe` (`id_section`,`num_Grp`),
  ADD KEY `id_section` (`id_section`);

--
-- Indexes for table `module`
--
ALTER TABLE `module`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_specialite` (`id_specialite`);

--
-- Indexes for table `niveau`
--
ALTER TABLE `niveau`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifAdmEns`
--
ALTER TABLE `notifAdmEns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_salle_booking` (`id_salle`,`Jour`,`horaire`),
  ADD KEY `id_salle` (`id_salle`),
  ADD KEY `id_enseignant` (`id_enseignant`),
  ADD KEY `id_module` (`id_module`),
  ADD KEY `id_groupe` (`id_groupe`),
  ADD KEY `fk_seance_section` (`id_section`),
  ADD KEY `fk_notifadmin_seance` (`id_seance`);

--
-- Indexes for table `notifEnsEtu`
--
ALTER TABLE `notifEnsEtu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_salle_booking` (`id_salle`,`Jour`,`horaire`),
  ADD KEY `id_salle` (`id_salle`),
  ADD KEY `id_enseignant` (`id_enseignant`),
  ADD KEY `id_module` (`id_module`),
  ADD KEY `id_groupe` (`id_groupe`),
  ADD KEY `fk_seance_section` (`id_section`),
  ADD KEY `fk_notifadmin_seance` (`id_seance`);

--
-- Indexes for table `notifEtuAdm`
--
ALTER TABLE `notifEtuAdm`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_salle_booking` (`id_salle`,`Jour`,`horaire`),
  ADD KEY `id_salle` (`id_salle`),
  ADD KEY `id_enseignant` (`id_enseignant`),
  ADD KEY `id_module` (`id_module`),
  ADD KEY `id_groupe` (`id_groupe`),
  ADD KEY `fk_seance_section` (`id_section`),
  ADD KEY `fk_notifadmin_seance` (`id_seance`);

--
-- Indexes for table `salle`
--
ALTER TABLE `salle`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_id_salle` (`id`);

--
-- Indexes for table `seance`
--
ALTER TABLE `seance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_jour_horaire_id_groupe` (`Jour`,`horaire`,`id_groupe`),
  ADD UNIQUE KEY `unique_jour_horaire_id_section` (`Jour`,`horaire`,`id_section`),
  ADD UNIQUE KEY `unique_jour_horaire_id_salle` (`Jour`,`horaire`,`id_salle`),
  ADD UNIQUE KEY `unique_jour_horaire_id_enseignant` (`Jour`,`horaire`,`id_enseignant`),
  ADD KEY `id_salle` (`id_salle`),
  ADD KEY `id_enseignant` (`id_enseignant`),
  ADD KEY `id_module` (`id_module`),
  ADD KEY `id_groupe` (`id_groupe`),
  ADD KEY `fk_seance_section` (`id_section`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nom_id_spec` (`Nom`,`id_spec`),
  ADD KEY `id_spec` (`id_spec`);

--
-- Indexes for table `sondage`
--
ALTER TABLE `sondage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sondage_groupe` (`id_groupe`),
  ADD KEY `fk_sondage_enseignant` (`id_enseignant`),
  ADD KEY `fk_sondage_module` (`id_module`);

--
-- Indexes for table `specialite`
--
ALTER TABLE `specialite`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_abr_niveau` (`abr`,`id_niveau`),
  ADD KEY `fk_specialite_niveau` (`id_niveau`);

--
-- Indexes for table `table_metadata`
--
ALTER TABLE `table_metadata`
  ADD PRIMARY KEY (`table_name`);

--
-- Indexes for table `voters`
--
ALTER TABLE `voters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `poll_id` (`poll_id`,`id_etud`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `enseignant`
--
ALTER TABLE `enseignant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT for table `etudiant`
--
ALTER TABLE `etudiant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `etu_ens_salle`
--
ALTER TABLE `etu_ens_salle`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `evenement`
--
ALTER TABLE `evenement`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `examen`
--
ALTER TABLE `examen`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `groupe`
--
ALTER TABLE `groupe`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `notifAdmEns`
--
ALTER TABLE `notifAdmEns`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT for table `notifEnsEtu`
--
ALTER TABLE `notifEnsEtu`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `notifEtuAdm`
--
ALTER TABLE `notifEtuAdm`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `seance`
--
ALTER TABLE `seance`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `sondage`
--
ALTER TABLE `sondage`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=400;

--
-- AUTO_INCREMENT for table `specialite`
--
ALTER TABLE `specialite`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `voters`
--
ALTER TABLE `voters`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enseignant_module`
--
ALTER TABLE `enseignant_module`
  ADD CONSTRAINT `fk_enseignant_module_enseignant` FOREIGN KEY (`id_enseignant`) REFERENCES `enseignant` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_enseignant_module_module` FOREIGN KEY (`id_module`) REFERENCES `module` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `EnsPreferences`
--
ALTER TABLE `EnsPreferences`
  ADD CONSTRAINT `EnsPreferences_ibfk_1` FOREIGN KEY (`id_enseignant`) REFERENCES `enseignant` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `etudiant`
--
ALTER TABLE `etudiant`
  ADD CONSTRAINT `fk_etudiant_groupe` FOREIGN KEY (`id_groupe`) REFERENCES `groupe` (`id`);

--
-- Constraints for table `etu_ens_salle`
--
ALTER TABLE `etu_ens_salle`
  ADD CONSTRAINT `fk_etu_ens_salle_enseignant` FOREIGN KEY (`id_enseignant`) REFERENCES `enseignant` (`id`),
  ADD CONSTRAINT `fk_etu_ens_salle_etudiant` FOREIGN KEY (`id_etudiant`) REFERENCES `etudiant` (`id`),
  ADD CONSTRAINT `fk_etu_ens_salle_examen_salle` FOREIGN KEY (`id_examen`,`id_salle`) REFERENCES `examen_salle` (`id_examen`, `id_salle`);

--
-- Constraints for table `examen`
--
ALTER TABLE `examen`
  ADD CONSTRAINT `fk_examen_module` FOREIGN KEY (`id_module`) REFERENCES `module` (`id`),
  ADD CONSTRAINT `fk_examen_specialite` FOREIGN KEY (`id_spec`) REFERENCES `specialite` (`id`);

--
-- Constraints for table `examen_salle`
--
ALTER TABLE `examen_salle`
  ADD CONSTRAINT `fk_examen_salle_examen` FOREIGN KEY (`id_examen`) REFERENCES `examen` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_examen_salle_salle` FOREIGN KEY (`id_salle`) REFERENCES `salle` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `groupe`
--
ALTER TABLE `groupe`
  ADD CONSTRAINT `fk_groupe_section` FOREIGN KEY (`id_section`) REFERENCES `section` (`id`);

--
-- Constraints for table `module`
--
ALTER TABLE `module`
  ADD CONSTRAINT `fk_module_specialite` FOREIGN KEY (`id_specialite`) REFERENCES `specialite` (`id`);

--
-- Constraints for table `notifAdmEns`
--
ALTER TABLE `notifAdmEns`
  ADD CONSTRAINT `fk_notifadmin_seance` FOREIGN KEY (`id_seance`) REFERENCES `seance` (`id`);

--
-- Constraints for table `seance`
--
ALTER TABLE `seance`
  ADD CONSTRAINT `fk_seance_enseignant` FOREIGN KEY (`id_enseignant`) REFERENCES `enseignant` (`id`),
  ADD CONSTRAINT `fk_seance_groupe` FOREIGN KEY (`id_groupe`) REFERENCES `groupe` (`id`),
  ADD CONSTRAINT `fk_seance_module` FOREIGN KEY (`id_module`) REFERENCES `module` (`id`),
  ADD CONSTRAINT `fk_seance_salle` FOREIGN KEY (`id_salle`) REFERENCES `salle` (`id`),
  ADD CONSTRAINT `fk_seance_section` FOREIGN KEY (`id_section`) REFERENCES `section` (`id`);

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `fk_section_specialite` FOREIGN KEY (`id_spec`) REFERENCES `specialite` (`id`);

--
-- Constraints for table `sondage`
--
ALTER TABLE `sondage`
  ADD CONSTRAINT `fk_sondage_enseignant` FOREIGN KEY (`id_enseignant`) REFERENCES `enseignant` (`id`),
  ADD CONSTRAINT `fk_sondage_groupe` FOREIGN KEY (`id_groupe`) REFERENCES `groupe` (`id`),
  ADD CONSTRAINT `fk_sondage_module` FOREIGN KEY (`id_module`) REFERENCES `module` (`id`);

--
-- Constraints for table `specialite`
--
ALTER TABLE `specialite`
  ADD CONSTRAINT `fk_specilite_niveau` FOREIGN KEY (`id_niveau`) REFERENCES `niveau` (`id`);

--
-- Constraints for table `voters`
--
ALTER TABLE `voters`
  ADD CONSTRAINT `voters_ibfk_1` FOREIGN KEY (`poll_id`) REFERENCES `sondage` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
