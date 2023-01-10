const Category = require("../../models/category.model.js");
const jwt = require('jsonwebtoken');

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
  }

  // Create a Category
  const newRecord = new Category({
    category_name: req.body.category_name,
    category_image: req.file.path,
    status: 1
  });
  // Save Category in the database
  Category.create(newRecord, (err, data) => {
    if (err)
      res.status(500).send({
        error: err,
        message:
          err.message || trans.lang('message.something_went_wrong')
      });
    else res.send(data);
  });
};

// Retrieve all category from the database (with condition).
exports.findAll = (req, res) => {
    const seo_code = req.query.seo_code;
    Category.getAll(seo_code, (err, data) => {
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
    Category.findById(req.params.id, (err, data) => {
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

// Update a Category identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
  }

  let updatedCategory = req.body;
  if(req.file.hasOwnProperty('path')){
    updatedCategory.category_image = req.file.path;
  }
  Category.updateById(
    req.body.id,
    new Category(updatedCategory),
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

// Delete a Category with the specified id in the request
exports.delete = (req, res) => {
    Category.remove(req.params.id, (err, data) => {
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
        } else res.send({ message: trans.lang('message.category_deleted') });
      });
};
