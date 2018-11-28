/**
 * Created by Nexus on 16.08.2017.
 */

var BotUI = require("./BotUI");
var botUICount = 0;
var Publisher = function (socketServer) {
    var self = this;
    this.socketServer = socketServer;
    this.defaultStructure = [];
    this.botUIs = {};
    this.clients = [];

    setInterval(function () {
        for (let i in self.botUIs) {
            let botUI = self.botUIs[i];
            if(botUI != null)
                botUI.fetchData();
        }
        let data = {};
        for (let i in self.botUIs) {
            let botUI = self.botUIs[i];
            if(botUI != null)
                data[botUI.id] = botUI.getData();
        }
        for (let i in self.clients) {
            self.clients[i].sendUpdate(data);
        }
    }, 1000);
};

Publisher.prototype.clientJoined = function (client) {
    this.clients.push(client);
    console.log("Client " + client.id + " joined.");
    let structure = {};
    for (let i in this.botUIs) {
        let botUI = this.botUIs[i];
        if(botUI != null)
            structure[botUI.id] = botUI.getStructure();
    }
    let data = {};
    for (let i in this.botUIs) {
        let botUI = this.botUIs[i];
        if(botUI != null)
            data[botUI.id] = botUI.getData();
    }
    client.sendSetup(structure, data);
};

Publisher.prototype.clientLeft = function (client) {
    delete this.clients[client.id];
    console.log("Client " + client.id + " left");
};
/**
 *
 * @param structure
 * @param parent
 * @param attachTarget
 * @returns {BotUI}
 */
Publisher.prototype.createInterface = function (structure, parent, attachTarget) {
    if (!structure)
        structure = this.defaultStructure;
    let botUI = new BotUI(this, botUICount++, structure, parent, attachTarget);
    this.botUIs[botUI.id] = botUI;
    for (let i in this.clients) {
        if (this.clients[i]) {
            this.clients[i].createInterface(botUI)
        }
    }
    return botUI;
};
/**
 * Remove Interface from Publisher and client
 * @param botUI
 */
Publisher.prototype.removeInterface = function (botUI) {
    for (let i in this.clients) {
        if (this.clients[i]) {
            this.clients[i].removeInterface(botUI)
        }
    }
    let ids = botUI.destroy();
    for (let id of ids) {
        this.botUIs[id] = null;
    }
};

/**
 * Sets the default structure to be used for top level botUIs
 * @param {object} structure
 * @deprecated use setDefaultStructure instead
 */
Publisher.prototype.setStructure = function (structure) {
    this.defaultStructure = structure;
};

/**
 * Sets the default structure to be used for top level botUIs
 * @param {object} structure
 */
Publisher.prototype.setDefaultStructure = function (structure) {
    this.defaultStructure = structure;
};
/**
 * pushes data to client
 * @param {number} id Id of botUI
 * @param {string} name Name of the attribute
 * @param {string|number} value Value to be set
 */
Publisher.prototype.pushData = function (id, name, value) {
    for (var i = 0; i < this.clients.length; i++) {
        if (this.clients[i]) {
            this.clients[i].pushData(id, name, value);
        }
    }
};


module.exports = Publisher;