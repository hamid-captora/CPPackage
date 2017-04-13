/**
 * Created by hamidhoseini on 4/7/17.
 */
var express = require('express');
var router = express.Router();
var request = require('request');

/** GET Captora Page content */
router.get('/*', function(req, res, next) {

    // Value, 'q' must match AdWords ValueTrack parameter being passed
    var valuetrack_parameter = '';

    var captora_page_prefix = "https://static.captora.com/ppcpage";

    // Get the original URL
    var current_url = req.protocol + '://' + req.get('host') + req.originalUrl;

    // Customer can set "domain.com" directly instead using extractDomain function)
    // e.g. domain = 'client.com'

    // Return the host name like: www.client.com
    var host = extractDomain(current_url);
    var domain = host.replace('www.','');

    // Get ip address
    var request_ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    // Get referrer If the Referrer header is set on the request
    if (req.header('referrer')) {
        var referrer = req.header('referrer');
    }
    // Get browser information through if it's set on the header
    var deviceType = req.headers['user-agent'];

    // Final URL for http request
    var server_url = captora_page_prefix + "?client=" + domain + "&pageUrl=" + current_url + "&deviceType=" + deviceType + "&request_ip="+ request_ip +"&referrer=" + referrer;

    // If it's there, grab keyword passed through ValueTrack parameter
    if (valuetrack_parameter.length >0 ){
        server_url += '&keyword='+ valuetrack_parameter;
    }

    // Get the file contents and send to browser
    request(server_url, function (error, response, body) {
        if (error){
            res.status(response && response.statusCode).send({'message': 'failed...!', 'error': error});
        }
        res.type('text/html').status(response && response.statusCode).send(body).end();

    });

});

/** GET CDM Links */
router.post('/', function(req, res, next) {

    var captora_page_prefix = "https://widgets.captora.com/wserver/";

    // Get the url from body which is posted from client side
    var key = req.body.key;
    if (!key){
        key = "0bc252022fdedf29210d3ee555e620f6";
    }
    var current_url = req.body.current_url;

    // Customer can set "domain.com" directly instead using extractDomain function)
    // e.g. domain = 'client.com'

    //Return that domain name like: www.client.com
    var host = extractDomain(current_url);
    var domain = host.replace('www.','');

    var server_url = captora_page_prefix+ "?key=" + key + "&domain=" + domain + "&url=" + current_url;

    // Get the file contents and send to browser
    request(server_url, function (error, response, body) {
        if (error){
            res.send({'message': 'failed...!', 'error': error});
        }
        res.type('text/html').status(response && response.statusCode).send(body).end();

    });
});

/**
 * Desc : get URL and return the host name
 * @param url: get the original url
 * @returns String: return the host name like: www.client.com
 */
function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];
    return domain;
}

module.exports = router;
