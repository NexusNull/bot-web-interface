/**
 * Created by Nexus on 16.08.2017.
 */

class BotUI {
    constructor(publisher, id, structure, parent, attachTarget) {
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

    fetchData() {
        this.cache = this.dataSource();
    };

    setDataSource(callback) {
        this.dataSource = callback;
    };

    getData() {
        return this.cache;
    };

    pushData(name, value) {
        this.publisher.pushData(this.id, name, value);
    };

    createSubBotUI(structure, attachTarget) {
        let botUI = this.publisher.createInterface(structure, this, attachTarget);
        this.children[botUI.id] = botUI;
        return botUI;
    };

    getParent() {
        return this.parent;
    };

    _destroy() {
        if (this.parent) {
            delete this.parent.children[this.id];
        }
    };

    destroy() {
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

    getStructure() {
        return {
            parent: this.parent ? this.parent.id : null,
            attachTarget: this.attachTarget,
            structure: this.structure
        };
    };
}

module.exports = BotUI;