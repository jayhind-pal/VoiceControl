const Task = require("../../models/task.model.js");
const jwt = require('jsonwebtoken');

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
  }

  // Create a task
  const newRecord = new Task({
    star_id: req.body.star_id,
    category_id: req.body.category_id,
    plan_id: req.body.plan_id,
    amount: req.body.amount,
    task_url: req.body.task_url,
    description: req.body.description,
    expiry: req.body.expiry,
  });
  // Save task in the database
  Task.create(newRecord, (err, data) => {
    if (err)
      res.status(500).send({
        error: err,
        message:
          err.message || trans.lang('message.something_went_wrong')
      });
    else res.send(data);
  });
};

// Retrieve all task from the database (with condition).
exports.findAll = (req, res) => {
    const name = req.query.name;
    Task.getAll(name, (err, data) => {
      if (err)
        res.status(500).send({
          error: err,
          message:
            err.message || trans.lang('message.something_went_wrong')
        });
      else res.send(data);
    });
};

// Find a single Tutorial with a id
exports.findOne = (req, res) => {
    Task.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              error: err,
              message: trans.lang('message.not_found')
            });
          } else {
            res.status(500).send({
              error: err,
              message: trans.lang('message.something_went_wrong')
            });
          }
        } else res.send(data);
      });
};

// Update a task identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
  }

  let updatedtask = req.body;
  Task.updateById(
    req.body.id,
    new task(updatedtask),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            error: err,
            message: trans.lang('message.not_found')
          });
        } else {
          res.status(500).send({
            error: err,
            message: trans.lang('message.something_went_wrong')
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a task with the specified id in the request
exports.delete = (req, res) => {
    Task.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              error: err,
              message: trans.lang('message.not_found')
            });
          } else {
            res.status(500).send({
              error: err,
              message: trans.lang('message.something_went_wrong')
            });
          }
        } else res.send({ message: trans.lang('message.task_deleted') });
      });
};
