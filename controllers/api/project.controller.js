const Project = require("./../../models/project.model.js");
const emailVerification = require("./../../models/email_verification.model.js");
const Mailer = require('./../../helpers/MailHelper');
const mailer = new Mailer();



exports.findAll = (req, res) => {
    const user_id = req.query.user_id;
    Project.getAll(user_id, (err, data) => {
      if (err)
        res.status(500).send({
          error: err,
          message:
            err.message || trans.lang('message.something_went_wrong')
        });
      else res.send(data);
    });
};

exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: trans.lang('message.required')
        });
    }

    // Create a Project
    const newRecord = new Project({
        user_id: req.body.user_id,
        title: req.body.title,
        description: req.body.description,
        skills: req.body.skills,
        from_date: req.body.from_date,
        to_date: req.body.to_date
    });

    // Save Project in the database
    Project.create(newRecord, async (err, data) => {
        if (err){
          res.status(500).send({
            error: err,
            message:
              err.message || trans.lang('message.something_went_wrong')
          });
        }else{
            res.send(data);
        } 
    });
};

exports.update = async (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
  }
  
  let updatedProject = req.body;
  Project.updateById(
    req.body.id,
    new Project(updatedProject),
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

exports.delete = async (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: trans.lang('message.required')
    });
  }
  
  Project.delete(req.body.id, (err, data) => {
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
