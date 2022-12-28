const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const env = require("node-env-file");
env("./.env");
const PORT = process.env.PORT;

//global
global.appname = "Social Star";
global.base_url = `https://5exceptions.com:${PORT}/`;
global.web_url = '';//used to redirect on front-end like email verification
global.files_url = base_url + "files/";
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

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to "+global.appname });
});

//routes
require('./routes/admin.js')(app);
require('./routes/api.js')(app);

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});