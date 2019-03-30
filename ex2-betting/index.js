
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app_port=9001;
const bind_ip="0.0.0.0";

const app = express();
app.use("/", express.static(__dirname + '/web'));//mount root of web to 'web'
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));// parse application/x-www-form-urlencoded
app.listen(app_port, bind_ip, function () {
    console.log('Betting app listening on ' + bind_ip + ':' + app_port);
});

