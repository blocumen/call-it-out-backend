const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
var session = require('express-session');
const cron = require('node-cron');
const cors = require('cors')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const path = require("path");
const { giveReputationToUser } = require('./scripts/cron_jobs');

 
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("DB connected"));

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});
app.use(express.static(path.join(__dirname, "src")));

// app.use(express.static(__dirname + '/assets')); // set the static files location /public/img will be /img for users
// app.use('assets/public', express.static(__dirname + 'assets/public'));

app.use(cors());
//middleware
app.use(morgan("dev"));
//app.use(myOwnMiddleWare);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:'XASDASDA'}));
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(expressValidator());
var rroute = require('path').join(__dirname, 'src/routes')

require('fs').readdirSync(rroute).forEach(function(file) {
    var routeFile = require(rroute + '/' + file);
    
    app.use('/api/v1/', routeFile)
})

var task = cron.schedule('*/2 * * * *',() => {
  console.log("getting into cron jobs");
  giveReputationToUser();

})
task.start();

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: "not authorized" });
    }
});

//const port = 4000;
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server connected at  ${port}`);
});