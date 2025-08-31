import mongoose from 'mongoose';
import { z } from 'zod'

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    paymentIntentId: { type: String,  },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    paymentStatus: { type: String, required: true },
    products: [
        {
            name: String,
            image: String,
            price: Number,
            quantity: Number,
        },
    ],
    createdAt: { type: Date, default: Date.now },
});
 
const paymentModel = mongoose.model("Payment", paymentSchema);
export { paymentModel };
