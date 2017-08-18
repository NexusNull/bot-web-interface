/**
 * Created by Nexus on 16.08.2017.
 */

var DataExchanger = require("./DataExchanger");

var Publisher = function (socketServer) {
    var self = this;
    this.socketServer = socketServer;
    this.structure = [];
    this.dataList = [];
    this.dataSources = [];
    this.clients = [];

    setInterval(function () {
        for (var i in self.dataSources) {
            if (self.dataSources[i]) {
                self.dataList[i] = self.dataSources[i].getData();
            }
        }
        for (var i in self.clients) {
            if (self.clients[i]) {
                self.clients[i].sendUpdate(self.dataList);
            }
        }
    }, 1000);
};

Publisher.prototype.clientJoined = function (client) {
    this.clients.push(client);
    console.log("Client " + client.id + " joined.");
    client.sendSetup(this.structure, this.dataList);
};

Publisher.prototype.clientLeft = function (client) {
    delete this.clients[client.id];
    console.log("Client " + client.id + " left");
};

Publisher.prototype.createInterface = function () {

    var dataSource = new DataExchanger(this, this.dataSources.length);
    this.dataSources.push(dataSource);
    return dataSource;
};

Publisher.prototype.removeInterface = function (dataExchanger) {
    delete this.dataList[dataExchanger.id];
};

Publisher.prototype.setStructure = function (structure) {
    this.structure = structure;
};

Publisher.prototype.pushData = function (id, name, value) {
    for (var i = 0; i < this.clients.length; i++) {
        if (this.clients[i]) {
            this.clients[i].pushData(id, name, value);
        }
    }
};


module.exports = Publisher;