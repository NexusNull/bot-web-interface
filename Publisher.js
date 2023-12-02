/**
 * Created by Nexus on 16.08.2017.
 */

const BotUI = require("./BotUI");
let botUICount = 0;

class Publisher {
    constructor(updateRate) {
        this.defaultStructure = [];
        this.botUIs = new Map();
        this.clients = [];

        setInterval(() => {
            let data = [];
            for (let botUI of this.botUIs) {
                botUI[1].fetchData();
                data[botUI[0]] = botUI[1].getData();
            }
            for (let i in this.clients) {
                this.clients[i].sendUpdate(data);
            }
        }, updateRate);

    }

    clientJoined(client) {
        this.clients.push(client);
        console.log("Client " + client.id + " joined.");
        let structure = {};
        let data = {};
        for (let botUI of this.botUIs) {
            structure[botUI[0]] = botUI[1].getStructure();
            data[botUI[0]] = botUI[1].getData();
        }
        client.sendSetup(structure, data);
    }

    clientLeft(client) {
        delete this.clients[client.id];
        console.log("Client " + client.id + " left");
    }

    createInterface(structure, parent, attachTarget) {
        if (!structure)
            structure = this.defaultStructure;
        let botUI = new BotUI(this, botUICount++, structure, parent, attachTarget);
        this.botUIs.set(botUI.id, botUI);
        for (let i in this.clients) {
            if (this.clients[i]) {
                this.clients[i].createInterface(botUI)
            }
        }
        return botUI;
    }

    removeInterfaces(ids) {
        for (let i in this.clients) {
            if (this.clients[i]) {
                this.clients[i].removeInterface(ids)
            }
        }
        for (let id of ids) {
            this.botUIs.delete(id)
        }
    }

    setStructure(structure) {
        this.defaultStructure = structure;
    }

    setDefaultStructure(structure) {
        this.defaultStructure = structure;
    }

    pushData(id, name, value) {
        for (var i = 0; i < this.clients.length; i++) {
            if (this.clients[i]) {
                this.clients[i].pushData(id, name, value);
            }
        }
    };
}


module.exports = Publisher;