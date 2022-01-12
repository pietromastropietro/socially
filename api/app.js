// const createError = require('http-errors');
const express = require('express');
// const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
// const session = require("express-session");
const verifyToken = require('./token');
require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

// app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Open routes for registration/login
app.use('/api', authRouter);
// Restricted routes
// app.use('/api', verifyToken, indexRouter);

//temp for testing
app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// app.use(function (req, res, next) {
//   next(createError(404));
// });


// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// send the error
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message,
		},
	});
	// res.send(err);
});

module.exports = app;