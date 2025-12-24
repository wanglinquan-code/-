CREATE DATABASE IF NOT EXISTS mall_db;
USE mall_db;

CREATE TABLE `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(100) NOT NULL,
  `role` TINYINT DEFAULT 0
);

-- 插入一条测试数据 (账号: admin, 密码: 123)
INSERT INTO `users` (username, password, role) VALUES ('admin', '123', 1);