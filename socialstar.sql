-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 10, 2023 at 08:48 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `socialstar`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category_name` text NOT NULL,
  `seo_code` text NOT NULL,
  `description` text DEFAULT NULL,
  `category_image` text NOT NULL,
  `help_tips` text NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `entrydt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category_name`, `seo_code`, `description`, `category_image`, `help_tips`, `status`, `entrydt`) VALUES
(1, 'Improve Subscribers on Youtube', 'Improve-Subscribers-on-Youtube', 'Improve Subscribers on Youtube', 'public/category/1648994744266-download.jpg', '', 1, '2023-01-10 07:24:27'),
(2, 'Improve Views on Youtube', 'Improve-Views-on-Youtube', 'Web design, graphics, video editing, logos and more.Improve Views on Youtube', 'public/category/1648994756230-download.jpg', '', 1, '2023-01-10 07:24:37'),
(3, 'Improve Followers on Instagram', 'Improve-Followers-on-Instagram', 'Copywriters, SEO writers, translators and proofreaders.Improve Followers on Instagram', 'public/category/1648994763165-download.jpg', '', 1, '2023-01-10 07:24:50'),
(4, 'Viral Instagram Posts', 'Viral-Instagram-Posts', 'Viral Instagram Posts', 'public/category/1648994770391-download.jpg', '', 1, '2023-01-10 07:29:24'),
(5, 'Improve Shares On Youtube', 'Improve-Shares-On-Youtube', 'Improve Shares On Youtube', '', '', 1, '2023-01-10 07:25:08'),
(6, 'Improve Shares On Facebook', 'Improve-Shares-On-Facebook', 'Improve Shares On Facebook', '', '', 1, '2023-01-10 07:25:16');

-- --------------------------------------------------------

--
-- Table structure for table `email_verification`
--

CREATE TABLE `email_verification` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` text NOT NULL,
  `entrydt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `email_verification`
--

INSERT INTO `email_verification` (`id`, `user_id`, `email`, `entrydt`) VALUES
(9, 8, 'publicserver95@gmail.com', '2022-04-13 04:15:49'),
(10, 8, 'publicserver95@gmail.com', '2022-04-13 04:15:58'),
(12, 10, 'jayhind@yopmail.com', '2022-04-15 17:51:32'),
(13, 11, 'rupesh@yopmail.com', '2022-04-15 17:53:21'),
(14, 12, 'rupesh.pal@yopmail.com', '2022-04-15 17:55:19'),
(15, 13, 'vinod@yopmail.com', '2022-04-15 17:56:55'),
(16, 14, 'rahul@yopmail.com', '2022-04-15 18:01:08'),
(18, 3, 'test2@gmail.com', '2022-12-19 12:22:46'),
(19, 4, 'publicserver95@gmail.com', '2022-12-19 12:23:56'),
(20, 1, 'publicserver95@gmail.com', '2022-12-19 12:25:16'),
(21, 2, 'test11@gmail.com', '2022-12-21 11:54:23'),
(22, 3, 'test11@gmail.com', '2022-12-28 09:29:34');

-- --------------------------------------------------------

--
-- Table structure for table `plan`
--

CREATE TABLE `plan` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `plan_name` text NOT NULL,
  `description` text NOT NULL,
  `price` float NOT NULL,
  `validity` int(11) NOT NULL COMMENT 'in days',
  `status` int(11) NOT NULL DEFAULT 1,
  `entrydt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `plan`
--

INSERT INTO `plan` (`id`, `category_id`, `plan_name`, `description`, `price`, `validity`, `status`, `entrydt`) VALUES
(1, 1, '100 Subscribers', 'Improve Subscribers on Youtube', 100, 30, 1, '2023-01-10 07:14:02');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `star_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `task_url` text NOT NULL,
  `task_attachment` text NOT NULL,
  `description` text NOT NULL,
  `attender_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `expiry` datetime NOT NULL,
  `entrydt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `type` enum('user','star') NOT NULL DEFAULT 'user',
  `name` text NOT NULL,
  `mobile` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `address` text DEFAULT NULL,
  `gender` enum('Male','Female','Other') NOT NULL DEFAULT 'Other',
  `user_image` varchar(100) NOT NULL DEFAULT 'public/company/no-image.png',
  `bank_name` text DEFAULT NULL,
  `branch_name` text DEFAULT NULL,
  `ifsc_code` text DEFAULT NULL,
  `account_no` text DEFAULT NULL,
  `account_holder_name` text DEFAULT NULL,
  `social_id` text DEFAULT NULL,
  `social_type` text DEFAULT NULL,
  `category_id` text DEFAULT NULL,
  `lat` text DEFAULT NULL,
  `lng` text DEFAULT NULL,
  `wallet` float NOT NULL DEFAULT 0,
  `email_verified` int(11) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 1,
  `entrydt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `type`, `name`, `mobile`, `email`, `password`, `address`, `gender`, `user_image`, `bank_name`, `branch_name`, `ifsc_code`, `account_no`, `account_holder_name`, `social_id`, `social_type`, `category_id`, `lat`, `lng`, `wallet`, `email_verified`, `status`, `entrydt`) VALUES
(1, 'user', 'Test', '+911234567890', 'test@gmail.com', '$2b$10$Ka9fx9oiXriykNuyjzgi8OSRQoPRfn1q1QgZnLBN9Q6grW3hwGgXS', 'Indore', 'Male', 'public\\users\\1671623882265-69875452.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, '2022-12-21 12:05:28'),
(2, 'user', 'Test', '+911234567890', 'test@gmail.com', '$2b$10$GjW1Ff4La2KmowqVFGCteegrkzIH5MDdPN4jWdfZ8miX0ucsBWWYS', 'Indore', 'Male', 'public\\users\\1672218744375-69875452.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, '2022-12-28 09:12:24'),
(3, 'user', 'test', NULL, 'test11@gmail.com', '$2b$10$2Q40HBzgKFN1r9eo01MZY.9V2lPdAzI5yJI7pFs9z1MLh97O0324e', NULL, 'Other', 'public/company/no-image.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, '2022-12-28 09:29:33'),
(4, 'user', 'test', NULL, 'test11@gmail.com', NULL, NULL, 'Other', 'public/company/no-image.png', NULL, NULL, NULL, NULL, NULL, 'facebook_id', 'facebook', NULL, NULL, NULL, 0, 0, 1, '2022-12-28 09:32:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_verification`
--
ALTER TABLE `email_verification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plan`
--
ALTER TABLE `plan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
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
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `email_verification`
--
ALTER TABLE `email_verification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `plan`
--
ALTER TABLE `plan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
