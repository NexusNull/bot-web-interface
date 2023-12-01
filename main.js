/**
 * Created by Nexus on 29.07.2017.
 */

const express = require('express');
const Client = require("./Client");
const path = require("path");
const Publisher = require("./Publisher");
const sha512 = require('js-sha512').sha512;
const io = require('socket.io');
const customParser = require('socket.io-msgpack-parser');

class BotWebInterface {
    constructor(config = {}) {
        this.port = config.port || 2080;
        this.updateRate = config.updateRate || 100;

        if (config.password) {
            if (typeof config.password != "string")
                throw new TypeError("config.password needs to be of type string");
            else
                this.password = config.password;
        } else {
            this.password = null;
        }

        this.clients = [];
        this.defaultStructure = [];

        this.router = express.Router();
        this.app = express();
        this.server = require('http').createServer(this.app);

        this.io = io(this.server, {
            parser: customParser
        });

        this.publisher = new Publisher(this.updateRate);


        this.setRoutes();
        this.openSocket()
        this.server.listen(this.port);
    }

    setRoutes() {
        this.router.use('/', express.static(__dirname + '/public'));
        this.router.use("/sha512.js", function (req, res) {
            res.sendFile(path.resolve(require.resolve("js-sha512") + "/../../build/sha512.min.js"));
        });
        console.log(path.resolve(require.resolve("socket.io-client") + "/../../../dist/socket.io.msgpack.min.js"))
        this.router.use("/socket.io.js", function (req, res) {
            res.sendFile(path.resolve(require.resolve("socket.io-client") + "/../../../dist/socket.io.msgpack.min.js"));
        });
        this.router.use("/prompt-boxes.js", function (req, res) {
            res.sendFile(path.resolve(require.resolve("prompt-boxes") + "/../../../dist/prompt-boxes.min.js"));
        });
        this.router.use("/prompt-boxes.css", function (req, res) {
            res.sendFile(path.resolve(require.resolve("prompt-boxes") + "/../../../dist/prompt-boxes.min.css"));
        });
        this.app.use(this.router);
        this.app.use(function (req, res) {
            res.status(404).send(" 404: Page not found");
        });
    }


    openSocket() {
        this.io.sockets.on('connection', (socket) => {
            const client = new Client(socket, this, this.clients.length);
            if (this.password != null) {
                var puzzle = Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1000000) + new Date();
                var difficulty = 8;

                socket.emit("authRequired", {puzzle: puzzle, difficulty: difficulty});
            } else {
                socket.emit("noAuthRequired");
            }
            socket.on("auth", (auth) => {
                if (this.password == null) {
                    this.publisher.clientJoined(client);
                    this.clients.push(client);
                    return;
                }
                if (auth.solution && (auth.solution + "").length < 20) {
                    /*
                    This is here because I like playing around with different things.
                     */
                    let hash = sha512.digest(puzzle + auth.solution);
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
                        socket.disconnect();
                } else {
                    socket.disconnect();
                }
                if (auth.password === this.password) {
                    this.publisher.clientJoined(client);
                    this.clients.push(client);
                } else {
                    puzzle = Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1000000) + new Date();
                    socket.emit("authRequired", {puzzle: puzzle, difficulty: difficulty});
                }
            });
            socket.on("disconnect", () => {
                this.removeClient(client);
            })
        });
    }


    removeClient(client) {
        for (let i in this.clients) {
            if (this.clients[i] === client) {
                this.publisher.clientLeft(client);
                delete this.clients[i];
            }
        }
    }
}

module.exports = BotWebInterface;
