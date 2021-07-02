# IotMetrics 

IoyMetrics is a platform to measure, process, store, and display metrics from IOT devices.

## Usage
In order to use the app, you need to start the MQTT server, the API and the web server, then you can start creating agents! 

Example of creating new agents: 
```javascript
const agent = new IotMetricsAgent({
  name: "agentName",
  username: "user",
  interval: 2000,
});

agent.addMetric("rss", function getRss() {
  return process.memoryUsage().rss; //resicenced size (example memory data that we want to measure)
});

agent.addMetric("promiseMetric", function getRandomPromise() {
  return Promise.resolve(Math.random());
});

agent.addMetric("callbackMetric", function getRandomCallback(callback) {
  setTimeout(() => {
    callback(null, Math.random());
  }, 1000);
});

agent.connect();
```
You can also connect agents from a raspberry pi!
Once agents are created, they measure metrics which you can visualize on the web or in the CLI in realtime!

![alt text](https://i.imgur.com/MvESicA.png)

## CLI


In order to visualize metrics on the CLI, we just run the binary ./iotmetrics.js in the CLI module!


![alt text](https://i.imgur.com/dPrT96Q.png)

## Docs

Project architecture and components.

The application consists of different measuring agents that will send metrics to the MQTT server (you can connect a raspberry pi to it), this will later send the metrics in real time to the web and save them in the database.

We will also use an API server. The web client will request the first 20 measurements from the API in order to create a graph, then the rest measurments will be added to the graph in realtime through the MQTT server.

![alt text](https://i.imgur.com/ncufkaJ.png)



## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.



## License
[MIT](https://choosealicense.com/licenses/mit/)
