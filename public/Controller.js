/**
 * Created by Nexus on 30.07.2017.
 */
var Controller = function () {
    this.botAmount = 0;
    this.dataIDs = null;
    this.defaultStructure = null;

    this.botUIs = {};
    this.socket = null;
};
var socket;

Controller.prototype.start = function () {
    var self = this;
    var password = null;
    var lastPassword = null;
    socket = io(document.location.host, {
        autoConnect: false,
        reconnection: true
    });
    socket.on('disconnect', function () {

    });

    function findHash(puzzle, difficulty, id, success) {
        const hash = sha512.digest(puzzle + id);
        let match = true;
        for (let i = 0; i < difficulty; i += 8) {
            var byte;
            if (difficulty - i > 8) {
                byte = hash[Math.floor(i / 8)];
            } else {
                byte = hash[Math.floor(i / 8)] >> 8 - (difficulty - i);
            }
            if (byte !== 0) {
                match = false;
                break;
            }
        }
        if (!match)
            setTimeout(findHash.bind(null, puzzle, difficulty, id + 1, success), 0);
        else
            success(id);
    }

    socket.on("setup", function (data) {
        /**
         * @typedef {object} data
         * @typedef {Array<int>} data.dataIDs
         * @typedef {Array<object>} data.structure;
         */
        for (var key in self.botUIs) {
            self.botUIs[key].destroy();
        }

        self.dataCache = data.dataCache;
        self.structure = data.structure;
        if (password == null)
            password = lastPassword;

        let ids = [];
        for (let id in self.structure) {
            ids.push(id);
        }
        ids.sort(function (a, b) {
            return a - b
        });
        for (let id of ids) {
            let structure = self.structure[id];
            if (structure.parent != null) {

                let botUI = new BotUi(id, structure.structure, self.botUIs[structure.parent], structure.attachTarget);
                botUI.create();
                self.botUIs[id] = botUI;
            } else {

                let botUI = new BotUi(id, structure.structure);
                botUI.create();
                self.botUIs[id] = botUI;
            }
        }
        for (let i in self.dataCache) {
            if (self.botUIs[i])
                self.botUIs[i].update(self.dataCache[i]);
        }
    });
    socket.on("authRequired", function (challenge) {
        findHash(challenge.puzzle, challenge.difficulty, 0, function (solution) {
            console.log("difficulty: " + challenge.difficulty + "| tries: " + solution);
            if (!password) {
                pb.prompt(function (password) {
                        socket.emit("auth", {password: password, solution: solution});
                        lastPassword = password;
                    }, // Callback
                    'Password',  // Prompt text
                    'password',  // Input type, or 'textarea'
                    '', // Default value
                    'Submit',  // Submit text
                );
            } else {
                socket.emit("auth", {password: password, solution: solution});
            }

        });
    });

    socket.on("noAuthRequired", function () {
        socket.emit("auth",)
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
        self.destroyBotUI(data);
    });

    socket.on("createBotUI", function (dataBotUI) {
        if (dataBotUI.parent != null) {
            let botUI = new BotUi(dataBotUI.id, dataBotUI.structure, self.botUIs[dataBotUI.parent], dataBotUI.attachTarget);
            botUI.create();
            self.botUIs[dataBotUI.id] = botUI;
        } else {
            let botUI = new BotUi(dataBotUI.id, dataBotUI.structure);
            botUI.create();
            self.botUIs[dataBotUI.id] = botUI;
        }
    });

    socket.open();
    this.socket = socket;
};

Controller.prototype.destroyBotUI = function (ids) {
    for (let botUIid of ids) {
        if (this.botUIs[botUIid]) {
            this.botUIs[botUIid].destroy();
            delete this.botUIs[botUIid];
        }
    }
};