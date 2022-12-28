const sql = require("./db.js");
const jwt = require('jsonwebtoken');

// constructor
const User = function(fields) {
  for ( const key in fields ) {
      this[key] = fields[key];
  }
};

User.login = (email, result) => {
    sql.query(`SELECT * FROM users WHERE status=1 AND email = '${email}'`, (err, res) => {
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

User.findBySocialId = (social_id, result) => {
  sql.query(`SELECT * FROM users WHERE status=1 AND social_id = '${social_id}'`, (err, res) => {
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
    sql.query(`SELECT * FROM users WHERE email = '${email}'`, (err, res) => {
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
    sql.query(`SELECT * FROM users WHERE id = '${id}'`, (err, res) => {
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
User.getAll = (type, result) => {
  let query = "SELECT u.*,c.name as country_name FROM users as u LEFT JOIN country as c ON c.id=u.country";
  if (type) {
    query += ` WHERE type = '${type}'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
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
    "UPDATE users SET ? WHERE id = ?",
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