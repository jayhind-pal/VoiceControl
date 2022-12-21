-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 21, 2022 at 01:08 PM
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
  `description` text DEFAULT NULL,
  `category_image` text NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `entrydt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category_name`, `description`, `category_image`, `status`, `entrydt`) VALUES
(1, 'IT & Programming', 'Website development, e-commerce and mobile apps.', 'public/category/1648994744266-download.jpg', 1, '2022-04-13 04:23:51'),
(2, 'Design & Multimedia', 'Web design, graphics, video editing, logos and more.', 'public/category/1648994756230-download.jpg', 1, '2022-04-13 04:23:59'),
(3, 'Writing & Translation', 'Copywriters, SEO writers, translators and proofreaders.', 'public/category/1648994763165-download.jpg', 1, '2022-04-13 04:24:32'),
(4, 'Admin Support', 'Legal', 'public/category/1648994770391-download.jpg', 1, '2022-04-13 04:24:12'),
(5, 'Sales & Marketing', 'Online advertising, social media, SEO, email marketing.', '', 1, '2022-04-13 04:25:00'),
(6, 'Finance & Management', 'Engineering & Manufacturing', '', 1, '2022-04-13 04:25:00');

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
(21, 2, 'test11@gmail.com', '2022-12-21 11:54:23');

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
(2, 'user', '12345', NULL, 'test11@gmail.com', '$2b$10$GjW1Ff4La2KmowqVFGCteegrkzIH5MDdPN4jWdfZ8miX0ucsBWWYS', NULL, 'Other', 'public/company/no-image.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, '2022-12-21 11:54:23');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
