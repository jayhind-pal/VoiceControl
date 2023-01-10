const sql = require("./db.js");
const jwt = require('jsonwebtoken');

// constructor
const Task = function(fields) {
  // this.task_name = fields.task_name;
  // this.task_image = fields.task_image;
  // this.status = fields.status;
  for ( const key in fields ) {
      this[key] = fields[key];
  }
};
Task.create = (newtask, result) => {
  sql.query("INSERT INTO task SET ?", newtask, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newtask });
  });
};
Task.findById = (id, result) => {
  sql.query(`SELECT * FROM task WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    // not found task with the id
    result({ kind: "not_found" }, null);
  });
};
Task.getAll = (category_id, result) => {
  let query = "SELECT * FROM task";
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
Task.updateById = (id, task, result) => {
  sql.query(
    "UPDATE task SET ? WHERE id = ?",
    [task, id],
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
      result(null, { id: id, ...task });
    }
  );
};
Task.remove = (id, result) => {
  sql.query("DELETE FROM task WHERE id = ?", id, (err, res) => {
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
module.exports = Task;