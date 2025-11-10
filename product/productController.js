const { ProductService } = require("./productService");
const express = require("express");

class ProductController {
  constructor() {
    this.productRouter = express.Router();
    this.productService = new ProductService();

    
    this.productRouter.get("/",this.getAll.bind(this));
  }

  async getAll(req, res, next) {
    try {
      const products = await this.productService.getAllproducts();
      res.json(products);
    } catch (err) {
      next(err);
    }
  }
}
module.exports = { ProductController };
