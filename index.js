// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table')
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'Mugiwar@2020!',
        database: 'departments_info'
    },
    console.log(`Connected to the deparments_info database.`)
);
db.connect(() => {
    init()
})

// function that starts the application and shows the prompts menu
function init() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "What would you like to request?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add department",
                "Add role",
                "Add employee",
                "Update employee role"]

        }
    ]).then(responds => {
        if (responds.options === "View all departments") {
            viewDepartments()
        } else if (responds.options === "View all roles") {
            viewRoles()
        } else if (responds.options === "View all employees") {
            viewEmployees()
        } else if (responds.options === "Add department") {
            addDepartment()
        } else if (responds.options === "Add role") {
            addRole()
        } else if (responds.options === "Add employee") {
            addEmployee()
        } else if (responds.options === "Update employee role") {
            updateEmployeeRole()
        }
    })
}
// shows all departments
function viewDepartments() {
    db.query("SELECT * FROM departments", (err, data) => {
        console.table(data)
        init()
    })
}

//shows all roles
function viewRoles() {
    db.query("SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles INNER JOIN departments ON roles.department_id = departments.id", (err, data) => {
        console.table(data)
        init()
    })
}

//shows all employees
function viewEmployees() {
    db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title,
    departments.name AS department, roles.salary,
    CONCAT (manager.first_name, " ", manager.last_name)
    AS manager FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id`, (err, data) => {
        console.table(data)
        init()
    })
}

// add new department into database
function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "addDepartment",
        message: "What is the new department would you like to add?",
    }])
        .then(responds => {
            db.query("INSERT INTO departments(name) VALUES(?)", [responds.addDepartment], (err) => {
                console.log(`New department has been added sucessfully!`)
                init()
            })
        })
}

//add new role to a selected department into database
function addRole() {
    db.query("SELECT name ,id value FROM departments",(err, data) => {
        
    
    inquirer.prompt([{
        type: "input",
        name: "addRole",
        message: "What is the new role would you like to add?",
    },
    {
        type: "input",
        name: "salary",
        message: "What is the salary for the new role?"
    },
    {
        type: "list",
        name: "departmentId",
        message: "Which department does the new role belongs to?",
        choices: data
    }
    ])
        .then(responds => {

            db.query(
                `INSERT INTO roles(title, salary, department_id) VALUES(?, ?, ${parseInt(responds.departmentId)})`,
                [responds.addRole, responds.salary, responds.departmentId], (err) => {
                    console.log(`New role has been added sucesfully`)
                    init()
                })
        })
    })
}

//add new employee into the database
function addEmployee() {
    db.query("SELECT title name, id value FROM roles", (err, data) => {
        db.query("SELECT CONCAT(first_name,' ', last_name) name, id value FROM employees", (err, newData) => {

       
        
    
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "What is the new employee's first name?"
    },
    {
        type: "input",
        name: "lastName",
        message: "What is the new employee's last name?"
    },
    {
        type: "list",
        name: "roleId",
        message: "What is the new employee's role?",
        choices: data
    },
    {
        type: "list",
        name: "managerId",
        message: "Who is the new employee's manager?",
        choices: newData
    }])
        .then(responds => {
            db.query(
                `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES(?, ?, ${parseInt(responds.roleId)}, ${parseInt(responds.managerId)})`,
                [responds.name, responds.lastName, responds.roleId, responds.managerId], (err) => {
                    console.log(`New employee has been added sucesfully`)
                    init()
                })
        })
    })
    })
    }

// update employee's role into datase
function updateEmployeeRole() {
    db.query("SELECT CONCAT(first_name,' ', last_name) name , id value FROM employees", (err, data) => {
        db.query("SELECT title name, id value FROM roles ", (err, roleData) => {

        
    
    inquirer.prompt([{
        type: "list",
        name: "employeeUpdate",
        message: "Which employee's role would you like to update?",
        choices: data
    },
    {
        type: "list",
        name: "newRole",
        message: "Which new role would you like to assign for the selected employee?",
        choices: roleData
    }])
        .then(responds => {
            db.query(
                "UPDATE employees SET role_id =? WHERE id=?",
                [responds.newRole, responds.employeeUpdate], (error) => {
                    init()
                }
            )
        })
    }) 
})
}