/**
 * Created by Nexus on 29.07.2017.
 */
var Server = new require('socket.io');
var Client = require("./Client");
var Publisher = require("./Publisher");

var defaultPort = 81;

var SocketServer = function (port) {
    var self = this;
    this.clients = [];
    this.structure = [];
    this.publisher = new Publisher();

    this.io = new Server((port) ? port : defaultPort);
    this.io.sockets.on('connection', function (socket) {
        var client = new Client(socket, self, self.clients.length);

        self.publisher.clientJoined(client);
        self.clients.push(client);
    });
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


module.exports = new SocketServer();