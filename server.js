var app = require('./app');
var conf = require('./config.js');

var server = app.listen(conf.get('port'), conf.get('ip'), function() {
    console.log('app listening on port '+server.address().port);
});