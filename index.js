const express = require("express");
const http = require("http");
const morgan = require("morgan");
const fs = require("fs");
var path = require("path");
require("dotenv").config();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const url = process.env.DB_URL;
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

app.use("/image", (req, res, next) => {
  const filePath = path.join(__dirname, "static", req.url);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) return next();
    res.sendFile(filePath);
  });
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.param("collectionName", (req, res, next,collectionName) => {
    req.collection = db.collection(collectionName);
   return  next();

});

app.get("/collection/:collectionName",  (req, res) => {
  console.log(req.collection);
  req.collection.find({}).toArray((e,results)=>{
    if(e)return res.status(401).json(e)
        res.send(results)
  });
});

app.put("/collection/:colectionName/:id",  (req, res) => {

});

app.get("/search", async (req, res) => {});

app.post("/collection/:",  (req, res) => {

});

app.listen(3000);
