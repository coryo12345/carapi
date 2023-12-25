CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`years` text NOT NULL,
	`body_style` text NOT NULL,
	`region` text NOT NULL,
	`description` text NOT NULL,
	`image` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicles_make_model_body_style_region_unique` ON `vehicles` (`make`,`model`,`body_style`,`region`);