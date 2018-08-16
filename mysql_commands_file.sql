create database your_database_name_db;
use your_database_name_db;


CREATE TABLE `users` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(200)  NOT NULL,
 `team` varchar(100)  NOT NULL,
 `address` text  NOT NULL,
 `email` varchar(100) NOT NULL,
 `phone` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;
create table `gw` (
	`num` int(11) not null unique,
    `winid` int(11) not null,
);
