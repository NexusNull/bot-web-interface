/**
 * Created by Nexus on 16.08.2017.
 */

var BotUI = function (publisher, id, structure, parent, attachTarget) {
    this.publisher = publisher;
    this.id = id;
    this.structure = structure;
    this.parent = parent ? parent : null;
    this.attachTarget = attachTarget ? attachTarget : null;
    this.children = {};
    this.cache = {};
    this.dataSource = function () {
        return null;
    };
};

BotUI.prototype.fetchData = function () {
    this.cache = this.dataSource();
};

BotUI.prototype.setDataSource = function (callback) {
    this.dataSource = callback;
};

BotUI.prototype.getData = function () {
    return this.cache;
};

BotUI.prototype.pushData = function (name, value) {
    this.publisher.pushData(this.id, name, value);
};
/**
 *
 * @param {array} structure
 * @param {string} attachTarget
 * @returns {BotUI}
 */
BotUI.prototype.createSubBotUI = function (structure, attachTarget) {
    let botUI = this.publisher.createInterface(structure, this, attachTarget);
    this.children[botUI.id] = botUI;
    return botUI;
};

BotUI.prototype.getParent = function () {
    return this.parent;
};

BotUI.prototype._destroy = function () {
    if (this.parent) {
        delete this.parent.children[this.id];
    }
};

BotUI.prototype.destroy = function () {
    // remove from parent
    let dependents = [this.id];
    for (let i = 0; i < dependents.length; i++) {
        if (this.publisher.botUIs[dependents[i]]) {
            for (let id in this.publisher.botUIs[dependents[i]].children) {
                this.publisher.botUIs[dependents[i]].children[id]._destroy();
                dependents.push(+id);
            }
        }
    }
    for (let i = 0; i < dependents.length; i++) {
        delete this.publisher.botUIs[dependents[i]];
    }
    return dependents;
};

BotUI.prototype.getStructure = function () {
    return {
        parent: this.parent ? this.parent.id : null,
        attachTarget: this.attachTarget,
        structure: this.structure
    };
};

module.exports = BotUI;