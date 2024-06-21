const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  let token = null;

  if(req.session.user){
    token = req.session.user.token;

    if(!req.session.user.permissions.includes(req.path.replace("/",""))){
      res.redirect('/login?error='+trans.lang('message.admin.access_denied'));
      return;
    }
  }

  if (!token) {
    res.redirect('/login?error='+trans.lang('message.admin.login_to_continue'));
    return;
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;   
    req.user.token = token;
  } catch (err) {
    res.redirect('/login?error='+trans.lang('message.admin.token_expired'));
    return;
  }

  return next();
};

module.exports = verifyToken;