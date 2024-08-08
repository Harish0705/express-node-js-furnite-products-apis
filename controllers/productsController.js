import { Product } from "../model/productsSchema.js";

export const getAllProducts = async (req, res) => {
  const { isProductfeatured, productCompany, productName } = req.query;
  console.log({ "Request query": req.query });
  const queryObject = {};
  // search products based on featured status
  if (isProductfeatured) queryObject.isProductfeatured = isProductfeatured;
  console.log({ "query object featured": queryObject });

  // search products based on company name
  if (productCompany) queryObject.productCompany = productCompany;
  console.log({ "query object company": queryObject });

  // search products based on product name-set options to i for case-insesitve
  if (productName)
    queryObject.productName = { $regex: productName, $options: "i" };
  console.log({ "query object productName": queryObject });

  const products = await Product.find(queryObject);
  return res.status(200).json({ products, nbHits: products.length });
};
