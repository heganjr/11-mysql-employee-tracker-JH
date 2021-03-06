const mysql = require("mysql2");
const inquirer = require(`inquirer`);
const util = require("util");
const { connect } = require("http2");
const cTable = require("console.table");
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

  switch (answers.task) {
    case "Add":
      addIntoEmployeeDB();
      break;

    case "View":
      viewEmployeeDB();
      break;

    case "Update":
      updateEmployeeDB();
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

    case "Departments":
      departmentsAdd();
      break;

    case "Roles":
      rolesAdd();
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
  // Manager_id = null = employee is a manager
  const managerArray = getEmployeeTableFromDb.map((manager) => ({
    name: `${manager.first_name} ${manager.last_name}`,
    value: manager.id,
  }));
  // get the manager's id and link to the employee of their manager
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

  // try {
  await connection.query(
    "INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_status) VALUES (?, ?, ?, ?, ?)",
    [
      employeeAnswers.first_name,
      employeeAnswers.last_name,
      employeeAnswers.role_id,
      employeeAnswers.manager_id,
      employeeAnswers.manager_status,
    ],
    
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} row inserted!\n`);
      console.log("Employee add success!")
      // Call updateProduct AFTER the INSERT completes
      connection.end();
    }
  );
  // Connection query is not a promise - using try and catch can lead to bugs/issues
  // }

  // catch (error) {
  //   console.error(error);
  // }
}
// connection end bug - doesnt end connection if placed within query, ends but doesnt update query

// HERE IS THE OBJECT THROW IT IN THE PLACEHOLDER (?) and Generate tables

async function departmentsAdd() {
  const departmentAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "department_name",
      message: "What is the name of the new department?",
    },
  ]);

  try {
    connection.query("INSERT into departments (department_name) VALUES (?)", [
      departmentAnswers.department_name,
    ]);
    console.log("Department added!");
  } catch (error) {
    console.error(error);
  }
  connection.end();
}

async function rolesAdd() {
  const getDepartmentTableFromDB = await connection.query(
    "SELECT * from departments"
  );
  console.log(getDepartmentTableFromDB);
  const departmentArray = await getDepartmentTableFromDB.map((departments) => ({
    name: departments.department_name,
    value: departments.id,
  }));
  const newRoleQuestions = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of the new role?",
    },
    {
      type: "number",
      name: "salary",
      message: "How much salary does this role receive?",
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department is this role in?",
      choices: departmentArray,
    },
  ]);
  console.log(newRoleQuestions);
  try {
    await connection.query(
      "INSERT into roles (title, salary,department_id) VALUES (?, ?, ?)",
      [
        newRoleQuestions.title,
        newRoleQuestions.salary,
        newRoleQuestions.department_id,
      ]
    );
    console.log("New role added!");
  } catch (error) {
    console.error(error);
  }
  connection.end();
}

async function viewEmployeeDB() {
  const whichTableToView = await inquirer.prompt([
    {
      type: "list",
      name: "chosenTable",
      message: "What would you like to view?",
      choices: ["Employees", "Departments", "Roles"],
    },
  ]);

  switch (whichTableToView.chosenTable) {
    case "Employees":
      employeeTableView();
      break;

    case "Departments":
      departmentsTableView();
      break;

    case "Roles":
      rolesTableView();
      break;
  }
}

async function employeeTableView() {
  const employeeTable = await connection.query("SELECT * FROM employees");
  console.table(employeeTable);
  connection.end();
}

async function departmentsTableView() {
  const employeeDepartments = await connection.query(
    "SELECT * FROM departments"
  );
  console.table(employeeDepartments);
  connection.end();
}

async function rolesTableView() {
  const employeeRoles = await connection.query("SELECT * FROM roles");
  console.table(employeeRoles);
  connection.end();
}

async function updateEmployeeDB() {
  const whichTableToUpdate = await inquirer.prompt([
    {
      type: "list",
      name: "chosenTable",
      message: "What would you like to update?",
      choices: ["Employees", "Departments", "Roles"],
    },
  ]);

  switch (whichTableToUpdate.chosenTable) {
    case "Employees":
      updateEmployees();
      break;

    // case "Departments":
    //   updateDepartments();
    //   break;

    // case "Roles":
    //   updateRoles();
    //   break;
    // WILL BE UPDATED AT A LATER POINT
  }
}

async function updateEmployees() {
  const getEmployeesTableFromDB = await connection.query(
    "SELECT * FROM employees"
  );
  const employeeTables = getEmployeesTableFromDB.map((employees) => ({
    name: `${employees.first_name} ${employees.last_name}`,
    value: employees.id,
  }));

  const getRolesTableFromDB = await connection.query("SELECT * FROM roles");
  const employeeRoles = getRolesTableFromDB.map((roles) => ({
    name: roles.title,
    value: roles.id,
  }));

  const updateQuestions = await inquirer.prompt([
    {
      type: "list",
      name: "employeeSelection",
      message: "Which employee would you like to update?",
      choices: employeeTables,
    },
    {
      type: "list",
      name: "roleSelection",
      message: "What is their new role?",
      choices: employeeRoles,
    },
  ]);
  connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [
    updateQuestions.roleSelection,
    updateQuestions.employeeSelection,
  ]);
  connection.end();
}

initialise();

// see icecream CRUD 9 - Keys same as column names allows pass the object.

// create database based on readme instructions - DONE

//Build a command-line application that users can:

// Add departments, roles, employees tables

//employee table:
//prompt for employee first name, last name, manager name, role title - Done
//based on manager name, get manager id
//based on role title, get role id
//isert record into database- Done

//role table:
//prompt for role name and department name
//based on department name, get department ID
//insert record into database

//ask user if they want to view or update db entries - Done

// View (departments, roles, employees)
//prompt user to choose dept, role or employee
//based on user choice, get list of depts, roles or employees from database

// Update employee roles
//prompt user for name of employee to update
//ask them which field they want to update (first name, last name, manager name, role title)
//prompt user to enter new value for that field
//update db entry with user input

try {
  
} catch (error) {
  
}