CREATE TABLE `competitionPlayers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competitionId` int NOT NULL,
	`userId` int NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`correctCount` int NOT NULL DEFAULT 0,
	`finishedAt` timestamp,
	CONSTRAINT `competitionPlayers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `competitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`creatorId` int NOT NULL,
	`inviteCode` varchar(24) NOT NULL,
	`status` enum('pending','active','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `competitions_id` PRIMARY KEY(`id`),
	CONSTRAINT `competitions_inviteCode_unique` UNIQUE(`inviteCode`)
);
--> statement-breakpoint
CREATE TABLE `dailyQuotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`text` text NOT NULL,
	`source` varchar(255) NOT NULL,
	`quoteDate` varchar(10) NOT NULL,
	CONSTRAINT `dailyQuotes_id` PRIMARY KEY(`id`),
	CONSTRAINT `dailyQuotes_quoteDate_unique` UNIQUE(`quoteDate`)
);
--> statement-breakpoint
CREATE TABLE `errorBank` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questionId` int NOT NULL,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `errorBank_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `folderQuestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`folderId` int NOT NULL,
	`prompt` text NOT NULL,
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `folderQuestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`quizId` int NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`correctCount` int NOT NULL DEFAULT 0,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`durationSeconds` int NOT NULL DEFAULT 0,
	CONSTRAINT `quizAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizQuestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`position` int NOT NULL,
	`prompt` text NOT NULL,
	`imageUrl` text,
	`optionA` text NOT NULL,
	`optionB` text NOT NULL,
	`optionC` text NOT NULL,
	`optionD` text NOT NULL,
	`correctOption` enum('A','B','C','D') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quizQuestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentFolders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `studentFolders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supportSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(160) NOT NULL DEFAULT 'الدعم الفني',
	`contactText` text NOT NULL,
	`contactUrl` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supportSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videoLessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`videoUrl` text NOT NULL,
	`thumbnailUrl` text,
	`isPublished` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `videoLessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deviceHash` varchar(128) NOT NULL,
	`userId` int,
	`email` varchar(320),
	`name` text,
	`visitCount` int NOT NULL DEFAULT 1,
	`firstVisitedAt` timestamp NOT NULL DEFAULT (now()),
	`lastVisitedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastPath` varchar(255),
	CONSTRAINT `visitLog_id` PRIMARY KEY(`id`),
	CONSTRAINT `visitLog_deviceHash_unique` UNIQUE(`deviceHash`)
);
--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `questions` int NOT NULL DEFAULT 11;--> statement-breakpoint
ALTER TABLE `quizzes` ADD `coverImageUrl` text;