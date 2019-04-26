require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const clientRouter = require('./routes/client');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth')

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//session setup
app.use(session({
  secret: 'yasuoganktem',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2*3600000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 2*60*60,
    stringify: false
  })
}))

app.use(async (req,res,next)=>{
  if(req.session.isLogin){
    res.locals.isLogin = req.session.isLogin;
  } else {
    res.locals.isLogin = false;
  }
  next();
})

app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/admin/public', express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.use('/admin/service', express.static(path.join(__dirname, 'public')));
app.use('/admin/service/public', express.static(path.join(__dirname, 'public')));
app.use('/admin/blog/public', express.static(path.join(__dirname, 'public')));
app.use('/admin/blog', express.static(path.join(__dirname, 'public')));
app.use('/admin/promotion/public', express.static(path.join(__dirname, 'public')));
app.use('/admin/promotion/', express.static(path.join(__dirname, 'public')));
app.use('/admin/product/public', express.static(path.join(__dirname, 'public')));
app.use('/admin/product/', express.static(path.join(__dirname, 'public')));

app.use('/auth', express.static(path.join(__dirname, 'public')));

app.use('/blog', express.static(path.join(__dirname, 'public')));
app.use('/blog/public', express.static(path.join(__dirname, 'public')));
app.use('/services', express.static(path.join(__dirname, 'public')));
app.use('/services/public', express.static(path.join(__dirname, 'public')));


app.use('/', clientRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true}, err=>{
  if(err){
    throw err
  }
});

module.exports = app;
