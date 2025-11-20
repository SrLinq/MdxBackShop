const express = require("express");
const http = require("http");
const morgan = require("morgan");
const fs = require("fs");
var path = require("path");
require("dotenv").config();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://Cluster01780:Jshdh6367@project.spzmh.mongodb.net/";
const app = express();
app.use(express.json());
app.use(morgan("short"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  next();  
});
let db;
// Conect to MongoDB
  MongoClient.connect(url, (error, client) => {
    db = client.db("CST3144");
    console.log("connected");
  });




app.listen(3000);
