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
  manager_id INT NOT NULL,
  FOREIGN KEY (manager_id) REFERENCES employees(id),
  PRIMARY KEY (id)
);

insert into departments(department_name) values ("HR"),("Finance"),("Customer Service");

insert into roles(title,salary,department_id) values ("Accountant", 65000, 2), ("Manager", 70000, 1), ("HR Receptionist", 50000, 1);

insert into employees(first_name,last_name,role_id,manager_id) values ("Bob","Smith", 2, 1), ("Donna","Edwards", 3, 1);