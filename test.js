/**
 * Created by Nexus on 15.08.2017.
 */
var socketServer = require("./main");

var publisher = socketServer.SocketServer.getPublisher();

publisher.setStructure([
    {name: "name", type: "text", label: "name"},
    {name: "inv", type: "text", label: "Inventory"},
    {name: "level", type: "text", label: "Level"},
    {name: "xp", type: "progressBar", label: "Experience", options:{color:"green"}},
    {name: "health", type: "progressBar", label: "Health", options:{color:"red"}},
    {name: "mana", type: "progressBar", label: "Mana",     options:{color:"blue"}},
    {name: "status", type: "text", label: "Status"},
    {name: "image", type: "image", label: "asd" ,options:{width:200, height:400}},

]);

var a =  publisher.createInterface();

a.setDataSource(function () {
    return {
        level: 12,
        inv: 12,
        xp: 100* 12 / 12,
        health: 100,
        mana: 100,
        status: "online"
    }
});

var b =  publisher.createInterface();

b.setDataSource(function () {
    return {
        level: 12,
        inv: 12,
        xp: 100* 12 / 12,
        health: 100,
        mana: 100,
        status: "online"
    }
});

var c =  publisher.createInterface();

c.setDataSource(function () {
    return {
        level: 12,
        inv: 12,
        xp: 100* 12 / 12,
        health: 100,
        mana: 100,
        status: "online"
    }
});
var PNGImage = require('pngjs-image');



var i =0;
setInterval(function(){
    var image = PNGImage.createImage(200, 200);

    image.fillRect(0, 0, image.getWidth(), image.getHeight(), {red:255,green:255,blue:255, alpha:255})
    image.setAt(20, 30, { red:255, green:0, blue:0, alpha:255 });
    for(var j=0;j<i;j++){
        image.setAt(j%200, Math.floor(j/200), { red:255, green:0, blue:0, alpha:255 });
    }
    i++;
    var png = image.getImage();
    png.pack();
    var chunks = [];
    png.on('data', function(chunk) {
        chunks.push(chunk);
    });
    png.on('end', function() {
        var result = Buffer.concat(chunks);
        a.pushData("image","data:image/png;base64,"+result.toString('base64'));
    });
},500);

