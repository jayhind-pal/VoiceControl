const sql = require("./db.js");
const jwt = require('jsonwebtoken');

// constructor
const Category = function(fields) {
  // this.category_name = fields.category_name;
  // this.category_image = fields.category_image;
  // this.status = fields.status;
  for ( const key in fields ) {
      this[key] = fields[key];
  }
};
Category.create = (newCategory, result) => {
  sql.query("INSERT INTO category SET ?", newCategory, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newCategory });
  });
};
Category.findById = (id, result) => {
  sql.query(`SELECT * FROM category WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    // not found Category with the id
    result({ kind: "not_found" }, null);
  });
};
Category.getAll = (category_name, result) => {
  let query = "SELECT * FROM category";
  if (category_name) {
    query += ` WHERE category_name LIKE '%${category_name}%'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};
Category.updateById = (id, Category, result) => {
  sql.query(
    "UPDATE category SET ? WHERE id = ?",
    [Category, id],
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
      result(null, { id: id, ...Category });
    }
  );
};
Category.remove = (id, result) => {
  sql.query("DELETE FROM category WHERE id = ?", id, (err, res) => {
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
module.exports = Category;