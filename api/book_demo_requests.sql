-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 10-Abr-2026 às 14:58
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sellex`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `book_demo_requests`
--

CREATE TABLE `book_demo_requests` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `business_type` varchar(100) NOT NULL,
  `order_management` varchar(100) NOT NULL,
  `order_volume` varchar(100) NOT NULL,
  `challenge` text NOT NULL,
  `source_url` varchar(255) DEFAULT NULL,
  `submitted_at` datetime DEFAULT current_timestamp(),
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `book_demo_requests`
--

INSERT INTO `book_demo_requests` (`id`, `name`, `email`, `phone`, `business_type`, `order_management`, `order_volume`, `challenge`, `source_url`, `submitted_at`, `created_at`) VALUES
(7, 'Kina Mukumba', 'kinamukumba@gmail.com', '926775029', 'Restaurante', 'Caderno/Manual', '1 - 10', '3y56yw6uwy6ujew75je6u7jeuje', 'http://localhost/sellex_app/', '2026-03-20 16:50:07', '2026-03-20 15:50:10'),
(8, 'Kina Mukumba', 'kinamukumba@gmail.com', '926775029', 'Loja', 'WhatsApp', '10 - 30', '23e3ee3e3e3e3e3e3e3e3e3e', 'http://localhost/sellex_app/', '2026-03-27 13:49:48', '2026-03-27 12:49:48');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `book_demo_requests`
--
ALTER TABLE `book_demo_requests`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `book_demo_requests`
--
ALTER TABLE `book_demo_requests`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
