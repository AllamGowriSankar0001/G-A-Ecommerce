const express = require("express");
const productModel = require("../models/productModel"); // make sure path is correct
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

const CreateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      subCategory,
      stock,
      sizes,
      colors,
      isActive,
    } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item)=>item !== undefined);

    let imageURl = await Promise.all(
      images.map(async(item)=>{
        let result = await cloudinary.uploader.upload(item.path,{resource_type:"image"});
        return result.secure_url;
      })
    )
    console.log(imageURl);

    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !imageURl ||
      imageURl.length === 0
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const product = await productModel.create({
      title,
      description,
      price,
      category,
      subCategory,
      images:imageURl,
      stock,
      sizes,
      colors,
      isActive,
    });

    res.status(201).json({
      message: "Product created successfully",
      product, // fixed: use the variable `product`
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error creating product" });
  
  }

};
const GetAllProducts = async (req, res) => {
  try {
    const products = await productModel.find(); 
    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
};
const RemoveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error deleting product" });
  }
};
const UpdateProduct = async (req, res) => {

  try {
    const { id } = req.params;
    const { title, description, price, category, subCategory, images, stock, sizes, colors, isActive } = req.body;
    const product = await productModel.findByIdAndUpdate(id, { title, description, price, category, subCategory, images, stock, sizes, colors, isActive });
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error updating product" });
  }
};
const GetProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error fetching product" });
  }
};

const GetProductsByCategory = async (req, res) => {
  try {
    const category = String(req.params.category || "").trim().toLowerCase();
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await productModel.find({ category });
    return res.status(200).json({
      message: "Fetched products by category",
      productsByCategory: products,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error fetching products by category",
      error: err.message,
    });
  }
};

const GetProductBysubCategory = async (req, res) => {
  try {
    // Accept both keys to avoid breaking older route params
    const subCategory = String(
      req.params.subcategory ?? req.params.subCategory ?? req.params.category ?? ""
    )
      .trim()
      .toLowerCase();

    if (!subCategory) {
      return res.status(400).json({ message: "Subcategory is required" });
    }

    const products = await productModel.find({ subCategory });
    return res.status(200).json({
      message: "Fetched products by subcategory",
      // keep old key for frontend compatibility
      productsBysubCategory: products,
      productsBySubCategory: products,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error fetching products by subcategory",
      error: err.message,
    });
  }
};

module.exports = {
  CreateProduct,
  GetAllProducts,
  RemoveProduct,
  UpdateProduct,
  GetProductById,
  GetProductsByCategory,
  GetProductBysubCategory,
};
