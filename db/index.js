const mysql = require("mysql2");
const inquirer = require(`inquirer`)

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Eagles!168",
  database: "employeeDB",
});

// create database based on readme instructions - DONE

//Build a command-line application that users can:

// Add departments, roles, employees tables

//employee table:
//prompt for employee first name, last name, manager name, role title
//based on manager name, get manager id
//based on role title, get role id
//isert record into database

//role table:
//prompt for role name and department name
//based on department name, get department ID
//insert record into database

//ask user if they want to view or update db entries

// View (departments, roles, employees)
//prompt user to choose dept, role or employee
//based on user choice, get list of depts, roles or employees from database

// Update employee roles
//prompt user for name of employee to update
//ask them which field they want to update (first name, last name, manager name, role title)
//prompt user to enter new value for that field
//update db entry with user input
