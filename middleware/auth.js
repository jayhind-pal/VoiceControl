const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  let token = null;

  if(req.headers["authorization"]){
    const tokenArray = req.headers["authorization"].split(" ");
    if(Boolean(tokenArray[1])){
      token = tokenArray[1];
    }
  }

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