import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: [true, "product name must be provided"],
  },
  productPrice: {
    type: Number,
    required: [true, "product price must be provided"],
  },
  isProductfeatured: {
    type: Boolean,
    default: false,
  },
  productRating: {
    type: Number,
    default: 4.5,
  },
  productCreatedAt: {
    type: Date,
    default: Date.now(),
  },
  productCompany: {
    type: String,
    enum: {
      values: ["Ashley", "IKEA", "Godrej", "Durian"],
      message: "{VALUE} is not supported", // if any other value is entered
    },
  },
});

export const Product = mongoose.model("Product", productSchema);
