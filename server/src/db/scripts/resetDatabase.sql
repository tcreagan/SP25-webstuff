-- Drops database if it exists and recreates an empty schema
-- DROPS ENTIRE DATABASE USE WITH CAUTION

DROP DATABASE if EXISTS ws;
CREATE DATABASE ws;

USE ws;
CREATE TABLE User(
  id INT AUTO_INCREMENT,
  email TEXT,
  password_hash VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id),
  UNIQUE(email)
);

CREATE TABLE Project(
  id INT AUTO_INCREMENT,
  owner_id INT,
  project_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id),
  FOREIGN KEY(owner_id) REFERENCES User(id)
);

CREATE TABLE Page(
  id INT AUTO_INCREMENT,
  project_id INT,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id),
  FOREIGN KEY(project_id) REFERENCES Project(id)
);

CREATE TABLE Role(
  id INT AUTO_INCREMENT,
  project_id INT,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id),
  FOREIGN KEY(project_id) REFERENCES Project(id)
);

CREATE TABLE User_Role(
  user_id INT,
  role_id INT,

  PRIMARY KEY(user_id, role_id),
  FOREIGN KEY(user_id) REFERENCES User(id),
  FOREIGN KEY(role_id) REFERENCES Role(id)
);

CREATE TABLE Project_Permission(
  id INT NOT NULL AUTO_INCREMENT,
  project_id INT,
  default_read_new BIT,
  default_write_new BIT,
  admin BIT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id),
  FOREIGN KEY(project_id) REFERENCES Project(id)
);

CREATE TABLE Project_Permission_Page(
  project_permission_id INT,
  page_id INT,
  can_read BIT,
  can_write BIT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(project_permission_id, page_id),
  FOREIGN KEY(project_permission_id) REFERENCES Project_Permission(id),
  FOREIGN KEY(page_id) REFERENCES Page(id)
);

CREATE TABLE User_Type(
  id INT NOT NULL AUTO_INCREMENT,
  type_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id)
);

CREATE TABLE User_User_Type(
  user_id INT,
  user_type_id INT,

  PRIMARY KEY(user_id, user_type_id),
  FOREIGN KEY(user_id) REFERENCES User(id),
  FOREIGN KEY(user_type_id) REFERENCES User_Type(id)
);

CREATE TABLE Site_Permission(
  id INT NOT NULL AUTO_INCREMENT,
  url_pattern VARCHAR(100) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id)
);

CREATE TABLE User_Type_Site_Permission(
  user_type_id INT,
  site_permission_id INT,

  PRIMARY KEY(user_type_id, site_permission_id),
  FOREIGN KEY(user_type_id) REFERENCES User(id),
  FOREIGN KEY(site_permission_id) REFERENCES Site_Permission(id)

);

CREATE TABLE Event_Type(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id)
);

CREATE TABLE Event(
  id INT NOT NULL AUTO_INCREMENT,
  occurred_time DATE NOT NULL,
  event_log TEXT,
  event_type_id INT,
  user_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id),
  FOREIGN KEY(event_type_id) REFERENCES Event_Type(id),
  FOREIGN KEY(user_id) REFERENCES User(id)
);

CREATE TABLE Section_Layout(
  id INT NOT NULL AUTO_INCREMENT,
  content TEXT NOT NULL,
  user_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES User(id)
);

CREATE TABLE Page_Layout(
  id INT NOT NULL AUTO_INCREMENT,
  content TEXT NOT NULL,
  user_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES User(id)
);

CREATE TABLE Widget(
  id INT NOT NULL AUTO_INCREMENT,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(id)
);

CREATE TABLE GDPR_Column(
  table_name VARCHAR(100),
  column_name VARCHAR(100),

  PRIMARY KEY(table_name, column_name)
);


CREATE TABLE Sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
