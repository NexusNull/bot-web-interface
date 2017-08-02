/**
 * Created by Nexus on 29.07.2017.
 */

var io = new require('socket.io')(81);
var Client = require("./Client");


var SocketServer = function() {
    var self = this;
    this.dataList = [];
    this.clients = [];
    this.structure = [];
    io.sockets.on('connection', function (socket) {
        console.log("Client "+self.clients.length+" connected");
        var client = new Client(socket,self,self.clients.length);
        self.clients.push(client);

    });

    setInterval(function(){
        for(var i in self.clients){
            self.clients[i].sendUpdate();
        }
    },1000);

};



SocketServer.prototype.registerDatSource = function (callback) {
    this.dataList.push(callback);
    //TODO notify all clients
};

SocketServer.prototype.removeDataSource = function (callback) {
    for(var i in this.dataList){
        if(this.dataList[i] == callback)
            delete this.dataList[i];
    }
    //TODO notify all clients
};

SocketServer.prototype.removeClient = function(client){
    console.log("Removed client "+client.id+".")
    for(var i in this.clients){
        if(this.clients[i] == client)
            delete this.clients[i];
    }
};

SocketServer.prototype.setStructure = function(structure){
    this.structure = structure;
};
module.exports = new SocketServer();