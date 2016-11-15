var http    = require('http'),
    express = require('express'),
    request = require('request'),
    router  = express.Router(),
//step  = require('step'), uncomment if using step.js instead of async
    async = require('async'),
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

        // Or use 'async.mapSeries' to pull titles in series
        async.map(addresses, fetchPageTitle, function(err, result){
            if (err) {
                console.log("Error with async: " + err);
            }
        });

        // using step.js
        //step(addresses, fetchPageTitle)

    } else {
        serveTitles(null);
    }
});


function fetchPageTitle(url, callbackFetchPageTitle) {

    // Prepend 'http://' if not present
    var dup_url = url;
    if (!dup_url.match(/^[a-zA-Z]+:\/\//)) {
        dup_url = 'http://' + dup_url;
    }

    request(dup_url, function(err, response, body) {
        parseResponseBody(url, err, body)
    });

    console.log('fetchPageTitle Finished: ' + url);
    callbackFetchPageTitle(null);

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