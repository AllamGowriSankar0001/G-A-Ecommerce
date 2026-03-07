const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // MAIN CATEGORY
    category: {
      type: String,
      required: true,
      enum: ["men", "women", "shoes", "accessories"],
      lowercase: true,
      index: true,
    },

    //  SUB CATEGORY (Top Wear, Bottom Wear, etc.)
    subCategory: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    //  PRODUCT TYPE (T-shirt, Jeans, Saree, Sneakers etc.)
    productType: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: (val) => val.length > 0,
        message: "At least one product image is required",
      },
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    sizes: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, subCategory: 1, productType: 1 });

module.exports = mongoose.model("Product", productSchema);