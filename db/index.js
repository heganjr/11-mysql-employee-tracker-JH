const mysql = require("mysql2");
const inquirer = require(`inquirer`);
// linking modules

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Eagles!168",
  database: "employeeDB",
});

// connection.connect((err) => {
//   if (err) throw err;
//   console.log(`connected to ${connection.config.database}`);
// });
// Confuses prompt with an additional line

async function initialise() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "task",
      choices: ["Add", "View", "Update"],
      message: "What would you like to do?",
    },
  ]);
  console.log(answers.task);

  switch (answers.task) {
    case "Add":
      addIntoEmployeeDB();
      console.log("Add");
      break;

    case "View":
      viewEmployeeDB();
      console.log("View");
      break;

    case "Update":
      updateEmployeeDB();
      console.log("Update");
      break;
  }
}

async function addIntoEmployeeDB() {
  const tableAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "chosenTable",
      message: "Where would you like to add?",
      choices: ["Employees", "Departments", "Roles"],
    },
  ]);

  switch (tableAnswer.chosenTable) {
    case "Employees":
      employeeAdd();
      break;
  }
}

async function employeeAdd() {
  const employeeAnswers = await inquirer.prompt(
  [
    {
      type: "input",
      name: "first_name",
      message: "Enter the employee's first name",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the employee's last name",
    },
    {
      type: "input",
      name: "role",
      message: "What is the employee's role?",
      // provide a list from exisiting roles?
    },
    {
      type: "input",
      name: "manager",
      message: "Who is the employee's manager?",
      // provide a list from existing managers?
    },
  ]);
  console.log(employeeAnswers)
  connection.end()
}

initialise();

// create database based on readme instructions - DONE

//Build a command-line application that users can:

// Add departments, roles, employees tables

//employee table:
//prompt for employee first name, last name, manager name, role title - Done
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
