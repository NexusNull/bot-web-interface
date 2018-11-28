/**
 * Created by Nexus on 15.08.2017.
 */
var botWebInterface = require("./main");

botWebInterface.startOnPort(80);
var publisher = botWebInterface.SocketServer.getPublisher();


publisher.setStructure([
    {name: "botui", type: "botUI", label: "BotUi"},
    {name: "name", type: "text", label: "name"},
    {name: "inv", type: "text", label: "Inventory"},
    {name: "level", type: "text", label: "Level"},
    {name: "xp", type: "progressBar", label: "Experience", options: {color: "green"}},
    {name: "health", type: "progressBar", label: "Health", options: {color: "red"}},
    {name: "mana", type: "progressBar", label: "Mana", options: {color: "blue"}},
    {name: "status", type: "text", label: "Status"}
]);

var i = 0;
var interfaces = [];
function create() {
    var a = publisher.createInterface();
    a.setDataSource(function () {
        return {
            level: a.id,
        }
    });
    return a;
    i++;
}
for(let l=0;l<4;l++){
    interfaces[l] = create();
}
setInterval(function () {
    var a = interfaces.shift();
    console.log("remove "+a.id);
    publisher.removeInterface(a);
    interfaces[3] = create();
}, 1000);


