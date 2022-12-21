const sql = require("./db.js");
const jwt = require('jsonwebtoken');

// constructor
const Project = function(fields) {
  for ( const key in fields ) {
      this[key] = fields[key];
  }
};


Project.findById = (id, result) => {
    sql.query(`SELECT * FROM projects WHERE id = '${id}'`, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      // not found Project with the id
      result({ kind: "not_found" }, null);
    });
};
Project.getAll = (user_id, result) => {
  let query = "SELECT * FROM projects";
  if (user_id) {
    query += ` WHERE user_id = '${user_id}'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};
Project.create = (newProject, result) => {
  sql.query("INSERT INTO projects SET ?", newProject, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newProject });
  });
};
Project.updateById = (id, Project, result) => {
  sql.query(
    "UPDATE projects SET ? WHERE id = ?",
    [Project, id],
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
      result(null, { id: id, ...Project });
    }
  );
};
Project.delete = (id, result) => {
  sql.query("DELETE FROM projects WHERE id = ?", id, (err, res) => {
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

module.exports = Project;