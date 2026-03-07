const express = require("express");
const {
  CreateProduct,
  GetAllProducts,
  RemoveProduct,
  UpdateProduct,
  GetProductById,
  GetProductsByCategory,
  GetProductBysubCategory,
} = require("../controllers/productController");
const upload = require("../middleware/multer");
const router = express.Router();

router.post("/createproduct",upload.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1}]),CreateProduct);
router.get("/allproducts",GetAllProducts);
router.delete("/removeproduct/:id",RemoveProduct);
router.put("/updateproduct/:id",UpdateProduct);
router.get("/getproduct/:id",GetProductById);
router.get("/getproductsbycategory/:category", GetProductsByCategory);
router.get("/getproductbysubcategory/:subcategory", GetProductBysubCategory);


module.exports = router;