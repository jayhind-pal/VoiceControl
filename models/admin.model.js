const sql = require("./db.js");
const jwt = require('jsonwebtoken');

// constructor
const Admin = function(fields) {
  for ( const key in fields ) {
      this[key] = fields[key];
  }
};

Admin.login = (email, result) => {
    sql.query(`SELECT * FROM admins WHERE status=1 AND email = '${email}'`, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      // not found admin with the id
      result({ kind: "not_found" }, null);
    });
};
Admin.findByEmail = (email, result) => {
    sql.query(`SELECT * FROM admins WHERE email = '${email}'`, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      // not found admin with the id
      result({ kind: "not_found" }, null);
    });
};
Admin.getAll = (name, result) => {
  let query = "SELECT * FROM admins";
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
Admin.create = (newadmin, result) => {
  sql.query("INSERT INTO admins SET ?", newadmin, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    const token = jwt.sign(
      { id: res.insertId, email: newadmin.email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    result(null, { token: token, id: res.insertId, ...newadmin });
  });
};
Admin.updateById = (id, Admin, result) => {
  sql.query(
    "UPDATE admins SET ? WHERE id = ?",
    [Admin, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found Tutorial with the id
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...Admin });
    }
  );
};
Admin.getDashboard = (result) => {
  let query = `SELECT COUNT(*)as dashboard FROM users WHERE status=1
    UNION ALL
    SELECT COUNT(*)as dashboard FROM admins WHERE status=1`;
    
    sql.query(query, (err, res) => {
      if (err) {
          result(err, null);
          return;
      }
      
      if (res.length) {
          const dashbaord = {
            users: res[0]['dashboard'],
            admins: res[1]['dashboard'],
          }
          result(null, dashbaord);
          return;
      }
      result({ kind: "not_found" }, null);
    });
};
module.exports = Admin;