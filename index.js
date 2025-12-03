const express = require("express");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

require("dotenv").config();

const url = process.env.DB_URL;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin || "*";

  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

let db;
MongoClient.connect(url, (error, client) => {
  if (error) {
    console.error("Failed to connect to MongoDB:", error);
    return;
  }

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

app.use((req, res, next) => {
  if (!db) {
    return res.status(503).send("Database not connected yet");
  }
  next();
});

app.param("collectionName", (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  return next();
});

app.get("/collection/:collectionName", (req, res) => {
  req.collection.find({}).toArray((error, results) => {
    if (error) return res.status(401).json(error);
    res.send(results);
  });
});
const ObjectID = require("mongodb").ObjectId;
app.put("/collection/:collectionName/:id", (req, res, next) => {
  const increment = Number(req.body.stock);
  if (Number.isNaN(increment)) {
    return res.status(400).send("stock must be a number");
  }

  req.collection.findOneAndUpdate(
    { _id: new ObjectID(req.params.id) },
    { $inc: { stock: increment } },
    { returnDocument: "after" },
    (error, results) => {
      if (error) return next(error);
      res.send(results.value);
    }
  );
});

app.get("/collection/:collectionName/search", (req, res, next) => {
  const { q } = req.query;
  if (!q) return res.status(400).send("Missing search query 'q'");

  if (isNaN(q)) {
    const regExp = { $regex: String(q), $options: "i" };
    const query = {
      $or: [{ name: regExp }, { location: regExp }, { about: regExp }],
    };

    return req.collection.find(query).toArray((error, results) => {
      if (error) return next(error);
      res.send(results);
    });
  }

  const numericSearch = Number(q);
  const query = { $or: [{ price: numericSearch }, { stock: numericSearch }] };

  req.collection.find(query).toArray((error, results) => {
    if (error) return next(error);
    res.send(results);
  });
});

app.post("/collection/:collectionName/order", (req, res) => {
  const order = req.body;
  console.log(order);

  req.collection.insertOne(order);
  res.send({ order: "success" });
});

app.listen(3000);
