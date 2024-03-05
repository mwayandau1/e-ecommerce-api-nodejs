const router = require("express").Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/ProductController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const { singleProductReviews } = require("../controllers/reviewController");

router
  .route("/")
  .get(getAllProducts)
  .post([authenticateUser, authorizePermissions("admin")], createProduct);

router
  .route("/upload-image")
  .post([authenticateUser, authorizePermissions("admin")], uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions("admin")], updateProduct)
  .delete([authenticateUser, authorizePermissions("admin")], deleteProduct);
router.route("/:id/reviews").get(singleProductReviews);

module.exports = router;
