const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./database");
require("console.table");

const actions = {
  VIEW_EMPLOYEES: 'viewEmployees',
  VIEW_EMPLOYEES_BY_DEPARTMENT: 'viewEmployeesByDept',
  VIEW_EMPLOYEES_BY_MANAGER: 'viewEmployeesByMgr',
  ADD_EMPLOYEE: 'addEmployee',
  REMOVE_EMPLOYEE: 'removeEmployee',
  UPDATE_EMPLOYEE_ROLE: 'updateEmployeeRole',
  UPDATE_EMPLOYEE_MANAGER: 'updateEmployeeMgr',
  VIEW_DEPARTMENTS: 'viewDept',
  ADD_DEPARTMENT: 'addDept',
  REMOVE_DEPARTMENT: 'removeDept',
  VIEW_ROLES: 'viewRoles',
  ADD_ROLE: 'addRole',
  REMOVE_ROLE: 'removeRole',
  EXIT: 'exit',
}

const questions = async () => {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to work on today?",
      choices: [
        {
          name: "View All Company Employees",
          value: actions.VIEW_EMPLOYEES
        },
        {
          name: "View THE Employees By Department",
          value: actions.VIEW_EMPLOYEES_BY_DEPARTMENT
        },
        {
          name: "View THE Employees By Manager",
          value: actions.VIEW_EMPLOYEES_BY_MANAGER
        },
        {
          name: "Add Employee",
          value: actions.ADD_EMPLOYEE
        },
        {
          name: "Remove Employee",
          value: actions.REMOVE_EMPLOYEE
        },
        {
          name: "Update Role of Employee",
          value: actions.UPDATE_EMPLOYEE_ROLE
        },
        {
          name: "Update Employee Manager",
          value: actions.UPDATE_EMPLOYEE_MANAGER
        },
        {
          name: "View All Roles",
          value: actions.VIEW_ROLES
        },
        {
          name: "Add Role",
          value: actions.ADD_ROLE
        },
        {
          name: "Remove Role",
          value: actions.REMOVE_ROLE
        },
        {
          name: "View All Departments",
          value: actions.VIEW_DEPARTMENTS
        },
        {
          name: "Add Department",
          value: actions.ADD_DEPARTMENT
        },
        {
          name: "Remove Department",
          value: actions.REMOVE_DEPARTMENT
        },
        {
          name: "EXIT",
          value: actions.EXIT
        }
      ]
    }
  ]);

  // Call the appropriate function depending on what the user chose
  switch (choice) {
    case actions.VIEW_EMPLOYEES:
      return showEmployees();
    case actions.VIEW_EMPLOYEES_BY_DEPARTMENT:
      return showEmployeesByDept();
    case actions.VIEW_EMPLOYEES_BY_MANAGER:
      return showEmployeesByMgr();
    case actions.ADD_EMPLOYEE:
      return addEmployee();
    case actions.REMOVE_EMPLOYEE:
      return deleteEmployee();
    case actions.UPDATE_EMPLOYEE_ROLE:
      return updateEmployeeRole();
    case actions.UPDATE_EMPLOYEE_MANAGER:
      return changeEmployeeMgr();
    case actions.VIEW_DEPARTMENTS:
      return viewDepartments();
    case actions.ADD_DEPARTMENT:
      return addDepartment();
    case actions.REMOVE_DEPARTMENT:
      return removeDepartment();
    case actions.VIEW_ROLES:
      return viewRoles();
    case actions.ADD_ROLE:
      return addRole();
    case actions.REMOVE_ROLE:
      return removeRole();
    case actions.EXIT:
    default:
      return quit();
  }
}


start();

function start() {
  const Text = logo({ name: "HR Employee Tracker" }).render();

  console.log(Text);

  questions();
}

const showEmployees = async () => {
  const employees = await db.findAllEmployees();

  console.log("\n");
  console.table(employees);

  questions();
}

const showEmployeesByDept = async () => {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to go into to see employees?",
      choices: departmentChoices
    }
  ]);

  const employees = await db.findAllEmployeesByDepartment(departmentId);

  console.log("\n");
  console.table(employees);

  questions();
}

const showEmployeesByMgr = async () => {
  const managers = await db.findAllEmployees();

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which employee do you need to know who is their direct report?",
      choices: managerChoices
    }
  ]);

  const employees = await db.findAllEmployeesByManager(managerId);

  console.log("\n");

  if (employees.length === 0) {
    console.log("The selected employee does not report to anyone");
  } else {
    console.table(employees);
  }

  questions();
}

const deleteEmployee = async () => {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to delete?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Deleted employee from the employees database");

  questions();
}

const updateEmployeeRole = async () => {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role do you want to update?",
      choices: employeeChoices
    }
  ]);

  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee?",
      choices: roleChoices
    }
  ]);

  await db.updateEmployeeRole(employeeId, roleId);

  console.log("Updated employee's role");

  questions();
}

const changeEmployeeMgr = async () => {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's manager do you want to update?",
      choices: employeeChoices
    }
  ]);

  const managers = await db.findAllPossibleManagers(employeeId);

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message:
        "Which employee do you want to set as manager for the selected employee?",
      choices: managerChoices
    }
  ]);

  await db.updateEmployeeManager(employeeId, managerId);

  console.log("Updated employee's manager");

  questions();
}

const viewRoles = async () => {
  const roles = await db.findAllRoles();

  console.log("\n");
  console.table(roles);

  questions();
}

const addRole = async () => {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const role = await prompt([
    {
      name: "title",
      message: "What is the name of the role?"
    },
    {
      name: "salary",
      message: "What is the salary of the role?"
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department does the role belong to?",
      choices: departmentChoices
    }
  ]);

  await db.createRole(role);

  console.log(`Added ${role.title} to the database`);

  questions();
}

const removeRole = async () => {
  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message:
        "Which role do you want to delete? (Warning: This will also delete employees)",
      choices: roleChoices
    }
  ]);

  await db.removeRole(roleId);

  console.log("Removed the role from database");

  questions();
}

const viewDepartments = async () => {
  const departments = await db.findAllDepartments();

  console.log("\n");
  console.table(departments);

  questions();
}

const addDepartment = async () => {
  const department = await prompt([
    {
      name: "name",
      message: "What is the name of the department?"
    }
  ]);

  await db.createDepartment(department);

  console.log(`Added ${department.name} to the database`);

  questions();
}

const removeDepartment = async () => {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt({
    type: "list",
    name: "departmentId",
    message:
      "Which department would you like to delete? (Warning: This will also delete associated roles and employees)",
    choices: departmentChoices
  });

  await db.removeDepartment(departmentId);

  console.log(`Deleted department from the database`);

  questions();
}

const addEmployee = async () => {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "What is the employee's role?",
    choices: roleChoices
  });

  employee.role_id = roleId;

  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({ name: "None", value: null });

  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Who is the employee's manager?",
    choices: managerChoices
  });

  employee.manager_id = managerId;

  await db.createEmployee(employee);

  console.log(
    `Added ${employee.first_name} ${employee.last_name} to the employee database`
  );

  questions();
}

const quit = () => {
  console.log("Thanks for using this!");
  process.exit();
}
