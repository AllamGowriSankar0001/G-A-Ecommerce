const cartRouter = require("express").Router();
const Auth = require("../middleware/AuthVerify");
const { addToCart, getCart, removeFromCart, updateQuantity } = require("../controllers/cartController");

cartRouter.post("/addtocart", Auth, addToCart);
cartRouter.get("/getcart", Auth, getCart);
cartRouter.put("/updatequantity", Auth, updateQuantity);
cartRouter.delete("/removefromcart/:productId", Auth, removeFromCart);

module.exports = cartRouter;