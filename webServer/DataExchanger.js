/**
 * Created by Nexus on 16.08.2017.
 */

var DataExchanger = function (publisher, id) {
    this.publisher = publisher;
    this.id = id;
    this.dataSource = function () {
        return null;
    };
};

DataExchanger.prototype.setDataSource = function (callback) {
    this.dataSource = callback;
};

DataExchanger.prototype.getData = function () {
    return this.dataSource();
};

DataExchanger.prototype.pushData = function (name, value) {
    this.publisher.pushData(this.id, name, value);
};

module.exports = DataExchanger;