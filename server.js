const express = require("express");
const app = express();
const dotenv = require("dotenv");
const db_connect = require('./utils/db');

dotenv.config();

const port = process.env.port;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

db_connect();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
