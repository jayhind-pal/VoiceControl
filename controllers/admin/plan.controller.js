const Plan = require("../../models/plan.model.js");
const jwt = require('jsonwebtoken');

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
  }

  // Create a plan
  const newRecord = new Plan({
    category_id: req.body.category_id,
    plan_name: req.body.plan_name,
    description: req.body.description,
    price: req.body.price,
    validity: req.body.validity,
    status: 1
  });
  // Save plan in the database
  Plan.create(newRecord, (err, data) => {
    if (err)
      res.status(500).send({
        error: err,
        message:
          err.message || trans.lang('message.something_went_wrong')
      });
    else res.send(data);
  });
};

// Retrieve all plan from the database (with condition).
exports.findAll = (req, res) => {
    const category_id = req.query.category_id;
    Plan.getAll(category_id, (err, data) => {
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
    Plan.findById(req.params.id, (err, data) => {
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

// Update a plan identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
  }

  let updatedplan = req.body;
  Plan.updateById(
    req.body.id,
    new plan(updatedplan),
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

// Delete a plan with the specified id in the request
exports.delete = (req, res) => {
    Plan.remove(req.params.id, (err, data) => {
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
        } else res.send({ message: trans.lang('message.plan_deleted') });
      });
};
