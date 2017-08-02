
/**
 * Created by Nexus on 01.08.2017.
 */

var validTokens = ["all"];

var Client = function(socket,socketServer,id){
    var self = this;
    this.socket = socket;
    this.socketServer = socketServer;
    this.token = null;
    this.id = id;
    this.dataIDs = [];
    /**
     * @param data {object}
     * @param data.token {string}
     */
    socket.on("auth", function (data) {
        console.log(data);
        self.token = (data.token) ? data.token : null;


        if (self.token === "all") {

            for(var i = 0; i < self.socketServer.dataList.length; i++)
                if(self.socketServer.dataList !== undefined)
                    self.dataIDs.push(i);
        }
        /**
         * @typedef {object} data
         * @typedef {number} data.botAmount
         * @typedef {Array<int>} data.botIDs
         * @typedef {Array<object>} data.structure;
         */
        var res = {
            dataAmount: self.dataIDs.length,
            dataIDs: self.dataIDs,
            structure: [
                {name: "name", type: "text", label: "name"},
                {name: "xp", type: "progressBar", label: "Experience"},
                {name: "status", type: "text", label: "Status"},
            ]

        };

        socket.emit("setup", res);

    });

    socket.on("disconnect",function(data){
        self.socketServer.removeClient(self);
    })
};

Client.prototype.sendUpdate = function(){
    var sendData = {};
    for(var i in this.dataIDs){
        var id = this.dataIDs[i];
        sendData[id] = this.socketServer.dataList[id]();
    }
    this.socket.emit("updateBotUI",sendData);
};

module.exports = Client;