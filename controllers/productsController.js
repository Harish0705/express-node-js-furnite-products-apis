import { Product } from "../model/productsSchema.js";

export const getAllProducts = async (req, res) => {
  const query = req.query
  const products = await Product.find(query);
  return res.status(200).json({ products, nbHits:products.length });
};