/**
 * Created by Nexus on 15.08.2017.
 */
const BotWebInterface = require("./main");

let BWI = new BotWebInterface({port: 2080});

BWI.publisher.setDefaultStructure([
    {name: "name", type: "text", label: "idasd"},
    {name: "bots", type: "botUI", label: "Status"}
]);

var i = 0;
/**
 *
 * @type {Array<BotUI>}
 */
var interfaces = [];
var subInterfaces = [];

/**
 *
 * @returns {BotUI}
 */
function create() {
    var a = BWI.publisher.createInterface();
    a.setDataSource(function () {
        return {
            name: a.id,
        }
    });

    i++;
    return a;
}

for (let l = 0; l < 4; l++) {
    interfaces[l] = create();
}
setInterval(function () {
    var a = interfaces.shift();
    a.destroy();
    let botUI = create();
    let subBotUI1 = botUI.createSubBotUI([
        {name: "foo", type: "text", label: "foo"},
        {name: "id", type: "text", label: "id"},
        {name: "namse", type: "text", label: "id"},
        {name: "nsame", type: "text", label: "id"},
    ], "bots");
    let subBotUI2 = botUI.createSubBotUI([
        {name: "foo", type: "text", label: "foo"},
        {name: "id", type: "text", label: "id"},
        {name: "toggleActive", type: "button", label: "asd"}
    ], "bots");
    let i = 0;
    a.setDataSource(function () {
        return {
            id: a.id,
            foo: i++,
        }
    });
    subBotUI1.setDataSource(function () {
        return {
            id: subBotUI1.id,
            foo: i++,
        }
    });
    subBotUI2.setDataSource(function () {
        return {
            id: subBotUI2.id,
            foo: i++,
        }
    });
    interfaces.push(botUI);
}, 1000);


