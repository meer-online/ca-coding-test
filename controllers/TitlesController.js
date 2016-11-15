var http    = require('http'),
    express = require('express'),
    request = require('request'),
    router  = express.Router(),
    _       = require('underscore'),
    titleRegex = new RegExp("<title>(.*?)</title>", "i");


router.get('/', function(req, res) {
    counter   = 0;
    addresses = [];
    sites     = {};
    tres      = res;

    if (req.query.address) {
        // Populate 'addresses' depending on the number of address queries
        addresses = (req.query.address instanceof Array) ? req.query.address : [req.query.address];

        // Remove empty strings from addresses
        addresses = addresses.filter(String);

        // Fetch titles of these addresses
        _.each(addresses, function(address) {
            fetchPageTitle(address);
        });

    } else {
        serveTitles(null);
    }
});

function fetchPageTitle(url) {

    // Prepend 'http://' if not present
    var dup_url = url;
    if (!dup_url.match(/^[a-zA-Z]+:\/\//)) {
        dup_url = 'http://' + dup_url;
    }

    request(dup_url, function(err, response, body) {
        parseResponseBody(url, err, body)
    });

}

function parseResponseBody(url, err, body) {
    if (err) {
        console.log(err);
        callback(url, 'NO RESPONSE');
        return;
    }
    // Find the title tag using regex
    var match = titleRegex.exec(body);
    if (match && match[1]) {
        callback(url, '"' + match[1] + '"');
    } else {
        callback(url, 'Title Tag missing');
    }
}

// Callback function to update the 'sites' object
function callback(url, siteTitle) {
    sites[url] = siteTitle;
    counter++;

    if (counter == addresses.length) {
        serveTitles(sites);
    }
}

// Function to serve the titles to page
function serveTitles(sitesObject) {
    tres.render('titles', {
        sites: sitesObject
    });
}
module.exports = router;