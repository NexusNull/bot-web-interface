/**
 * Created by Nexus on 29.07.2017.
 */
var WebServer = require("./webServer/WebServer");
var SocketServer = require("./webServer/SocketServer");

var BotWebInterface = {
    WebServer:WebServer,
    SocketServer: SocketServer,
    startOnPort: function (port) {
        WebServer.openSocket(port);
        SocketServer.openSocket(port + 1)
    }
};

module.exports = BotWebInterface;