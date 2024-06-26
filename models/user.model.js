const sql = require("./db.js");
const jwt = require('jsonwebtoken');

// constructor
const User = function(fields) {
  for ( const key in fields ) {
      this[key] = fields[key];
  }
};

User.login = (email, result) => {
    sql.query(`SELECT * FROM users WHERE status=1 AND deletedAt IS NULL AND email = '${email}'`, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        let user = res[0];

        // Create token
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        user.token = token;
        
        result(null, user);
        return;
      }
      // not found User with the id
      result({ kind: "not_found" }, null);
    });
};

User.findByEmail = (email, result) => {
    sql.query(`SELECT * FROM users WHERE deletedAt IS NULL AND email = '${email}'`, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      // not found User with the id
      result({ kind: "not_found" }, null);
    });
};
User.findById = (id, result) => {
    sql.query(`SELECT * FROM users WHERE deletedAt IS NULL AND id = '${id}'`, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      // not found User with the id
      result({ kind: "not_found" }, null);
    });
};
User.getAll = (result) => {
  let query = "SELECT * FROM users WHERE deletedAt IS NULL";
  sql.query(query, (err, res) => {
    if (err) {
      result(err, []);
      return;
    }
    result(null, res);
  });
};
User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    const token = jwt.sign(
      { id: res.insertId, email: newUser.email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    result(null, { token: token, id: res.insertId, ...newUser });
  });
};
User.updateById = (id, User, result) => {
  sql.query(
    "UPDATE users SET ? WHERE deletedAt IS NULL AND id = ?",
    [User, id],
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
      result(null, { id: id, ...User });
    }
  );
};

module.exports = User;