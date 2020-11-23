const createError = require('http-errors');
const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const passport = require('passport')
const localStrategy = require('passport-local')
const passportLocalMongoose = require('passport-local-mongoose')
const seedDB = require('./routes/seeds')

mongoose.connect('mongodb://localhost:27017/yelpcamp',{useNewUrlParser: true,useUnifiedTopology:true})

const User = require('./models/user')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash())
app.use(require('express-session')({
  secret: "what is this???",
  resave: false,
  saveUninitialized: false
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())
app.use(passport.session())


passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.message = req.flash('error')
  res.locals.message_in = req.flash('success')
  next()
})

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campgroundRouter = require('./routes/campgrounds');
const commentRouter = require('./routes/comments');

app.use(indexRouter);
app.use(usersRouter);
app.use(campgroundRouter);
app.use(commentRouter);

// seedDB()

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080,() => console.log("server is on!!!"))
module.exports = app;
