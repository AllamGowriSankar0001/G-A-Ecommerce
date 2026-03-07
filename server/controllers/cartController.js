const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

const auth = (req, res) => {
  if (!req.user?._id) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }
  return true;
};

const getOrCreateCart = async (userId) => {
  let cart = await cartModel.findOne({ user: userId });
  if (!cart) cart = new cartModel({ user: userId, items: [] });
  return cart;
};

const toId = (p) => (p?._id ?? p).toString();
const match = (item, productId, size = "", color = "") =>
  toId(item.product) === productId && String(item.size ?? "") === String(size) && String(item.color ?? "") === String(color);

const sendCart = async (res, cart, message = "OK") => {
  const populated = await cartModel.findById(cart._id).populate("items.product");
  res.status(200).json({ message, cart: populated });
};

const addToCart = async (req, res) => {
  if (!auth(req, res)) return;
  try {
    const { productId, quantity, size, color } = req.body;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find((i) => match(i, productId, size, color));

    if (existing) existing.quantity += quantity || 1;
    else cart.items.push({ product: productId, quantity: quantity || 1, size, color, priceAtAdd: product.price });

    await cart.save();
    await sendCart(res, cart, "Product added to cart successfully");
  } catch (err) {
    console.error("addToCart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getCart = async (req, res) => {
  if (!auth(req, res)) return;
  try {
    const cart = await getOrCreateCart(req.user._id);
    await cart.save();
    const populated = await cartModel.findById(cart._id).populate("items.product");
    res.status(200).json({ message: "Cart fetched successfully", cart: populated });
  } catch (err) {
    console.error("getCart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const removeFromCart = async (req, res) => {
  if (!auth(req, res)) return;
  try {
    const { productId } = req.params;
    const size = req.query.size ?? "";
    const color = req.query.color ?? "";
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => !match(i, productId, size, color));

    await cart.save();
    await sendCart(res, cart, "Product removed");
  } catch (err) {
    console.error("removeFromCart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateQuantity = async (req, res) => {
  if (!auth(req, res)) return;
  try {
    const { productId, quantity, size, color } = req.body;
    if (quantity == null || quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => match(i, productId, size ?? "", color ?? ""));
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();
    await sendCart(res, cart, "Quantity updated");
  } catch (err) {
    console.error("updateQuantity:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addToCart, getCart, removeFromCart, updateQuantity };
