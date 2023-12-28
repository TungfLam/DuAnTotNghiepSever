var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors')
const crypto = require('crypto');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product')
var categoryRouter = require('./routes/category')
var sizeRouter = require('./routes/size')
var billRouter = require('./routes/bill')
var colorRouter = require('./routes/color')
var bannerRouter = require('./routes/banner')
var discountRouter = require('./routes/discount')

var apiRouter = require('./routes/api');
var product_size_color_router = require('./routes/product_size_color');
const notificationRouter = require('./routes/notification');
const orderRouter = require('./routes/order')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//không log ra tệp tĩnh bootstrap javascript v.v...
app.use(express.static('public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors())

const secret = crypto.randomBytes(64).toString('hex');

app.use(session({
  secret: secret,
  resave: true,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/api', apiRouter);
app.use('/product_size_color', product_size_color_router);
app.use('/category', categoryRouter);
app.use('/color', colorRouter);
app.use('/size', sizeRouter);
app.use('/bill', billRouter);
app.use('/notification', notificationRouter);
app.use('/banner', bannerRouter);
app.use('/discount', discountRouter);
app.use('/order', orderRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status | 1 | 500);
  if (req.originalUrl.indexOf('/api') == 0) {
    res.json({
      status: 0,
      msg: err.message
    });
  } else {
    res.render('error');
  }
});


module.exports = app;
