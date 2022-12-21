const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(404).send({
        message: trans.lang('message.token_required')
      });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    req.user.token = token;
  } catch (err) {
    return res.status(404).send({
        message: trans.lang('message.auth_fail')
      });
  }
  return next();
};

module.exports = verifyToken;