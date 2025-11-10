const express = require("express");
const http = require("http");
const morgan = require("morgan");
const fs = require("fs");
var path = require("path");
const  {ProductController}  = require("./product/productController");
const productController = new ProductController();
const app = express();
app.use(express.json());
app.use(morgan("short"));

app.use("/product",productController.productRouter)

http.createServer(app).listen(8080);
  