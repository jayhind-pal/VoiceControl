const TaskAttenders = require("../../models/task_attenders.model.js");


// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: trans.lang('message.required')
      });
    }
  
    // Create a task
    const newRecord = new TaskAttenders({
        task_id: req.body.task_id,
        user_id: req.body.user_id,
    });

    // Save task in the database
    TaskAttenders.create(newRecord, (err, data) => {
      if (err)
        res.status(500).send({
          error: err,
          message:
            err.message || trans.lang('message.something_went_wrong')
        });
      else res.send(data);
    });
};

exports.findAll = (req, res) => {
    const task_id = req.query.task_id;
    TaskAttenders.getAll(task_id, (err, data) => {
      if (err)
        res.status(500).send({
          error: err,
          message:
            err.message || trans.lang('message.something_went_wrong')
        });
      else res.send(data);
    });
};

exports.getAttendedTasks = (req, res) => {
  const user_id = req.query.user_id;
  TaskAttenders.getAttendedTasks(user_id, (err, data) => {
    if (err)
      res.status(500).send({
        error: err,
        message:
          err.message || trans.lang('message.something_went_wrong')
      });
    else res.send(data);
  });
};


