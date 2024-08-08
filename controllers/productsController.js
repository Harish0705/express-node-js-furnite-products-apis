import { Product } from "../model/productsSchema.js";

export const getAllProducts = async (req, res) => {
  const { isProductfeatured, productCompany, productName, filterBy, sortBy, includeFields } =
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

  // Filter products based on price and rating
  if (filterBy) {
    const vaildOperators = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };
    const validOptions = ["productPrice", "productRating"];
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    // replace user friendly operators to monogo db operators
    // example: filterBy=productPrice<=50,productRating>3 changes to filterBy=productPrice-$lte-50,productRating-$gt-3
    let filters = filterBy.replace(
      regEx,
      (match) => `-${vaildOperators[match]}-`
    );

    filters.split(",").forEach((el) => {
      const [field, operator, value] = el.split("-");
      if (validOptions.includes(field))
        queryObject[field] = { [operator]: value };
      console.log(filters);
    });
  }
  console.log({ "query object filterBy": queryObject });

  let productsResult = Product.find(queryObject);

  // implementing sorting
  if (sortBy) {
    // convert productName,productCompany to productName productCompany because the sort method takes arguments separated by space not comma.
    const sortProducts = sortBy.split(",").join(" ");
    productsResult = productsResult.sort(sortProducts);
    // console.log(sortProducts)
  } else {
    // populate additional data to see the difference in created date
    // by default sorted by created date
    productsResult = productsResult.sort("productCreatedAt");
  }

  // select only particular fields example only product name and price
  if (includeFields) {
    const fieldsList = includeFields.split(',').join(' ');
    productsResult = productsResult.select(fieldsList);
  }
  const products = await productsResult;
  return res.status(200).json({ products, nbHits: products.length });
};
