/**
 * Created by Nexus on 30.07.2017.
 */
var Controller = function () {
    this.botAmount = 0;
    this.dataIDs = null;
    this.structure = null;

    this.botUIs = {};
    this.socket = null;
};

Controller.prototype.start = function () {
    var self = this;
    var host = document.location.hostname;
    var port = (document.location.port) ? document.location.port : 80;

    var socket = io("http://" + host + ":" + (parseInt(port) + 1), {
        autoConnect: false
    });

    socket.on("connect", function () {
        socket.emit("auth", {token: "all"});
    });

    socket.on("setup", function (data) {
        /**
         * @typedef {object} data
         * @typedef {Array<int>} data.dataIDs
         * @typedef {Array<object>} data.structure;
         */
        console.log(data)
        self.dataList = data.dataList;
        self.structure = data.structure;

        for (var i in self.dataList) {
            var botUI = new BotUi(i, self.structure);
            botUI.create();
            self.botUIs[i] = botUI;
        }
        for (var i in self.dataList) {
            if(self.botUIs[i])
                self.botUIs[i].update(self.dataList[i]);
        }
    });

    socket.on("updateStructure", function (data) {
        //TODO: implement
        return;

        self.structure = data.structure;

        for (var j in self.botUIs) {

        }

        for (var i in self.dataIDs) {
            var botUI = new BotUi(self.dataIDs[i], self.structure);
            botUI.create();
            self.botUIs[self.dataIDs[i]] = botUI;
        }
    });

    socket.on("updateBotUI", function (data) {
        for (var i in data) {
            if (self.botUIs[i])
                self.botUIs[i].update(data[i]);
        }
    });

    socket.on("updateProperty", function (data) {
        if (self.botUIs[data.id])
            self.botUIs[data.id].updateProperty(data.name, data.value);
    });

    socket.on("removeBotUI", function (data) {
        if(self.botUIs[data.id])
            self.botUIs[data.id].destroy();
    });

    socket.on("createBotUI", function (data) {
        var botUI = new BotUi(data.id, self.structure);
        botUI.create();
        self.botUIs[data.id] = botUI;
    });

    socket.open();
    this.socket = socket;
};
