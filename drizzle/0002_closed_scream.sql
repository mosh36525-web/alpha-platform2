CREATE TABLE `platformSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platformName` varchar(120) NOT NULL DEFAULT 'ALPHA',
	`logoUrl` text NOT NULL,
	`fontFamily` varchar(120) NOT NULL DEFAULT 'IBM Plex Sans Arabic',
	`primaryColor` varchar(20) NOT NULL DEFAULT '#f2c75d',
	`backgroundColor` varchar(20) NOT NULL DEFAULT '#090b0e',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platformSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','owner','platform_manager','content_moderator','support_moderator') NOT NULL DEFAULT 'user';