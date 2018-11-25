/**
 * Created by Nexus on 29.07.2017.
 */
var express = require('express');
var app = express();
var defaultPort = 80;
var socketOpen = false;
var path = require("path");
var WebServer = function () {
};

WebServer.prototype.openSocket = function (port) {
    if (socketOpen)
        throw Error("WebServer already running.");
    socketOpen = true;

    port = (port) ? port : defaultPort;

    app.use('/', express.static(__dirname + '/public'));
    app.use("/sha512.js", function (req, res, next) {
        res.sendFile(path.resolve(require.resolve("js-sha512")+"/../../build/sha512.min.js"));
    });
    app.use("/prompt-boxes.js", function (req, res, next) {
        res.sendFile(path.resolve(require.resolve("prompt-boxes")+"/../../../dist/prompt-boxes.min.js"));
    });
    app.use("/prompt-boxes.css", function (req, res, next) {
        res.sendFile(path.resolve(require.resolve("prompt-boxes")+"/../../../dist/prompt-boxes.min.css"));
    });
    app.use(function (req, res, next) {
        res.status(404).send(" 404: Page not found");
    });

    app.listen(port, function () {
        console.log('WebServer listening on port ' + port + '.');
    });
};

module.exports = new WebServer();