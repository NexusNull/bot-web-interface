/**
 * Created by Nexus on 01.08.2017.
 */
let i = 0;

class Client {
    constructor(socket) {
        this.socket = socket;
        this.id = i++;
        this.setupSend = false;
    }

    sendSetup(structure, dataList) {
        const res = {
            dataCache: dataList,
            structure: structure,
        };
        this.socket.emit("setup", res);
        this.setupSend = true;
    }

    sendUpdate(dataList) {
        if (!this.setupSend)
            return;
        this.socket.emit("updateBotUI", dataList);
    };

    pushData(id, name, value) {
        if (!this.setupSend)
            return;
        var data = {id: id, name: name, value: value};
        this.socket.emit("updateProperty", data);
    };

    removeInterface(ids) {
        this.socket.emit("removeBotUI", ids);
    };

    createInterface(botUI) {
        var structure = botUI.getStructure();
        structure.id = botUI.id;
        this.socket.emit("createBotUI", structure);
    };
}


module.exports = Client;