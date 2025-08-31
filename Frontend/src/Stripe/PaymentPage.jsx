import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [paymentData, setPaymentData] = useState(null);

    const  getSessionData= async()=>{
 
        if (sessionId) {
            const response = await axios.get(`http://localhost:5000/api/v1/onsko/payment-success?session_id=${sessionId}`)
            console.log(response.data)
            
                
        }
    }

    useEffect(()=>{
        getSessionData()
    },[sessionId])

    return (
        <div>
            <h1>Payment Success!</h1>
            {paymentData ? (
                <div>
                    <p><strong>Payment ID:</strong> {paymentData.paymentIntentId}</p>
                    <p><strong>Amount Paid:</strong> ${paymentData.amount}</p>
                    <p><strong>Payment Status:</strong> {paymentData.paymentStatus}</p>
                </div>
            ) : (
                <p>Loading payment details...</p>
            )}
        </div>
    );
};

export default PaymentPage;
