const sql = require("./db.js");
const jwt = require('jsonwebtoken');

// constructor
const emailVerification = function(fields) {
  for ( const key in fields ) {
      this[key] = fields[key];
  }
};

emailVerification.findRecord = (id, user_id, email, result) => {
    sql.query(`SELECT * FROM email_verification WHERE id=? AND user_id=? AND email=?`,[id, user_id, email], (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    });
};
emailVerification.create = (newemailVerification, result) => {
  sql.query("INSERT INTO email_verification SET ?", newemailVerification, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newemailVerification });
  });
};
emailVerification.delete = (id, result) => {
    sql.query(`DELETE FROM email_verification WHERE id=?`, id, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, {success: true});
    });
};
module.exports = emailVerification;