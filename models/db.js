const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

const connection = mysql.createPool({
    connectionLimit: 10,    
    password: dbConfig.PASSWORD,
    user: dbConfig.USER,
    database: dbConfig.DB,
    host: dbConfig.HOST,
    port: dbConfig.PORT
}); 


module.exports = connection;