-- Create the database
CREATE DATABASE IF NOT EXISTS webstuff_db;

-- Create the user and set password
CREATE USER IF NOT EXISTS 'webstuff_user'@'localhost' IDENTIFIED BY 'root123';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON webstuff_db.* TO 'webstuff_user'@'localhost';
FLUSH PRIVILEGES;

-- Switch to the database
USE webstuff_db;

DROP TABLE IF EXISTS User_Role;
DROP TABLE IF EXISTS Role;
DROP TABLE IF EXISTS User;

-- Create tables in correct order
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    project_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE User_Role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Role(id) ON DELETE CASCADE
);

-- Show databases
SHOW DATABASES;

-- Switch to your database
USE webstuff_db;

-- Show tables
SHOW TABLES;

-- Show users
SELECT user, host FROM mysql.user; 

ALTER USER 'webstuff_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123';
FLUSH PRIVILEGES;
