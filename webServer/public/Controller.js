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
    var socket = io("http://localhost:81", {
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

        /**
         * @typedef {object} data
         * @typedef {Array<int>} data.botIDs
         * @typedef {Array<object>} data.structure;
         */
        self.dataIDs = data.dataIDs;
        self.dataList = data.dataList;
        self.structure = data.structure;

        for (var i in self.dataIDs) {
            var botUI = new BotUi(self.dataIDs[i], self.structure);
            botUI.create();
            self.botUIs[self.dataIDs[i]] = botUI;
        }
        for (var i in self.dataList) {
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
            if(self.botUIs[i])
                self.botUIs[i].update(data[i]);
        }
    });

    socket.on("updateProperty",function(data){
        if(self.botUIs[data.id])
            self.botUIs[data.id].updateProperty(data.name,data.value);
    });

    socket.on("removeBotUI", function (data) {
    });

    socket.on("createBotUi", function (data) {

    });

    socket.open();
    this.socket = socket;
};
