import { Product } from "../model/productsSchema.js";

export const getAllProducts = async (req, res) => {
  const { isProductfeatured, productCompany, productName, numericFilters } =
    req.query;
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

  if (numericFilters) {
    const vaildOperators = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    // replace user friendly operators to monogo db operators
    // example: numericFilters=productPrice<=50,productRating>3 changes to numericFilters=productPrice-$lte-50,productRating-$gt-3
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${vaildOperators[match]}-`
    );

    const validOptions = ["productPrice", "productRating"];
    filters = filters.split(",").forEach((el) => {
      const [field, operator, value] = el.split("-");
      if (validOptions.includes(field))
        queryObject[field] = { [operator]: value };
    });
  }
  console.log({ "query object numericFilters": queryObject });

  const products = await Product.find(queryObject);
  return res.status(200).json({ products, nbHits: products.length });
};
