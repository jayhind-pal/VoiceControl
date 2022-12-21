const Country = require("./../../models/country.model.js");


exports.findAll = (req, res) => {
    const name = req.query.name;
    Country.getAll(name, (err, data) => {
      if (err)
        res.status(500).send({
          error: err,
          message:
            err.message || trans.lang('message.something_went_wrong')
        });
      else res.send(data);
    });
};

