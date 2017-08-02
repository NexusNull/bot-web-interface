/**
 * Created by Nexus on 30.07.2017.
 */
var Controller = function(){
    this.botAmount = 0;
    this.dataIDs = null;
    this.structure = null;

    this.botUIs = {};
    this.socket = null;
};

Controller.prototype.start = function(){
    var self = this;
    var socket = io("http://localhost:81",{
        autoConnect: false
    });

    socket.on("connect", function(){
        socket.emit("auth",{token:"all"});
    });

    socket.on("setup",function(data){
        /**
         * @typedef {object} data
         * @typedef {number} data.botAmount
         * @typedef {Array<int>} data.botIDs
         * @typedef {Array<object>} data.structure;
         */
        self.botAmount = data.dataAmount;
        self.dataIDs = data.dataIDs;
        self.structure = data.structure;

        for(var i in self.dataIDs){
            var botUI = new BotUi(self.dataIDs[i], self.structure);
            botUI.create();
            self.botUIs[self.dataIDs[i]] = botUI;
        }
    });


    //TODO implement
    socket.on("updateBotUI",function(data){
        for(var i in data){
            self.botUIs[i].update(data[i]);

        }


    });

    socket.on("removeBotUI",function(data){
    });

    socket.on("createBotUi",function(data){
    });

    socket.open();
    this.socket = socket;
};

Controller.prototype.createBotUIs = function (){
    var ids = this.dataIDs;
    var structure = this.structure;

    for(var i in ids){
        var botUi = new BotUi();
    }

};

