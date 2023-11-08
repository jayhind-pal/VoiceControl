const express = require("express");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const env = require("node-env-file");
env("./.env");
const PORT = process.env.PORT;

//global
global.appname = "Voice Control";
global.base_url = `http://localhost:${PORT}/`;
global.web_url = '';//used to redirect on front-end like email verification
global.files_url = base_url;
global.__lang_path = __dirname + "/" + 'language/';
global.trans = require('./helpers/LanguageHelper');

app.use(function (req, res, next) {
    global.currentLang = (req.headers.lang === undefined || req.headers.lang === '') ? 'en' : req.headers.lang;
    next();
});
  
var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//files url
app.use(express.static('public')); 
app.use('/public', express.static('public'));


// Use the 'cookie-parser' middleware to parse cookies.
app.use(cookieParser());

// Configure 'express-session'.
app.use(session({
  secret: 'voice-control-app', // Replace with a strong, random secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true for HTTPS
}));


//routes
require('./routes/api.js')(app);
require('./routes/admin.js')(app);

// Custom 404 error handler middleware (add this at the end)
app.use((req, res, next) => {
  res.status(404).send("<center><h1>404 - Page Not Found</h1></center>");
});

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});