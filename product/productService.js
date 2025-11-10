const { ProductDB } = require("./productDB");

class ProductService {
    constructor() {
        this.productRepository = new ProductDB();
    }

    async getAllproducts(){
       return await this.productRepository.findAll()
    }
}

module.exports = { ProductService };
 
