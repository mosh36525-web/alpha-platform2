CREATE TABLE `visitArchive` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deviceHash` varchar(128) NOT NULL,
	`userId` int,
	`email` varchar(320),
	`name` text,
	`visitCount` int NOT NULL DEFAULT 1,
	`firstVisitedAt` timestamp,
	`lastVisitedAt` timestamp,
	`lastPath` varchar(255),
	`archivedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitArchive_id` PRIMARY KEY(`id`)
);
