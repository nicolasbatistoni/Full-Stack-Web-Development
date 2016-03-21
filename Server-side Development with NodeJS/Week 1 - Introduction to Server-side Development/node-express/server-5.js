var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var dishRouter = require('./node_modules/dishRouter');
var promoRouter = require('./node_modules/promoRouter');
var leaderRouter = require('./node_modules/leaderRouter');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

// dishRouter
app.use('/dishes',dishRouter);

// promoRouter
app.use('/promotions', promoRouter);

// leaderRouter
app.use('/leadership', leaderRouter);

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
