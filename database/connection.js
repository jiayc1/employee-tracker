const util = require("util");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  //username
  user: "root",
  // Password
  password: "candy123",
  //Database name on mysql
  database: "employees_db"
});

connection.connect();

connection.query = util.promisify(connection.query);

module.exports = connection;
