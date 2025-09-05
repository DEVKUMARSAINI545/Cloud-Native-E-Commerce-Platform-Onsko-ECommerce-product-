import { z } from 'zod'
import user from '../models/usermodel.models.js'
import Product from '../models/Products.models.js'
import imagekit from '../utils/imagekit.js'
import Blogs from '../models/Blogs.models.js'
import Category from '../models/Category.models.js'
import Cart from '../models/Cart.models.js'
import jwt from 'jsonwebtoken'
import { paymentModel } from '../models/Payment.models.js'
import paypal from 'paypal-rest-sdk';
import Order from '../models/Order.models.js'
import Stripe from 'stripe';
import Review from '../models/Review.models.js'
import mongoose from 'mongoose'
import sendEmail from '../utils/sendEmail.js'
 
const stripe = new Stripe('sk_test_51QGeC3GCVUDiMIBN5AePLZ76YUKbhPKGWmCiMPK0D8xTFHEWjrsycYf3cBMTiV2QkS7wKAoieKLQMSVBdFCYBQJK00APfT1b3R'); // Secret Key

const productStore = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        // Zod validation schema
        const requirebody = z.object({
            name: z.string().min(5).max(100),
            description: z.string().min(3).max(1000),
            price: z.string().min(1).max(200000), // Adjusted min length
            category: z.string().min(3).max(100),
            stock: z.string().min(1).max(50000),
        });

        // Validate request body
        const parseDataSuccess = requirebody.safeParse(req.body);
        if (!parseDataSuccess.success) {
            console.log(parseDataSuccess.error.message);
            return res.status(400).json({ message: "Incorrect format", error: parseDataSuccess.error });
        }

        // Check if file is uploaded
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log(file.buffer);

        let response;
        try {
            response = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
            });
        } catch (uploadError) {
            console.error('ImageKit upload failed:', uploadError.message);
            return res.status(500).send('Failed to upload image.');
        }
        const usercategory = await Category.findOne({ name: category })
        if (!usercategory) {
            await Category.create({ name: category })
        }

        // Create product with image URL
        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            image: response.url, // Save the image URL in the product
        });


        if (!product) {
            return res.json({ message: "Product not added", success: false });
        }

        res.json({ product, success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Something went wrong", success: false });
    }
};




const signin = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Check if user already exists
        const isUserExist = await user.findOne({ email });
        if (isUserExist) {
            return res.status(409).json({ message: "User already exists. Please log in or use a different email.", success: false });
        }

        // Check if file is uploaded
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No profile image uploaded. Please upload an image.', success: false });
        }

        let response;
        try {
            response = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
            });
        } catch (uploadError) {
            console.error('ImageKit upload failed:', uploadError.message);
            return res.status(500).json({ message: 'Failed to upload image. Please try again later.', success: false });
        }

        // Create new user
        const userData = await user.create({
            fullname,
            email,
            password,
            address: "",
            phone: "",
            profileImage: response.url,
        });

        if (!userData) {
            return res.status(500).json({ message: "Failed to create user. Please try again.", success: false });
        }

        res.status(201).json({
            message: "Account successfully created!",
            success: true,
            userData
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Something went wrong. Please try again later.", success: false });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const requirebody = z.object({
            email: z.string().min(3).max(100).email(),
            password: z.string().min(8).max(50),
        });

        const parseDataSuccess = requirebody.safeParse(req.body);

        if (!parseDataSuccess.success) {
            console.log(parseDataSuccess.error.message);
            return res.status(400).json({
                statusCode: 400,   // ✅ Include status code in response body
                message: "Invalid input format.",
                error: parseDataSuccess.error,
            });
        }

        const userexist = await user.findOne({ email });

        if (!userexist) {
            return res.status(404).json({
                statusCode: 404,   // ✅ Include status code in response body
                message: "User not found. Please check your credentials.",
                success: false,
            });
        }

        const isMatchPassword = await userexist.comparePassword(password);

        if (!isMatchPassword) {
            return res.status(401).json({
                statusCode: 401,   // ✅ Include status code in response body
                message: "Incorrect password.",
                success: false,
            });
        }

        const token = await userexist.generateToken();
       
        if (!token) {
            return res.status(500).json({
                statusCode: 500,   // ✅ Include status code in response body
                message: "Token generation failed.",
                success: false,
            });
        }
 
        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax', // Allow the cookie to be sent cross-origin
              path: "/",
            
        };

        return res
            .status(200)
            .cookie("token", token, options)
            .json({
                statusCode: 200,    // ✅ Include status code in response body
                message: "Login successful!",
                success: true,
                userexist,
            });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            statusCode: 500,   // ✅ Include status code in response body
            message: "Internal server error.",
            success: false,
        });
    }
};


const logout = async (req, res) => {
    try {


        // Clear the token cookie by setting it to an empty value and an expiration date in the past
        res.cookie("token", "", { expires: new Date(0), httpOnly: true }); // Consider using httpOnly and secure options if applicable
        // Send a response indicating the user has been logged out
        return res.json({ message: "Successfully logged out", success: true });
    } catch (error) {
        // Handle any errors that may occur during the logout process
        return res.status(500).json({ message: "An error occurred during logout", success: false });
    }
};


const blogspost = async (req, res) => {
    try {
        const { headlines, bio } = req.body
    


        const requirebody = z.object({
            headlines: z.string().min(3).max(50),
            bio: z.string(),
        });
        const parseDataSuccess = requirebody.safeParse(req.body);
        if (!parseDataSuccess.success) {
            console.log(parseDataSuccess.error.message);
            return res.status(400).json({ message: "Incorrect format", error: parseDataSuccess.error });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }


        let response;
        try {
            response = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
            });
        } catch (uploadError) {
            console.error('ImageKit upload failed:', uploadError.message);
            return res.status(500).send('Failed to upload image.');
        }
        const userblog = await Blogs.create({
            headlines, bio, Blogpost: response.url
        })
        if (!userblog) {

            res.json({ message: "blog are not posted..", success: true })
            return
        }
        res.json({ message: "blog are posted", success: true, userblog })
    } catch (error) {
        console.log(error.message);
        res.json({ message: "something went wrong", success: false })

    }

}

const admin = (req, res) => {
    res.send("I am admin")
}


const getproducts = async (req, res) => {
    try {

        const result = await Product.aggregate([
            {
                $match: {
                    category: `${req.params.type}` // Filter by the specified category
                }
            },
            {
                $group: {
                    _id: "$category",      // Include the 'id' field (ensure that 'id' is a valid field in your collection)
                    products: { $push: "$$ROOT" }
                },
            },
            {
                $project: {
                    _id: 0,
                    category: `$_id`,
                    products: { $slice: ["$products", 10] },

                }

            }
        ]);

        const resultObject = result.reduce((acc, item) => {
            acc[item.category] = item.products
            return acc

        }, {})


        res.send(resultObject);
        // res.send(result)
    } catch (error) {
        console.log(error.message);

        res.json({ message: "something went wrong", success: true })
    }
}
const getblogs = async (req, res) => {
    try {
        const getblogs = await Blogs.find()
        res.json(getblogs)
    } catch (error) {
        console.log(error.message);
        res.json({ message: "something went wrong", success: true })
    }
}



const getcategory = async (req, res) => {
    try {
        const getdetail = await Category.find()
        res.json(getdetail)
    } catch (error) {
        console.log(error.message);

        res.json({ message: "something went wrong", success: true })
    }
}

const getAllProducts = async (req, res) => {

    try {
        const getproducts = await Product.find()
        if (!getproducts) {
            res.json({ message: "Network issue", success: true })
            return
        }
        res.json({getproducts:getproducts,success:true})
    } catch (error) {
        console.log(error.message);

        res.json({ message: "something went wrong", success: false })
    }
}
const getProductById = async (req, res) => {

    try {
        const getproducts = await Product.findById(req.params.id)
        if (!getproducts) {
            res.json({ message: "Network issue", success: true })
            return
        }
        res.json(getproducts)
    } catch (error) {
        console.log(error.message);

        res.json({ message: "something went wrong", success: false })
    }
}

const getcart = async (req, res) => {
    try {
        const users = await Cart.findOne({user:req.user}).populate('products.product')
        console.log(users);
        
        if(!users)
        {
          return res.status(404).json({message:"Can't find the cart data",success:false})
        }
        let cartDataStructure={}
        users.products.forEach((product) => {
            let key = product.product._id.toString(); // Assuming product.product contains the product details
            if (cartDataStructure[key]) {
                cartDataStructure[key].quantity += 1;
            } else {
                cartDataStructure[key] = {
                    ...product.product._doc, // Spread the product details
                    quantity: 1,
                };
            }
        });

        let finalArray = Object.values(cartDataStructure); // Corrected method name
        if (!finalArray) {
            res.json({ message: "Empty Cart......" })
        }
        res.json({ cart: finalArray, finalPrice: users.totalPrice }); // Ensure totalPrice is available
 
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message); // Use a 500 status code for server errors
    }


}
const createCart = async (req, res) => {
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ user: req.user });


        if (!cart) {
            // If the cart doesn't exist, create a new one
            cart = await Cart.create({
                user: req.user,
                products: [{ product: req.params.id }],
                totalPrice: product.price
            });
        } else {
            // If the cart exists, update it
           
            cart.products.push({ product: req.params.id });
            cart.totalPrice += product.price;
            await cart.save();
        }

        res.json({ success: true, message:"Successfully added product on cart" });
    } catch (error) {
        console.error("Error in createCart:", error);
        res.status(500).json({ success: false, message: error.message });
    }

};

const removecart = async (req, res) => {
    try {
        // Find the cart for the user
        let cart = await Cart.findOne({ user: req.user });
        if (!cart) {
            return res.status(404).send("Cart is empty.");
        }

        // Find the product by ID
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found.");
        }

        // Check if the product is in the cart
        const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.id);
        if (productIndex === -1) {
            return res.status(404).send("Product not in cart.");
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);
        cart.totalPrice -= product.price; // Ensure totalPrice is updated correctly

        // Save the updated cart
        await cart.save();

        // Send the updated cart
        res.json(cart);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Something went wrong", success: false });
    }
};

const removeallcart = async (req, res) => {
    try {
        // Find the cart for the user
        
        const cart = await Cart.findOneAndDelete({ user: req.user });
        if (!cart) {
            return res.status(404).send("Cart is empty or does not exist.");
        }

        // Optionally, you can also send a success message or the deleted cart
        res.json({ message: "Cart has been successfully deleted.", success: true });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Something went wrong", success: false });
    }
};





const getuser = async (req, res) => {
   
 
    try {
        // Verify the token and extract the email
           
        const {email} = req.query;
        console.log(email);
        
        const users = await user.findOne({email})
        if (!users) {
            res.json({ message: "users is not exist", success: false })
            return
        }

        // Respond with the user data
        return res.status(200).json({user:users,success:true});
    } catch (error) {
        // Handle any errors, such as token verification failure
        return res.status(401).json({ message: "Invalid token.", success: false });
    }


}

const paypalpayment = async (req, res) => {
    try {
        const { products } = req.body
        
        const lineItems = products.map((product) => ({
            price_data: {
                currency: 'usd', // Currency should be in lowercase
                product_data: {
                    name: product.name,  // Product name
                    images: [product.image], // Product image URL, array format
                },
                unit_amount: Math.round(product.price * 100), // Price in cents, rounding the value
            },
            quantity: product.quantity, // Quantity of the product

        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'amazon_pay'],
            line_items: lineItems, // Pass in the line items for the session
            mode: 'payment', // You can also use 'subscription' if you are creating subscriptions
            success_url: `http://localhost:5173/orderconfirm?session_id={CHECKOUT_SESSION_ID}`, // Redirect after success
            cancel_url: `http://localhost:5173/cart`, // Redirect after cancel
        });
        const newPayment = new paymentModel({
            userId:req.user,
            sessionId: session.id,
            paymentIntentId: "", // Will be updated later
            amount: session.amount_total / 100,
            currency: session.currency,
            paymentStatus: session.payment_status, // Pending until success
            products,
        });
        await newPayment.save(); // Save to MongoDB
    
        res.json(session);


    } catch (error) {
        console.error('Error creating checkout session:', error.message);
        res.status(500).send('Internal Server Error');
    }
};


const verifyPayment = async (req, res) => {

    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
            
        if (!session) return res.status(404).json({ error: "Session not found" });

        const payment = await paymentModel.findOne({ sessionId: session.id });
        
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
  
      payment.products.map((items)=>{
        console.log("Here are the Items ::: "+items)
      })
      
      const orderdata = await Order.create({
        userId: payment.userId,  // User who made the payment
        products: payment.products.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price
          })),
        paymentIntentId: session.payment_intent,  // Stripe payment intent ID
        totalAmount: payment.amount,  // Total paid amount
        orderDate: new Date(),  // Order date
        paymentStatus: 'Completed',  // Payment status
        shippingDetails: {},  // Add shipping details as needed
        paymentMethod:"PayPal",
      })
      await paymentModel.findOneAndUpdate(
        { sessionId: session.id },
        { paymentStatus: 'completed', orderId: orderdata._id },
        { new: true }
      );
      return res.json({ success: true, order: orderdata._id });
    } catch (error) {
        console.error("Error fetching payment details:", error.message);
        res.status(500).send("Internal Server Error");
    }


};

const getOrder = async (req, res) => {
    try {
      const { orderId } = req.body;
  
      if (!orderId) {
        return res.status(400).json({ message: "Order ID is required", success: false });
      }
  
      const populatedOrder = await Order.findById(orderId).populate("products.product").populate("userId")
  
      if (!populatedOrder) {
        return res.status(404).json({ message: "Order not found", success: false });
      }
  
      res.json({ success: true, order: populatedOrder });
    } catch (error) {
      console.error("Error fetching order:", error.message);
      res.status(500).json({ message: "Internal Server Error", success: false });
    }
  };

const getOrders = async(req,res)=>{
    try {
     
    
        const populatedOrder = await Order.find().populate("products.product")
    
        if (!populatedOrder) {
          return res.status(404).json({ message: "Order not found", success: false });
        }
    
        res.json({ success: true, order: populatedOrder });
      } catch (error) {
        console.error("Error fetching order:", error.message);
        res.status(500).json({ message: "Internal Server Error", success: false });
      }
}  
  

const updateProductRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        if (!id) {
            return res.json({ message: "Id not found", success: false });
        }

        if (typeof rating === 'undefined' || rating === null) {
            return res.json({ message: "Rating not provided", success: false });
        }

        const product = await Product.findByIdAndUpdate(id, { rating }, { new: true });

        if (!product) {
            return res.json({ message: "Product not found", success: false });
        }

        res.json({ message: "Rating updated successfully", success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Something went wrong", success: false });
    }

}


const uploadReview = async (req, res) => {
    try {
        const { id } = req.params; // Product ID
        const { review } = req.body;
        const userId = req.user; // Assuming you're using auth middleware to attach user to req
        
        if (!id) {
            return res.json({ message: "Product ID not found", success: false });
        }

        if (!review || review.trim() === "") {
            return res.json({ message: "Review not provided", success: false });
        }

        if (!user) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }

        const userReview = await Review.create({
            productID:id,
            userID:userId,
            comment:review
        })
        if(!userReview)
        {
            return res.status(400).json({ message: "userReview not created...", success: false });
        }
       
        res.json({ message: "Review added successfully", success: true, userReview });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Something went wrong", success: false });
    }
};

const getreview = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch reviews with populated user and product details
      const reviews = await Review.find({ productID: id })
        .populate('userID', 'fullname email profileImage createdAt')  // User details
        .populate('productID', 'name')                              // Product details
        .select('comment rating createdAt');
      
  
      // Check if no reviews found
      if (!reviews || reviews.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'No reviews found for this product.' 
        });
      }
  
      // Formatting the response
      const properData = reviews.map(review => ({
        productName: review.productID.name,
        review: {
          comment: review.comment,
          rating: review.rating,
        },
        user: {
          name: review.userID.fullname,
          email: review.userID.email,
          profilePic: review.userID.profileImage,
        }
      }));
  
      res.status(200).json({
        success: true,
        message: 'Reviews fetched successfully.',
        data: properData
      });
  
    } catch (error) {
      console.error(error);  // Log the error for debugging
  
      // Handle specific errors
      if (error.name === 'CastError') {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid product ID format.' 
        });
      }
  
      res.status(500).json({
        success: false,
        message: 'Internal Server Error. Please try again later.'
      });
    }
  };


  const Searchproduct = async (req, res) => {
    try {
      const searchQuery = req.query.search;
  
      // Check if searchQuery exists
      if (!searchQuery || searchQuery.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Search query is required.",
        });
      }
  
      // Optional: Allow only alphanumeric + space queries
      const isValidQuery = /^[a-zA-Z0-9 ]+$/.test(searchQuery);
      if (!isValidQuery) {
        return res.status(400).json({
          success: false,
          message: "Invalid search query. Only letters, numbers, and spaces are allowed.",
        });
      }
  
      // Perform case-insensitive search
      const products = await Product.find({
        name: { $regex: searchQuery, $options: "i" },
      });
  
      // No matching products
      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No matching products found.",
        });
      }
  
      // Return matched products
      res.status(200).json({
        success: true,
        message: "Products fetched successfully.",
        data: products,
      });
  
    } catch (error) {
      console.error("Search error:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  };



  const resendMessageToEmail = async(req,res)=>{
    
        try {
            const { orderId } = req.body;
        
            const order = await Order.findByIdAndUpdate(
              orderId,
              { status: 'confirmed' },
              { new: true }
            ).populate('user');
        
            if (!order) return res.status(404).json({ message: 'Order not found' });
        
            await sendEmail({
              to: order.user.email,
              subject: 'Order Confirmed!',
              html: `
                <h1>Thanks for your order</h1>
                <p>Your order ID is <strong>${order._id}</strong>.</p>
                <p>Total: <strong>$${order.totalAmount}</strong></p>
              `,
            });
        
            res.status(200).json({ message: 'Order confirmed and email sent', order });
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Something went wrong' });
          }
  
  }
  


export { login,getOrders, logout,getreview,getOrder, uploadReview, signin, paypalpayment,Searchproduct, verifyPayment, updateProductRating, removeallcart, getuser, productStore, createCart, removecart, blogspost, getproducts, getblogs, getAllProducts, getProductById, getcategory, getcart, admin ,resendMessageToEmail}