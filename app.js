var express      = require('express'),
    path         = require('path'),
    bodyParser   = require('body-parser'),
    _            = require('underscore'),
    app          = express();

// Using Ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set underscore as locals so can be used in views
app.locals._ = _;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// send app to router
require('./routes/titles')(app);

// Error Handlers - Catch 404s and forward to Error Handlers
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handler with stacktrace (for development)
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: (app.get('env') === 'development') ? err : {}
    });
});

module.exports = app;