const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  let token = null;

  let userString = localStorage.getItem("user");
  if(userString){
    const userJSON = JSON.parse(userString);
    if(Boolean(userJSON.token)){
      token = userJSON.token;
    }
  }

  if (!token) {
    res.redirect('/login?error='+trans.lang('message.admin.login_to_continue'));
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    req.user.token = token;
  } catch (err) {
    res.redirect('/login?error='+trans.lang('message.admin.login_to_continue'));
  }

  return next();
};

module.exports = verifyToken;