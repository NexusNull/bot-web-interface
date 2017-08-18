/**
 * Created by Nexus on 01.08.2017.
 */

var validTokens = ["all"];

var Client = function (socket, socketServer, id) {
    var self = this;
    this.socket = socket;
    this.socketServer = socketServer;
    this.token = null;
    this.id = id;
    this.setupSend = false;

    /**
     * @param data {object}
     * @param data.token {string}
     */
    socket.on("auth", function (data) {
        self.token = (data.token) ? data.token : null;

    });

    socket.on("disconnect", function (data) {
        self.socketServer.removeClient(self);
    })
};

Client.prototype.sendSetup = function (structure, dataList) {
    var dataIDs = [];
    for (var i = 0; i < dataList.length; i++)
        if (dataList[i])
            dataIDs.push(i);

    /**
     * @typedef {object} data
     * @typedef {Array<int>} data.dataIDs
     * @typedef {Array<object>} data.structure;
     */
    var res = {
        dataIDs: dataIDs,
        dataList: dataList,
        structure: structure,
    };

    this.socket.emit("setup", res);
    this.setupSend = true;
};

Client.prototype.sendUpdate = function (dataList) {
    if(!this.setupSend)
        return;
    this.socket.emit("updateBotUI", dataList);
};

Client.prototype.pushData = function (id, name, value) {
    if(!this.setupSend)
        return;
    var data = {id: id, name: name, value: value};
    this.socket.emit("updateProperty", data);
};

module.exports = Client;