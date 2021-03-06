DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;
USE employeeDB;
CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR (30) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL (8, 2) NOT NULL,
  department_id INT NOT NULL,
  -- mySQL needs directions on which deparment it relates to
  FOREIGN KEY (department_id) REFERENCES departments(id),
  PRIMARY KEY (id)
);
CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR (30) NOT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  manager_id INT,
  manager_status BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY (manager_id) REFERENCES employees(id),
  PRIMARY KEY (id)
);