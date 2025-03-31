-- Create the database
CREATE DATABASE IF NOT EXISTS webstuff_db;

-- Create the user and set password
CREATE USER IF NOT EXISTS 'webstuff_user'@'localhost' IDENTIFIED BY 'webstuff123';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON webstuff_db.* TO 'webstuff_user'@'localhost';
FLUSH PRIVILEGES;

-- Switch to the database
USE webstuff_db;

-- Create User table
CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Role table
CREATE TABLE IF NOT EXISTS Role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    project_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User_Role table
CREATE TABLE IF NOT EXISTS User_Role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Role(id) ON DELETE CASCADE
); 
