/**
 * Created by Nexus on 29.07.2017.
 */
var express = require('express');
var app = express();
var port = 80;

app.use('/', express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.status(404).send(" 404: Page not found");
});

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '.');
});