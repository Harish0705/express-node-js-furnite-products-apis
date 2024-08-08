import 'dotenv/config';
import { connectDB } from "./db/dbconnect.js";
import { Product } from './model/productsSchema.js';
import productData from "./products.json" assert { type: "json" };

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await Product.deleteMany()
    await Product.create(productData)
    console.log('Database populated with data')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()