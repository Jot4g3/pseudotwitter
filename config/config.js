require("dotenv").config();

module.exports = {
  "development": {
    "username": "administrador",
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": "projetoweb2.database.windows.net",
    "dialect": "mssql"
  },
  "test": {
    "username": "administrador",
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": "projetoweb2.database.windows.net",
    "dialect": "mssql"
  },
  "production": {
    "username": "administrador",
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": "projetoweb2.database.windows.net",
    "dialect": "mssql"
  }
}
