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
        this.children = new Map();
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
        this.children.set(botUI.id, botUI);
        return botUI;
    };

    getParent() {
        return this.parent;
    };

    destroy(sub) {
        let destroyed = [this.id];

        for (let child of this.children) {
            child[1].destroy(true);
            this.children.delete(child[0])
            destroyed.push(child[0]);
        }

        if (!sub)
            this.publisher.removeInterfaces(destroyed)

        return destroyed;
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