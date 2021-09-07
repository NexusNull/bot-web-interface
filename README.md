# bot-web-interface
This is a small project for displaying data of multiple sources on one webpage that gets automatically updated.

## Basic Usage

bot-web-interface is a small tool to create a live-dashboard from data within node.
It accomplishes this by running an express app in a http server, utilizing socket.io to send updates as they occur.

### Startup

In order to start bot-web-interface you must first require it and initialize it.
```javascript
const bwi = require("bot-web-interface");
//start up bwi
const bwi_instance = new bwi({
  //what port the http server should run on
  port: 2080,
  //what password the interface should have
  //null means no password is needed
  password: null
});
```

### Data Schemas

bot-web-interface presents data through tiles, which are referred to as interfaces. Each Interface belongs to one block of data. In order to know how to render an interface you must specify a schema for it.
A Schema is an array, specifying for each piece of data a name, a type, a label, as well as some optional options.
A list of some possible types is given in this example:
```javascript
bwi_instance.publisher.setDefaultStructure([
  {name: "greeting", type: "text", label: "Greeting"},
  {name: "balance", type: "progressBar", label: "Balance", options: {color: "green"}},
  {name: "imbalance", type: "progressBar", label: "Imbalance"},
  {name: "rating", type: "labelProgressBar", label: "Rating"}
]);
```
It is not necessary to specify a default structure if you specify the structure of each interface individually.

### Interfaces

In order to display data you need to create interfaces. Interfaces are bound to the schema they use, as well as a data source, which supplies the data to be displayed.
```javascript
//an interface using the default structure
const interface1 = bwi_instance.publisher.createInterface();
//specify a static data source
interface1.setDataSource(() => ({
  greeting:"Hello",
  //Take note that the progress needs to be supplied in %
  //and not as a range from 0 to 1
  balance:50,
  imbalance:31.4,
  rating:[60,"6/10"]
}));
//an interface using a custom structure
const interface2 = bwi_instance.publisher.createInterface([
  {name: "speech", type: "text", label: "See also"}
]);
//specify a dynamic data source
interface2.setDataSource(() => ({
  speech:"Hello "+["Cat","Dog","Cow","Monkey"][Math.floor(Math.random()*4)]
}));
```