const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  let token = null;

  if(req.session.user){
    token = req.session.user.token;

    const permissions = req.session.user.permissions.split(",");
    // console.log("permissions", permissions);
  }

  if (!token) {
    res.redirect('/login?error='+trans.lang('message.admin.login_to_continue'));
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    req.user.token = token;
  } catch (err) {
    res.redirect('/login?error='+trans.lang('message.admin.token_expired'));
  }

  return next();
};

module.exports = verifyToken;