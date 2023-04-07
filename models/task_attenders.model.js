const sql = require("./db.js");
const jwt = require('jsonwebtoken');

// constructor
const TaskAttenders = function(fields) {
  for ( const key in fields ) {
      this[key] = fields[key];
  }
};
TaskAttenders.create = (newTaskAttenders, result) => {
  sql.query("INSERT INTO task_attenders SET ?", newTaskAttenders, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newTaskAttenders });
  });
};
TaskAttenders.findById = (id, result) => {
  sql.query(`SELECT * FROM task_attenders WHERE id = ${id} ORDER BY id DESC`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    // not found TaskAttenders with the id
    result({ kind: "not_found" }, null);
  });
};

TaskAttenders.getAttendersSummary = (star_id, result) => {
  let query = "SELECT t.id as task_id,COUNT(ta.id) AS total_attenders,c.category_name,t.description FROM task AS t LEFT JOIN task_attenders AS ta ON ta.task_id=t.id LEFT JOIN category AS c ON c.id=t.category_id";
  if (star_id) {
    query += ` WHERE t.star_id = '${star_id}'`;
  }

  query += ` GROUP BY t.id ORDER BY t.id DESC`;

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

TaskAttenders.getAll = (task_id, result) => {
  let query = "SELECT u.*,ta.task_id FROM task_attenders AS ta INNER JOIN users AS u ON u.id=ta.user_id";
  if (task_id) {
    query += ` WHERE ta.task_id = '${task_id}'`;
  }

  query += ` ORDER BY ta.id DESC`;

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

TaskAttenders.getAttendedTasks = (user_id, result) => {
  let query = "SELECT t.*,c.category_name,ta.user_id FROM task_attenders AS ta INNER JOIN task AS t ON t.id=ta.task_id LEFT JOIN category AS c ON c.id=t.category_id";
  if (user_id) {
    query += ` WHERE ta.user_id = '${user_id}'`;
  }

  query += ` ORDER BY ta.id DESC`;

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

TaskAttenders.updateById = (id, TaskAttenders, result) => {
  sql.query(
    "UPDATE task_attenders SET ? WHERE id = ?",
    [TaskAttenders, id],
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
      result(null, { id: id, ...TaskAttenders });
    }
  );
};

TaskAttenders.remove = (id, result) => {
  sql.query("DELETE FROM task_attenders WHERE id = ?", id, (err, res) => {
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
module.exports = TaskAttenders;