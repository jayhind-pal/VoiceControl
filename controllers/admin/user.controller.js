const User = require("./../../models/user.model.js");
const jwt = require('jsonwebtoken');

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  // Create a User
  const user = new User({
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email
  });
  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        error: err,
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    else res.send(data);
  });
};

// Retrieve all Users from the database (with condition).
exports.findAll = (req, res) => {
    const name = req.query.name;
    User.getAll(name, (err, data) => {
      if (err)
        res.status(500).send({
          error: err,
          message:
            err.message || "Some error occurred while retrieving users."
        });
      else res.send(data);
    });
};

// Find a single Tutorial with a id
exports.findOne = (req, res) => {
    User.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              error: err,
              message: `Not found User with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              error: err,
              message: "Error retrieving User with id " + req.params.id
            });
          }
        } else res.send(data);
      });
};

// Update a User identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  User.updateById(
    req.params.id,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            error: err,
            message: `Not found User with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            error: err,
            message: "Error updating User with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    User.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              error: err,
              message: `Not found User with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              error: err,
              message: "Could not delete User with id " + req.params.id
            });
          }
        } else res.send({ message: `User was deleted successfully!` });
      });
};
