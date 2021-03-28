/**
 * Created by Nexus on 16.08.2017.
 */

const BotUI = require("./BotUI");
let botUICount = 0;

class Publisher {
    constructor() {
        this.defaultStructure = [];
        this.botUIs = {};
        this.clients = [];

        setInterval(() => {
            for (let i in this.botUIs) {
                let botUI = this.botUIs[i];
                if (botUI != null)
                    botUI.fetchData();
            }
            let data = {};
            for (let i in this.botUIs) {
                let botUI = this.botUIs[i];
                if (botUI != null)
                    data[botUI.id] = botUI.getData();
            }
            for (let i in this.clients) {
                this.clients[i].sendUpdate(data);
            }
        }, 1000);

    }

    clientJoined(client) {
        this.clients.push(client);
        console.log("Client " + client.id + " joined.");
        let structure = {};
        for (let i in this.botUIs) {
            let botUI = this.botUIs[i];
            if (botUI != null)
                structure[botUI.id] = botUI.getStructure();
        }
        let data = {};
        for (let i in this.botUIs) {
            let botUI = this.botUIs[i];
            if (botUI != null)
                data[botUI.id] = botUI.getData();
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
        this.botUIs[botUI.id] = botUI;
        for (let i in this.clients) {
            if (this.clients[i]) {
                this.clients[i].createInterface(botUI)
            }
        }
        return botUI;
    }

    removeInterface(botUI) {
        for (let i in this.clients) {
            if (this.clients[i]) {
                this.clients[i].removeInterface(botUI)
            }
        }
        botUI.destroy();
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