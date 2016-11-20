var convict = require('convict');

var conf = convict({
    env: {
        doc: "applicaton environment.",
        format: ["production", "development"],
        default: "development",
        env: "NODE_ENV"
    },
    ip: {
        doc: "IP to bind to",
        format: "ipaddress",
        default: "127.0.0.1",
        env: "IP_ADDRESS"
    },
    port: {
        doc: "port to bind.",
        format: "port",
        default: 8080,
        env: "PORT"
    }
});

// Loading environment specific configuration
var env = conf.get('env');
conf.loadFile('./config/' + env + '.json');
conf.validate({strict: true});

module.exports = conf;
