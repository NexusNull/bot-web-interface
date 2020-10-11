/**
 * Created by Nexus on 29.07.2017.
 */
const Server = new require('socket.io');
const Client = require("./Client");
const Publisher = require("./Publisher");
const sha512 = require('js-sha512').sha512;
var socketOpen = false;

var SocketServer = function () {
    this.clients = [];
    this.defaultStructure = [];
    this.publisher = new Publisher();
    this.password = null;
    this.io = null;
};

SocketServer.prototype.setPassword = function (password) {
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

SocketServer.prototype.openServer = function (httpServer) {
    if (socketOpen)
        throw Error("Socket already open");
    socketOpen = true;

    var self = this;
    this.io = Server(httpServer);
    this.io.sockets.on('connection', function (socket) {
        var client = new Client(socket, self, self.clients.length);
        if(self.password != null){
            var puzzle = Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1000000) + new Date();
            var difficulty = 8;

            socket.emit("authRequired", {puzzle: puzzle, difficulty: difficulty});
        } else {
            socket.emit("noAuthRequired");
        }
        socket.on("auth", function (auth) {
            if (self.password == null) {
                self.publisher.clientJoined(client);
                self.clients.push(client);
                return;
            }
            if (auth.solution && (auth.solution+"").length < 20) {
                var hash = sha512.digest(puzzle + auth.solution);
                var match = true;
                for (let i = 0; i < difficulty;i+=8){
                    var byte;
                    if(difficulty-i > 8){
                        byte = hash[Math.floor(i/8)];
                    } else {
                        byte = hash[Math.floor(i/8)] >> 8-(difficulty-i);
                    }
                    if(byte !== 0){
                        match = false;
                        break;
                    }
                }
                if(!match)
                    socket.disconnect();
            } else {
                socket.disconnect();
            }
            if (auth.password === self.password) {
                self.publisher.clientJoined(client);
                self.clients.push(client);
            } else {
                puzzle = Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1000000) + new Date();
                socket.emit("authRequired", {puzzle: puzzle, difficulty: difficulty});
            }
        });
        socket.on("disconnect", function () {
            self.removeClient(client);
        })
    });
};


module.exports = new SocketServer();