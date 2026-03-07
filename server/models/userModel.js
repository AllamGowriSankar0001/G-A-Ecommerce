const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
    },
    size: String,
    color: String,
    priceAtAdd: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    preferences: {
      newsletter: { type: Boolean, default: false },
      currency: { type: String, default: "INR" },
      language: { type: String, default: "en" },
    },

    addresses: [addressSchema],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    cart: {
      type: [cartItemSchema],
      default: [],
    },
    verifyotp:{
      type: String,
        default: "",
    },
    verifyotpExpiry: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp:{
      type: String,
      default: "",
    },
    resetOtpExpiry: {
      type: Number,
      default: 0,   
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model.User || mongoose.model("User", userSchema);
