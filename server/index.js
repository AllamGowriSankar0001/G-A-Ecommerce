const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const ConnectDB = require("./config/ConnectDB")
const connectcloudinary = require("./config/Cloudinary")
dotenv.config();
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")

// App Configuration
const app = express();
const PORT = process.env.PORT || 5000;
ConnectDB()
connectcloudinary()


// Middleware
app.use(express.json());
app.use(cors());


// API Endpoints
app.get("/", (req, res) => {
    res.send("Backend is working correctly");
});
app.use("/users", userRoutes);
app.use("/products",productRoutes)
app.use("/cart", cartRoutes)
app.use("/orders", orderRoutes)



// Server
app.listen(PORT, () => {
    console.log(`The Server is running on http://localhost:${PORT}`);
});
