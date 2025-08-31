import React from 'react'
import axiosInstance from '../../axios'
import { useState } from 'react'
import { useEffect } from 'react'

export default function OrderHistory() {
const [products,getproducts]=useState([])
    const getOrderHistory = async()=>{
        try {
            const response = await axiosInstance.get("/getOrders")
             console.log(response.data.order);
             
            // getproducts(response.data?.order)
            
        } catch (error) {
            
        }
    }


    useEffect(()=>{
        getOrderHistory()
    },[])
  
    
  return (
    <>
        <div className="order-summary p-4">
  <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

  {/* User Info */}
  <div className="mb-6">
    {/* <p className="text-lg "><strong>Username:</strong> {userDetail?.fullname}</p> */}
    {/* <p className="text-lg"><strong>Email:</strong> {userDetail?.email}</p> */}
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
          <p>Price: ₹{item?.products.price}</p>
        </div>
      </li>
          </>
    ))}
  </ul>
</div>

    </>
  )
}
