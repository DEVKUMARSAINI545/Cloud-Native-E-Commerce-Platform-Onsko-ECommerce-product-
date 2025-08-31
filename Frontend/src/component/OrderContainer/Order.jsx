import React, { useEffect, useState } from 'react';
import Header from '../Headers/Header.jsx';
import { useLocation, useNavigate } from 'react-router';
import axiosInstance from '../../axios.js';

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [userDetail,setUserDetail] = useState()

  const getOrderProduct=async(receivedProducts)=>{
    try {
      const response = await axiosInstance.post("/getOrder",{orderId:receivedProducts})
     
      setUserDetail({
        "fullname":response.data?.order?.userId?.fullname,
        "email":response.data?.order?.userId?.email
      })
      
      if(response.data?.success == true)
      {
        setProducts(response.data?.order?.products)
      }else{
        setProducts([])
      }
    } catch (error) {
      console.log(error.message)
      
    }
  }

  useEffect(() => {
  const receivedProducts = JSON.parse(localStorage.getItem("orderId"))
    if (!receivedProducts) {
      navigate('/shop'); // Redirect if no products
    } else {
       
        
      getOrderProduct(receivedProducts)
    }
  }, [location, navigate]);

 
    console.log(products);
    

  return (
    <>
    <div className="order-summary p-4">
  <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

  {/* User Info */}
  <div className="mb-6">
    <p className="text-lg "><strong>Username:</strong> {userDetail?.fullname}</p>
    <p className="text-lg"><strong>Email:</strong> {userDetail?.email}</p>
  </div>

  {/* Products */}
  <ul className="space-y-4">
    {products.map((item, index) => (
      <>
      <li key={index} className="border rounded-lg p-4 shadow flex items-center space-x-4">
        <img
          src={item?.product?.image}
          alt={item?.product?.title}
          className="w-16 h-16 object-cover rounded"
          />
        <div>
          <p className="font-bold text-lg">{item?.product?.name}</p>
          <p>Quantity: {item?.quantity}</p>
          <p>Price: ₹{item?.price}</p>
        </div>
      </li>
          </>
    ))}
  </ul>
</div>

    </>
  );
}
