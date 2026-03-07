const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

const ensureAuth = (req, res) => {
  if (!req.user?._id) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }
  return true;
};

const pickShippingAddress = (user) => {
  if (!user?.addresses || !user.addresses.length) return null;
  const def = user.addresses.find((a) => a.isDefault);
  return def || user.addresses[0];
};

const createOrder = async (req, res) => {
  if (!ensureAuth(req, res)) return;
  try {
    const userId = req.user._id;
    const { paymentMethod } = req.body || {};

    const allowed = ["COD", "UPI", "RAZORPAY"];
    if (!allowed.includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const user = await User.findById(userId);
    const address = pickShippingAddress(user);

    const items = cart.items.map((item) => ({
      product: item.product._id || item.product,
      quantity: item.quantity || 1,
      size: item.size,
      color: item.color,
      priceAtOrder: item.priceAtAdd ?? item.product.price ?? 0,
    }));

    const subtotal = items.reduce(
      (sum, i) => sum + i.priceAtOrder * (i.quantity || 1),
      0
    );

    // For now, use flat shipping = 0; you can plug in your own logic later.
    const shipping = 0;
    const total = subtotal + shipping;

    const order = new Order({
      user: userId,
      items,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
      status: "PLACED",
      subtotalAmount: subtotal,
      shippingAmount: shipping,
      totalAmount: total,
      shippingAddress: address || undefined,
    });

    await order.save();

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    const populated = await Order.findById(order._id).populate("items.product");
    res.status(201).json({ message: "Order placed successfully", order: populated });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ message: "Server error placing order" });
  }
};

const getMyOrders = async (req, res) => {
  if (!ensureAuth(req, res)) return;
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product");

    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (err) {
    console.error("getMyOrders error:", err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};

