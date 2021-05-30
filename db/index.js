const mysql = require("mysql2");
const inquirer = require(`inquirer`);
const util = require("util");
const { connect } = require("http2");
// additional methods to set up as a promise to fix query promise issue
// linking modules

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "jacob",
  database: "employeeDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected to ${connection.config.database}`);
});

connection.query = util.promisify(connection.query);
// set up of async and await for connection.query to fufill promise

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
  const seeTheNamesofTheRolesButGetTheIdBack = await connection.query(
    "SELECT * FROM roles"
  );
  const rolesArray = seeTheNamesofTheRolesButGetTheIdBack.map((role) => ({
    name: role.title,
    value: role.id,
  }));
  // inquirer accepts this and the user sees the name of the worker and the value of the worker's id is returned

  // await connection.query(
  //   "Select id, manager_id, CASE WHEN id = manager_id THEN true ELSE false END AS manager_status FROM employees"
  // );
  // Compares Id and Manager ID - If both are the same therefore person is a manager and only that name populates in the "Who their manager"

  const getEmployeeTableFromDb = await connection.query(
    "Select * FROM employees WHERE manager_status IS TRUE"
  );
  const managerArray = getEmployeeTableFromDb.map((manager) => ({
    name: `${manager.first_name} ${manager.last_name}`,
    value: manager.id,
  }));
  // get the manager's id and link to the employee of their manager
  console.log(managerArray);
  // how to only show managers and not all employees?
  // if id = manager_id show else, dont show

  const employeeAnswers = await inquirer.prompt([
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
      type: "list",
      name: "role_id",
      message: "What is the employee's role?",
      choices: rolesArray,
      // provide a list from exisiting roles?
    },
    {
      type: "confirm",
      name: "manager_status",
      message: "Is this employee a manager?",
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employee's manager?",
      choices: managerArray,
      when(employeeAnswers) {
        return employeeAnswers.manager_status === false;
      },
      // ask this question when they are not a manager
      // the purpose of return is so inquirer knows what the returned value.

      // provide a list from existing managers?
      // make sure question names are the same as column names!
    },
  ]);
  console.log(employeeAnswers);

  try {
    await connection.query(
      "INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_status) VALUES (?, ?, ?, ?, ?)",
      [
        employeeAnswers.first_name,
        employeeAnswers.last_name,
        employeeAnswers.role_id,
        employeeAnswers.manager_id,
        employeeAnswers.manager_status,
      ],
      console.log("Employee add success!")
    );
  } catch (error) {
    console.error(error);
  }
}

// see icecream CRUD 9 - Keys same as column names allows pass the object.
// HERE IS THE OBJECT THROW IT IN THE PLACEHOLDER (?) and Generate tables

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
