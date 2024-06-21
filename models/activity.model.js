const sql = require("./db.js");
const jwt = require('jsonwebtoken');
const moment = require("moment");
const Activity = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};
Activity.getActivity = (result) => {

    let query = "SELECT * FROM activities";
    sql.query(query, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        res.forEach((item)=> item.createdAt = moment(item.createdAt).format('MMM DD YYYY HH:mm:ss'))
        result(null, res);
    });
}
Activity.create = (newActivity, result) => {
    sql.query("INSERT INTO activities SET ?", newActivity, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, { id: res.insertId });
    });
};
module.exports = Activity;