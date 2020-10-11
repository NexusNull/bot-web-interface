/**
 * Created by Nexus on 29.07.2017.
 */
var WebServer = require("./webServer/WebServer");
var SocketServer = require("./webServer/SocketServer");

var BotWebInterface = {
    WebServer: WebServer,
    SocketServer: SocketServer,
    socketPort:81,
    webServerPort:80,
    startOnPort: function (port) {
        let httpServer = WebServer.openSocket(port);
        SocketServer.openServer(httpServer)
    },
    setWebServerPort: function(port){
        this.webServerPort = port;
    },
    setSocketPort: function(port){
        this.socketPort = port;
    },
    setPassword: function(password){
        SocketServer.setPassword(password);
    },
    start: function(){
        WebServer.openSocket(this.webServerPort);
        SocketServer.openSocket(this.socketPort);
    }
};

module.exports = BotWebInterface;