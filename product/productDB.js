require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

class ProductDB {
  #database;
  #client;
  #collection;
  constructor() {
    this.url = process.env.DB_URL;
    if (!this.url) {
      throw new Error("Missing DB_URL environment variable");
    }
    this.status = false;

    this.#client = new MongoClient(this.url, {
      serverAPI: {
        version: ServerApiVersion.v1, 
        strict: false,
        deprecationErrors: true,
      },
    });
    this.#database = this.#client.db("CST3144");
    this.#collection = this.#database.collection("Lessons");
  }

  async findAll() {
    const result = await this.#collection.find().toArray();
    return result;
  }
}

module.exports = { ProductDB };
