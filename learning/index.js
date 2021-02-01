const crypto = require("crypto");
const worker = require("worker_threads");

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
