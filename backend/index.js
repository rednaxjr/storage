var express = require('express');
var config = require('./src/config');
var routes = require('./src/routes');
const path = require('path');
const app = express();
var cors = require('cors');

app.use(config);
app.use(cors()); 

app.use("/api", routes); 
app.get('/*', (req, res) => {
  res.sendFile('./src/views/index.html', { root: __dirname });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 'message': err.message });
  return;
});

app.listen(process.env.PORT, () => {
  console.log("Running in Port:" + process.env.PORT);
});