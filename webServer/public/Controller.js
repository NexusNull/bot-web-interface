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
var socket;
Controller.prototype.start = function () {
    var self = this;
    var host = document.location.hostname;
    var port = (document.location.port) ? document.location.port : 80;
    socket = io("http://" + host + ":" + (parseInt(port) + 1), {
        autoConnect: false
    });
    function findHash(puzzle, difficulty, id, success) {
        const hash = sha512.digest(puzzle+id);
        var match = true;
        for (let i = 0; i < difficulty;i+=8){
            var byte;
            if(difficulty-i > 8){
                byte = hash[Math.floor(i/8)];
            } else {
                byte = hash[Math.floor(i/8)] >> 8-(difficulty-i);
            }
            if(byte !== 0){
                match = false;
                break;
            }
        }
        if(!match)
            setTimeout(findHash.bind(null,puzzle,difficulty,id+1,success),0);
        else
            success(id);
    }
    socket.on("setup", function (data) {
        /**
         * @typedef {object} data
         * @typedef {Array<int>} data.dataIDs
         * @typedef {Array<object>} data.structure;
         */
        self.dataList = data.dataList;
        self.structure = data.structure;

        for (let i in self.dataList) {
            var botUI = new BotUi(i, self.structure);
            botUI.create();
            self.botUIs[i] = botUI;
        }
        for (let i in self.dataList) {
            if (self.botUIs[i])
                self.botUIs[i].update(self.dataList[i]);
        }
    });
    socket.on("authRequired", function (challenge) {
        console.log(challenge)
        findHash(challenge.puzzle, challenge.difficulty,0,function(solution){
            console.log("difficulty: "+challenge.difficulty+"| tries: "+solution);
            pb.prompt(function(password){
                    socket.emit("auth", {password: password, solution:solution})
                }, // Callback
                'Password',  // Prompt text
                'password',  // Input type, or 'textarea'
                '', // Default value
                'Submit',  // Submit text
            );
        });
    });
    socket.on("noAuthRequired", function () {
        socket.emit("auth", )
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
        if (self.botUIs[data.id])
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
