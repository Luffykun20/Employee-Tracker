const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'Mugiwar@2020!',
      database: 'deparments_info'
    },
    console.log(`Connected to the deparments_info database.`)
  );



function init() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "What would you like to request?",
            choices: ["View all deparments", "View all roles", ""]
        }
    ])
}
