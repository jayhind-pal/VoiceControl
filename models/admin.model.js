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
    sql.query(`SELECT COUNT(*)as dashboard FROM category WHERE status=1
        UNION ALL
        SELECT COUNT(*)as dashboard FROM users WHERE type='freelancer' AND status=1
        UNION ALL
        SELECT COUNT(*)as dashboard FROM users WHERE type='client' AND status=1
        UNION ALL
        SELECT COUNT(*)as dashboard FROM posts WHERE status='pending'
        UNION ALL
        SELECT COUNT(*)as dashboard FROM posts WHERE status='awarded'
        UNION ALL
        SELECT COUNT(*)as dashboard FROM posts WHERE status='completed'
        UNION ALL
        SELECT COUNT(*)as dashboard FROM bids`, (err, res) => 
    {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            const dashbaord = {
                categories: res[0]['dashboard'],
                freelancers: res[1]['dashboard'],
                clients: res[2]['dashboard'],
                pendingJobs: res[3]['dashboard'],
                awardedJob: res[4]['dashboard'],
                completedJobs: res[5]['dashboard'],
                bids: res[6]['dashboard']
            }
            result(null, dashbaord);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};
module.exports = Admin;