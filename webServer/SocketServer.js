/**
 * Created by Nexus on 29.07.2017.
 */
const Server = new require('socket.io');
const Client = require("./Client");
const Publisher = require("./Publisher");
const IPv6 = require("ip-address").Address6;
const IPv4 = require("ip-address").Address4;
var defaultPort = 81;
var socketOpen = false;
var ipTries = {};

var SocketServer = function () {
    this.clients = [];
    this.structure = [];
    this.publisher = new Publisher();
    this.password = null;
    this.io = null;
};
SocketServer.prototype.setPassword = function(password){
    this.password = password;
};
SocketServer.prototype.getPublisher = function () {
    return this.publisher;
};

SocketServer.prototype.removeClient = function (client) {
    for (var i in this.clients) {
        if (this.clients[i] === client) {
            this.publisher.clientLeft(client);
            delete this.clients[i];
        }
    }
};

SocketServer.prototype.openSocket = function (port) {
    if (socketOpen)
        throw Error("Socket already open");
    socketOpen = true;

    var self = this;
    this.io = new Server((port) ? port : defaultPort);
    this.io.sockets.on('connection', function (socket) {
        var client = new Client(socket, self, self.clients.length);
        var ipAddress = socket.handshake.address;

        var ip = new IPv6(ipAddress);
        var ipRep = "v6";
        if(!ip.valid && ip.v4){
            ip = new IPv4(ipAddress);
            ipRep = "v4";
        }

        ipRep += ip.parsedAddress[0]+"."+ip.parsedAddress[1]+"."+ip.parsedAddress[2]+"."+ip.parsedAddress[3];
        socket.on("auth", function (auth) {
            if(ipTries[ipRep] && ipTries[ipRep] > 10)
                socket.disconnect();
            if(self.password == null){
                self.publisher.clientJoined(client);
                self.clients.push(client);
            } else if(auth.password == self.password){
                self.publisher.clientJoined(client);
                self.clients.push(client);
                if(ipTries[ipRep])
                    ipTries[ipRep] = 1;
            } else {
                socket.send("authRequired");
                if(!ipTries[ipRep])
                    ipTries[ipRep] = 1;
                else
                    ipTries[ipRep]++;
                console.log("Ip: "+ipRep+" tried to login but failed authentication tries"+ipTries[ipRep]);
            }
        });
    });

};


module.exports = new SocketServer();