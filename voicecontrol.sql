-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 21, 2024 at 02:04 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `voicecontrol`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `adminId` int(11) DEFAULT NULL,
  `activity` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `adminId`, `activity`, `createdAt`, `deletedAt`) VALUES
(1, NULL, 'admin@gmail.com deleted user john', '2024-06-20 15:21:24', NULL),
(2, NULL, 'smith updated user andrew', '2024-06-20 15:22:05', NULL),
(3, 1, 'admin modified andrew smith admin', '2024-06-21 09:36:50', NULL),
(4, 1, 'root admin modified albert istein user', '2024-06-21 10:42:52', NULL),
(6, 1, 'root admin deleted sowel chempi user', '2024-06-21 11:30:20', NULL),
(7, 1, 'root admin created allen solly admin', '2024-06-21 11:31:38', NULL),
(8, 1, 'root admin modified allen solly admin', '2024-06-21 11:32:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(20) NOT NULL,
  `password` text NOT NULL,
  `permissions` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `entrydt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `permissions`, `status`, `entrydt`) VALUES
(1, 'root admin', 'admin@gmail.com', '$2b$10$DM7X/0CBq8WF6mscHRu/PeWLiuAurhqaQdHdV6t1lgg6/zbFBJ4uq', 'dashboard,admins,users,activity', 1, '2023-11-07 14:08:19'),
(2, 'andrew smith', 'andrew@tourister.in', '$2b$10$GvyBOIpUpcy5Ks2aTwa8hey3GJL1oA9hg09K6Oy0s.olYvEGNUFbq', 'dashboard,users,activity', 1, '2023-11-08 07:16:55'),
(3, 'john doe', 'john@gmail.com', '$2b$10$3OhbuPvHovbtE4rBn/hEDONt3EKQKEwNOYTXKXjd1SKpYQc2D62LW', 'dashboard', 1, '2024-06-20 07:52:04'),
(4, 'allen solly', 'allen@gmail.com', '$2b$10$L9v/3MdF5m7Y49DpuQOQvOLReWeM1jw5ktvL4mvUQyug8f97d1QYC', 'dashboard,activity', 1, '2024-06-21 11:31:38');

-- --------------------------------------------------------

--
-- Table structure for table `email_verification`
--

CREATE TABLE `email_verification` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` text NOT NULL,
  `entrydt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_verification`
--

INSERT INTO `email_verification` (`id`, `user_id`, `email`, `entrydt`) VALUES
(2, 1, 'john@gmail.com', '2023-11-08 10:28:12'),
(3, 1, 'john@gmail.com', '2023-11-08 10:28:31'),
(4, 1, 'john@gmail.com', '2023-11-08 10:28:45'),
(5, 1, 'john@gmail.com', '2023-11-08 10:29:32'),
(6, 1, 'john@gmail.com', '2023-11-08 10:29:41');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `zipcode` varchar(10) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `entrydt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `dob`, `zipcode`, `email`, `password`, `status`, `entrydt`, `deletedAt`) VALUES
(1, 'John Ngenga', '1992-11-26', '452011', 'john@gmail.com', '$2b$10$DM7X/0CBq8WF6mscHRu/PeWLiuAurhqaQdHdV6t1lgg6/zbFBJ4uq', 1, '2023-11-07 12:00:37', NULL),
(2, 'albert istein', '2024-06-12', '457812', 'albert@gmail.com', '$2b$10$DM7X/0CBq8WF6mscHRu/PeWLiuAurhqaQdHdV6t1lgg6/zbFBJ4uq', 1, '2024-06-20 11:38:55', NULL),
(3, 'sowel chempi', '2004-06-16', '452050', 'sowel@gmail.co', '$2b$10$DM7X/0CBq8WF6mscHRu/PeWLiuAurhqaQdHdV6t1lgg6/zbFBJ4uq', 0, '2024-06-20 11:39:02', '2024-06-21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activities_FK_1` (`adminId`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_verification`
--
ALTER TABLE `email_verification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `email_verification`
--
ALTER TABLE `email_verification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_FK_1` FOREIGN KEY (`adminId`) REFERENCES `admins` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
