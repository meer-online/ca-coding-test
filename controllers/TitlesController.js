var http    = require('http'),
    cheerio = require('cheerio'),
    express = require('express'),
    request = require('request'),
    router  = express(),
    _       = require('underscore');


router.get('/', function(req, res) {
    function fetchPageTitle(url, index) {
        // Prepend 'http://' if not present
        if (!url.match(/^[a-zA-Z]+:\/\//)) {
            url = 'http://' + url;
        }

        http.get(url, function(response){
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                var dom = cheerio.load(body);
                callback(url, '"' + (dom('title').text()) ? dom('title').text() : 'Title Tag missing' + '"', index);
            });
        }).on('error', function(e){
            console.log("Error occurred - http.get ", e);
            callback(url, 'NO RESPONSE', index);
            return;
        });

    }

    // Callback function to update the 'sites' object
    function callback(url, siteTitle, index) {
        sites[index] = url + ' - '+ siteTitle;
        counter++;

        if (counter == addresses.length) {
            serveTitles(sites);
        }
    }

    // Function to serve the titles to page
    function serveTitles(sitesObject) {
        tres.render('titles', {
            sites: sitesObject,
            _: _
        });
    }

    var counter   = 0,
        addresses = [],
        sites     = {},
        tres      = res;

    if (req.query.address) {
        // Populate 'addresses' depending on the number of address queries
        addresses = (req.query.address instanceof Array) ? req.query.address : [req.query.address];

        // Remove empty strings from addresses
        addresses = addresses.filter(String);

        // Fetch titles of these addresses
        _.each(addresses, function(address, index) {
            fetchPageTitle(address, index);
        });

    } else {
        res.statusCode = 404;
        serveTitles(null);
        res.end();
    }
});


module.exports = router;