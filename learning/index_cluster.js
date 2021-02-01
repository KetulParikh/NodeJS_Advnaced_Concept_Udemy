process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require("cluster");

// If the file being executed in master mode.
if (cluster.isMaster) {
  // Execute index.js again but in child mode
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  // Will run as a child proccess and act like a node server
  const crypto = require("crypto");
  const express = require("express");
  const app = express();

  app.get("/", (req, res) => {
    crypto.pbkdf2("hehe", "has dele", 100000, 512, "sha512", () => {
      res.send("Test");
    });
  });

  app.get("/fast", (req, res) => {
    res.send("Fast");
  });

  app.listen(5000);
}
