/**
 * Created by Nexus on 30.07.2017.
 */

var BotUi = function (id, structure) {
    this.id = id;
    this.structure = structure;
    this.element = null;
};

BotUi.prototype.destroy = function () {
    var container = document.getElementsByClassName("botUIContainer")[0];
    container.removeChild(this.element);
};

BotUi.prototype.create = function () {
    var element = document.createElement("div");
    element.className = "box";
    var html = "";
    for (var i in this.structure) {
        var name = this.structure[i].name;
        var label = this.structure[i].label;
        var type = this.structure[i].type;
        var options = this.structure[i].options;
        switch (type) {
            case "text":
                html += "<div class='" + name + " textDisplay boxRow'><div class='textDisplayLabel'>" + label + ": </div><div class='textDisplayValue'></div></div>";
                break;
            case "progressBar":
                if (!options)
                    options = {
                        color: "green"
                    };
                html += "<div class='" + name + " progressBarDisplay boxRow'>  <div class='border'><div class='bar' style='background-color: " + options.color + "'> </div> <div class='barLabel'>" + label + ": <div class='value'>0%</div></div>  </div>  </div>";
                break;
            case "image":
                if(!options) {
                    options = {
                        width: 200,
                        height: 200
                    };
                }
                    html += "<div class='"+name+" imageDisplay boxRow'> <img src='' style='width:"+options.width+"px;height:"+options.height+"px;'/> </div>";

                break;
            case "graph":
                //TODO implement later
                break;
            case "button":
                //TODO implement later
                break;
            case "botUI":

                break;

        }
    }
    element.innerHTML = html;
    this.element = element;
    var container = document.getElementsByClassName("botUIContainer")[0];
    container.appendChild(element);
};

/**
 * Updates html object with data object
 */
BotUi.prototype.render = function () {
    for (var i in this.structure) {
        var name = this.structure[i].name;
        var type = this.structure[i].type;
        var value = this.data[name];
        if(value === undefined)
            continue;
        var row = this.element.getElementsByClassName(name)[0];
        switch (type) {
            case "text":
                row.getElementsByClassName("textDisplayValue")[0].innerHTML = value;
                break;
            case "progressBar":
                row.getElementsByClassName("bar")[0].style.width = value + "%";
                row.getElementsByClassName("value")[0].innerHTML = value + "%";
                break;
            case "image":
                row.getElementsByTagName("img")[0].src = value;
                break;
            case "graph":
                //TODO implement later
                break;

        }
    }

};
/**
 * Updates bot data
 */
BotUi.prototype.update = function (data) {
    this.data = data;
    this.render();
};

BotUi.prototype.updateProperty = function (name, value) {
    this.data[name] = value;
    this.render();
};