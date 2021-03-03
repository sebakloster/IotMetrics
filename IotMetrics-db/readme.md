# iotmetrics-db

## Usage

```js
const setupDatabase = require("iotmetrics-db");

setupDatabase(config)
  .then((db) => {
    const { Agent, Metric } = db;
  })
  .catch((err) => console.err(err));
```
