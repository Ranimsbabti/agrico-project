-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2026 at 10:17 PM
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
-- Database: `agrico`
--

-- --------------------------------------------------------

--
-- Table structure for table `avis`
--

CREATE TABLE `avis` (
  `id` int(11) NOT NULL,
  `auteur_id` int(11) NOT NULL,
  `cible_id` int(11) NOT NULL,
  `type_cible` enum('service','produit','utilisateur','') NOT NULL DEFAULT '',
  `note` tinyint(3) UNSIGNED NOT NULL,
  `commentaire` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `commandes`
--

CREATE TABLE `commandes` (
  `id` int(11) NOT NULL,
  `fournisseur_id` int(11) NOT NULL,
  `agriculteur_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix_total` decimal(10,2) NOT NULL,
  `statut` enum('en attente','confirme','refuse','livre') NOT NULL,
  `date_commande` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_livraison` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `depenses`
--

CREATE TABLE `depenses` (
  `id` int(11) NOT NULL,
  `agriculteur_id` int(11) NOT NULL,
  `type` enum('commande','reservation','','') NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `description` varchar(100) NOT NULL,
  `ref_id` int(11) NOT NULL,
  `date_depense` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disponibilites`
--

CREATE TABLE `disponibilites` (
  `id` int(11) NOT NULL,
  `prestataire_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `heure_debut` text NOT NULL,
  `heure_fin` text NOT NULL,
  `disponible` enum('disponible','indisponible','','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventaire`
--

CREATE TABLE `inventaire` (
  `id` int(11) NOT NULL,
  `fournisseur_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `stock_actuel` int(11) NOT NULL,
  `stock_min` int(11) NOT NULL,
  `derniere_maj` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produits`
--

CREATE TABLE `produits` (
  `id` int(11) NOT NULL,
  `fournisseur_id` int(11) NOT NULL,
  `titre` varchar(100) NOT NULL,
  `categorie` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `disponible` tinyint(1) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produits`
--

INSERT INTO `produits` (`id`, `fournisseur_id`, `titre`, `categorie`, `description`, `prix`, `stock`, `disponible`, `image_url`, `created_at`) VALUES
(1, 1, 'Semences de Tomate', 'Animaux', 'Excellente qualité pour saison été', 25.50, 100, 0, 'https://cdn.omlet.com/images/originals/rabbit-health-check.jpg', '2026-04-16 13:52:25'),
(2, 1, 'Vache de race', 'ANIMAUX', '', 8.00, 2, 1, 'https://www.produits-laitiers.com/app/uploads/2019/04/7087_CH_19092010_108-1085x695.jpg', '2026-04-16 14:43:47');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `agriculteur_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `prestataire_id` int(11) NOT NULL,
  `date_reservation` date NOT NULL,
  `heure_debut` time(5) NOT NULL,
  `heure_fin` time(5) NOT NULL,
  `prix_total` decimal(10,2) NOT NULL,
  `statut` enum('en attente','refuse','confirme','termine') NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `agriculteur_id`, `service_id`, `prestataire_id`, `date_reservation`, `heure_debut`, `heure_fin`, `prix_total`, `statut`, `notes`, `created_at`) VALUES
(1, 1, 2, 2, '2026-04-08', '19:27:54.00000', '21:27:54.00000', 50.00, 'confirme', 'vfrvberve', '2026-04-15 18:28:52');

-- --------------------------------------------------------

--
-- Table structure for table `revenus`
--

CREATE TABLE `revenus` (
  `id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `type` enum('vente','prestation','autre','') NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `ref_id` int(11) NOT NULL,
  `date_revenu` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `revenus`
--

INSERT INTO `revenus` (`id`, `utilisateur_id`, `type`, `montant`, `description`, `ref_id`, `date_revenu`) VALUES
(1, 2, 'vente', 100.00, ' dfvdvfd', 0, '2026-04-16');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `prestataire_id` int(11) NOT NULL,
  `titre` varchar(100) NOT NULL,
  `categorie` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  `unite` varchar(15) NOT NULL,
  `disponibilite` tinyint(1) NOT NULL,
  `actif` tinyint(1) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `prestataire_id`, `titre`, `categorie`, `description`, `prix`, `unite`, `disponibilite`, `actif`, `image_url`, `created_at`) VALUES
(2, 2, 'Arrosage', 'Arrosage', 'ezfbfhjscnsd', 20.00, 'DT', 1, 1, 'https://images.squarespace-cdn.com/content/v1/5dce958ed647dc2422475bc3/1592551566097-W1KG15ZQTZDKTMYRCMT8/arrosoir-arrosage-low-tech-du-potager-permaculture.jpg', '2026-04-15 18:25:20'),
(3, 1, 'Labour de terre', 'Plantation', 'Tracteur performant, disponible de suite', 150.00, 'hectare', 0, 1, 'https://www.discoverthegreentech.com/wp-content/uploads/2023/01/20210213-tracteur-labour.jpg', '2026-04-16 13:52:35');

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(20) NOT NULL,
  `prenom` varchar(20) NOT NULL,
  `email` varchar(40) NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'membre',
  `telephone` varchar(8) NOT NULL,
  `localisation` varchar(30) DEFAULT NULL,
  `avatar` varchar(255) NOT NULL,
  `bio` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_agriculteur` tinyint(1) DEFAULT 1,
  `is_prestataire` tinyint(1) DEFAULT 1,
  `is_fournisseur` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `mdp`, `role`, `telephone`, `localisation`, `avatar`, `bio`, `created_at`, `updated_at`, `is_agriculteur`, `is_prestataire`, `is_fournisseur`) VALUES
(1, 'Dupont', 'Jean', 'jean.dupont@email.com', 'ahmedlabbeb123', 'prestataire', '12345678', 'Tunis', 'https://i.pravatar.cc/80?img=1', 'Prestataire agricole expérimenté avec 10 ans d\'expérience.', '2026-04-15 18:17:39', '2026-04-15 18:17:39', 1, 1, 1),
(2, 'Martin', 'Marie', 'marie.martin@email.com', 'marwenmarwen1', 'prestataire', '87654321', 'Sfax', 'https://i.pravatar.cc/80?img=2', 'Spécialiste en arrosage et irrigation moderne.', '2026-04-15 18:19:24', '2026-04-15 18:19:24', 1, 1, 1),
(3, 'Leroy', 'Pierre', 'pierre.leroy@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYLC7KzYzS', 'fournisseur', '11223344', 'Sousse', 'https://i.pravatar.cc/80?img=3', 'Fournisseur de matériel agricole de qualité.', '2026-04-16 18:31:09', '2026-04-16 18:31:09', 1, 1, 1),
(4, 'Dubois', 'Sophie', 'sophie.dubois@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYLC7KzYzS', 'fournisseur', '44332211', 'Monastir', 'https://i.pravatar.cc/80?img=4', 'Fournisseur de semences et produits phytosanitaires.', '2026-04-16 18:31:09', '2026-04-16 18:31:09', 1, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `avis`
--
ALTER TABLE `avis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auteur_id` (`auteur_id`),
  ADD KEY `cible_id` (`cible_id`);

--
-- Indexes for table `commandes`
--
ALTER TABLE `commandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fournisseur_id` (`fournisseur_id`),
  ADD KEY `agriculteur_id` (`agriculteur_id`),
  ADD KEY `produit_id` (`produit_id`);

--
-- Indexes for table `depenses`
--
ALTER TABLE `depenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agriculteur_id` (`agriculteur_id`);

--
-- Indexes for table `disponibilites`
--
ALTER TABLE `disponibilites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prestataire_id` (`prestataire_id`);

--
-- Indexes for table `inventaire`
--
ALTER TABLE `inventaire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fournissuer_id` (`fournisseur_id`),
  ADD KEY `produit_id` (`produit_id`);

--
-- Indexes for table `produits`
--
ALTER TABLE `produits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fournissuer_id` (`fournisseur_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agriculteur_id` (`agriculteur_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `prestataire_id` (`prestataire_id`);

--
-- Indexes for table `revenus`
--
ALTER TABLE `revenus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prestataire_id` (`prestataire_id`);

--
-- Indexes for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `avis`
--
ALTER TABLE `avis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `depenses`
--
ALTER TABLE `depenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `disponibilites`
--
ALTER TABLE `disponibilites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventaire`
--
ALTER TABLE `inventaire`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `produits`
--
ALTER TABLE `produits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `revenus`
--
ALTER TABLE `revenus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `avis`
--
ALTER TABLE `avis`
  ADD CONSTRAINT `fk_avis_auteur` FOREIGN KEY (`auteur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `fk_commandes_agriculteur` FOREIGN KEY (`agriculteur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_commandes_fournisseur` FOREIGN KEY (`fournisseur_id`) REFERENCES `utilisateurs` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_commandes_produit` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `depenses`
--
ALTER TABLE `depenses`
  ADD CONSTRAINT `fk_depenses_agriculteur` FOREIGN KEY (`agriculteur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `disponibilites`
--
ALTER TABLE `disponibilites`
  ADD CONSTRAINT `fk_disponibilites_prestataire` FOREIGN KEY (`prestataire_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `inventaire`
--
ALTER TABLE `inventaire`
  ADD CONSTRAINT `fk_inventaire_fournisseur` FOREIGN KEY (`fournisseur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inventaire_produit` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `produits`
--
ALTER TABLE `produits`
  ADD CONSTRAINT `fk_produits_fournisseur` FOREIGN KEY (`fournisseur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_reservations_agriculteur` FOREIGN KEY (`agriculteur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reservations_prestataire` FOREIGN KEY (`prestataire_id`) REFERENCES `utilisateurs` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reservations_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `revenus`
--
ALTER TABLE `revenus`
  ADD CONSTRAINT `fk_revenus_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `fk_services_prestataire` FOREIGN KEY (`prestataire_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
