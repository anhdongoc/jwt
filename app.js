var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jwt = require('jsonwebtoken')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/login', function(req, res, next) {
const user = {id:1,name:"anh",email:"anh@gmail.com"}
   jwt.sign({user},'secretkey',(err,token)=>{
    res.json({
      token
    })
 })
})
 app.post('/posts', verifyToken,function(req, res, next) {
    jwt.verify(req.token,'secretkey',(err,dataAuth)=>{
        if(err){
          res.sendStatus(403)
        }else{
          res.json({
            dataAuth
          })
        }
    })
 });
 
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

function verifyToken(req,res,next){
  const bearerHeader = req.headers['authorization']
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1];
    req.token=bearerToken
    next()
  }else{
    res.sendStatus(430)
  }
}
module.exports = app;
