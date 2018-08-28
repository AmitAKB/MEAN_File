var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fs = require('fs');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.get('/', function(req, res, next){
	fs.readFile(__dirname + "/users.txt", 'utf8', function(err, data) {
		if (err) throw err;
		if(data){
			data = JSON.parse(data);
			res.json({code:200,data:data});
		} else{
			res.json({code:201})
		}
	});
});
app.get('/users',function(req, res, next){
	var email = false;
	fs.readFile(__dirname + "/users.txt", 'utf8', function(err, data) {
		if (err) throw err;
		if(data) {
		  data = JSON.parse(data);
			data.forEach((d)=>{
			  if(d.email==req.query.email.toLowerCase()){
				email = true;
			  }
			})
		  data.push(req.query);
		} else {
		  data = [req.query];
		}
		if(!email){
			fs.writeFile(__dirname + "/users.txt", JSON.stringify(data), function(err) {
				if(err) {
					return console.log(err);
				}else{
					res.json({code:200});
				}
			});
		} else{
			res.json({code:201});
		}
	});
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

module.exports = app;
