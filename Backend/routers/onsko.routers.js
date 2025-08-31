import express from 'express'
const  router = express.Router()
import { login, signin, productStore, blogspost, uploadReview, verifyPayment,getOrder, paypalpayment, updateProductRating, removeallcart, getproducts, getuser, removecart, createCart, getAllProducts, getcart, getProductById, getblogs, getcategory, admin, logout,getreview, Searchproduct,resendMessageToEmail,getOrders } from '../controllers/usercontroller.js'
import upload from '../utils/multer.js'

import validationAdmin from '../middlewares/isAdmin.js'



router.route("/signin").post(upload.single('profileImage'), signin)
router.route("/login").post(login)
router.route("/logout").post(validationAdmin,logout)
router.route("/admin").post(validationAdmin, admin)
router.route("/blogs").post(validationAdmin,upload.single("ImageFile"), blogspost)
router.route("/productadd").post(validationAdmin,upload.single("image"), productStore)
router.route("/cart/:id").post(validationAdmin, createCart)
router.route("/getuser").get(validationAdmin,getuser)
router.route("/removeallcart").post(validationAdmin, removeallcart)
router.route("/updaterating/:id").post(updateProductRating)
router.route("/uploadReview/:id").post(validationAdmin,uploadReview)
router.route("/removecart/:id").post(validationAdmin, removecart)
router.route("/getOrder").post(validationAdmin,getOrder)
router.route("/sendEmail").post(validationAdmin, resendMessageToEmail)
router.route("/order").post(validationAdmin, verifyPayment)



//get request start from here
router.route("/findproduct").get(validationAdmin, Searchproduct)
router.route("/getOrders").get(validationAdmin, getOrders)
router.route("/getUserReview/:id").get(validationAdmin,getreview)
router.route("/getproducts/:type").get(validationAdmin,getproducts)
router.route("/getAllproducts").get(validationAdmin,getAllProducts)
router.route("/getProductById/:id").get(validationAdmin,getProductById)

router.route("/getblogs").get(validationAdmin,getblogs)
router.route("/getcategory").get(validationAdmin,getcategory)
router.route("/getcart").get(validationAdmin, getcart)

router.route("/create-checkout-session").post(validationAdmin,paypalpayment);
// router.route("/create/order").post(validationAdmin, paypalpayment);
router.route("/payment-success").post(validationAdmin,verifyPayment);






export default router