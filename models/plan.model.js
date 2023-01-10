const sql = require("./db.js");
const jwt = require('jsonwebtoken');

// constructor
const Plan = function(fields) {
  // this.plan_name = fields.plan_name;
  // this.plan_image = fields.plan_image;
  // this.status = fields.status;
  for ( const key in fields ) {
      this[key] = fields[key];
  }
};
Plan.create = (newplan, result) => {
  sql.query("INSERT INTO plan SET ?", newplan, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newplan });
  });
};
Plan.findById = (id, result) => {
  sql.query(`SELECT * FROM plan WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    // not found plan with the id
    result({ kind: "not_found" }, null);
  });
};
Plan.getAll = (category_id, result) => {
  let query = "SELECT * FROM plan";
  if (category_id) {
    query += ` WHERE category_id = '${category_id}'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};
Plan.updateById = (id, plan, result) => {
  sql.query(
    "UPDATE plan SET ? WHERE id = ?",
    [plan, id],
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
      result(null, { id: id, ...plan });
    }
  );
};
Plan.remove = (id, result) => {
  sql.query("DELETE FROM plan WHERE id = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};
module.exports = Plan;