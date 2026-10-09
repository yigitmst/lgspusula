CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`sender_role` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	`read_by_teacher` integer DEFAULT 0 NOT NULL,
	`read_by_student` integer DEFAULT 0 NOT NULL
);
