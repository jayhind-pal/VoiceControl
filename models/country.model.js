const sql = require("./db.js");
const jwt = require('jsonwebtoken');

// constructor
const Country = function(fields) {
  for ( const key in fields ) {
      this[key] = fields[key];
  }
};

Country.getAll = (name, result) => {
  let query = "SELECT * FROM country";
  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};
module.exports = Country;