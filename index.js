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
const ObjectID=require("mongodb").ObjectID
app.put("/collection/:colectionName/:id",  (req, res) => {
req.collection.findOne({_id: new ObjectID(req.params.id)}, (e,result)=>{
  if(e) return next(e)
      res.send(result)
})
});

app.get("/collection/:collectionName/search", (req, res, next) => {
    const search = req.query.search;

    if (isNaN(search)) {
        console.log("Searching text:", search);
        const stringSearch = String(search);

        // Fix: Pass the string directly to $regex, and use $options
        const regExp = { $regex: stringSearch, $options: 'i' };

        const query = {
            $or: [{ name: regExp }, { location: regExp }, { about: regExp }],
        };

        req.collection.find(query).toArray((e, results) => {
            if (e) return next(e);
            res.send(results);
        });

    } else {
        console.log("Searching number:", search);
        let numbSearch = Number(search);
        const query = { $or: [{ price: numbSearch }, { stock: numbSearch }] };
        

        req.collection.find(query).toArray((e, results) => {
            if (e) return next(e);
            res.send(results);
        });
    }
});
app.post("/collection/:collectionName/order",  (req, res) => {
const order= req.body
console.log(order)
req.collection.insertOne(order)
res.send("okay")
}); 

app.listen(3000);
