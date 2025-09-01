import express from 'express';
import dbconnection from './db/index.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cookieparser from 'cookie-parser';
import userRouter from './routers/onsko.routers.js';

const app = express();

// Ensure dotenv is configured correctly
dotenv.config();

// Database connection
dbconnection();

// Resolve __dirname in ES modules
const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieparser());

// const corsOptions = {
//   origin: [
//     "http://localhost:5173", // ✅ For local development
//     "https://onsko-e-commerce-project.vercel.app" // ✅ Your Vercel frontend
//   ],
//   credentials: true, // ✅ Allow cookies and authentication headers
// };

// app.use(cors(corsOptions));


// const allowedOrigins = ["https://onsko-e-commerce-project.vercel.app"];
const allowedOrigins = process.env.FRONTEND_URI;

// Enable CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and authentication headers
}));

// Middleware to handle preflight requests
app.options("*", cors());

 

// API routes
app.use("/api/v1/onsko", userRouter);

// Uncomment this if you want to serve index.html for all other routes
 
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT , () => {
  console.log(`Server running on port ${PORT}`);
});
