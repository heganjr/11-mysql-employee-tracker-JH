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

insert into departments(department_name) values ("HR"),("Finance"),("Customer Service"),("Executives"), ("Rangers"),("IT");

insert into roles(title,salary,department_id) values ("Accountant", 65000, 2), ("HR Coordinator", 70000, 1), ("HR Officer", 50000, 1), ("Receptionist", 40000, 3), ("Chief Executive Officer", 150000, 4), ("Owl Handler", 45000, 5), ("Tech Support Officer", 62500, 6);

insert into employees(first_name,last_name,role_id,manager_id, manager_status) values ("Bob","Smith", 2, null, 1), ("Donna","OLeary", 3, 1, 0), ("Harry", "Potter", 6, 1, 0), ("Pam", "Beesly", 4, 1, 0), ("Michael", "Scott", 5, null, 1), ("Gavin", "Hamster", 7, 5, 0);
