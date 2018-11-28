/**
 * Created by Nexus on 01.08.2017.
 */


var Client = function (socket, socketServer, id) {
    var self = this;
    this.socket = socket;
    this.socketServer = socketServer;
    this.id = id;
    this.setupSend = false;

    /**
     * @param data {object}
     * @param data.token {string}
     */

};

Client.prototype.sendSetup = function (structure, dataList) {

    /**
     * @typedef {object} data
     * @typedef {Array<int>} data.dataIDs
     * @typedef {Array<object>} data.structure;
     */
    var res = {
        dataCache: dataList,
        structure: structure,
    };

    this.socket.emit("setup", res);
    this.setupSend = true;
};

Client.prototype.sendUpdate = function (dataList) {
    if (!this.setupSend)
        return;
    this.socket.emit("updateBotUI", dataList);
};

Client.prototype.pushData = function (id, name, value) {
    if (!this.setupSend)
        return;
    var data = {id: id, name: name, value: value};
    this.socket.emit("updateProperty", data);
};

Client.prototype.removeInterface = function (botUI) {
    this.socket.emit("removeBotUI", {id: botUI.id});
};

Client.prototype.createInterface = function (botUI) {
    var structure = botUI.getStructure();
    structure.id = botUI.id;
    this.socket.emit("createBotUI", structure);
};

module.exports = Client;