/**
 * Created by Nexus on 29.07.2017.
 */
var WebServer = require("./webServer/WebServer");
var SocketServer = require("./webServer/SocketServer");
module.exports = SocketServer;

/*
SocketServer.setStructure([
    {name:"name", type:"text", label:"Name"},
    {name:"xp", type:"progressBar", label:"Experience",options:{color:"red"}}
])
SocketServer.registerDatSource(function(){
    return {
        name: "test",
        xp:10,

    }
})
*/