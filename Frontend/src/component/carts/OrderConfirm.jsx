import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // For navigation and location
import axiosInstance from '../../axios'; // Make sure this is your axios instance

const OrderConfirm = () => {
  const [orderCreated, setOrderCreated] = useState(false); // State to track order creation
  const [productsId, setProductId] = useState(); // State to store products
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook for accessing URL search params

  const confirmOrder = async (sessionId) => {
    try {
      const response = await axiosInstance.post(`/payment-success?session_id=${sessionId}`);
      if(response.data.success==true)
        {
          setProductId(response.data?.order)
          setOrderCreated(true)
          }   
        
    } catch (error) {
      console.log("Error fetching payment details:", error.message);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      confirmOrder(sessionId); // Fetch order details using the sessionId
    }
  }, [location]); // Dependency on location to rerun when URL changes

  useEffect(() => {
    if (orderCreated) {
      // Redirect to another route once order is created
      
  
      localStorage.setItem("orderId",JSON.stringify(productsId))
      setTimeout(()=>{
        
        navigate('/order'); // Replace with your actual route
      },1000)
    }
  }, [orderCreated, navigate]);

  return (
    <div className="mt-4 text-center">
      {!orderCreated ? (
        <p>Your order is being processed...</p>
      ) : (
        <div>
          <p>Order successfully created! Redirecting...</p>
           
        </div>
      )}
    </div>
  );
};

export default OrderConfirm;
