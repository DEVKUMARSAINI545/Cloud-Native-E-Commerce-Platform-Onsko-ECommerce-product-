import React, { useState } from 'react'
import { useNavigate } from 'react-router'

export default function Forgot() {
    const [email,setemail] = useState()
    const navigate = useNavigate()
  return (
  <>
   <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
         
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Forget-Password</h1>
            <div className="w-full flex-1 mt-8">
              
              <div className="mx-auto max-w-xs">
                <input  onChange={(e)=>setemail(e.target.value)}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" 
                  type="email" 
                  placeholder="Email" 
                />
               
                <button  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:shadow-outline">
                  <span className="ml-3">Send OTP</span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                You have an account ? <span className=' cursor-pointer underline font-semibold' onClick={()=>navigate("/login")}>please sign Up</span> 
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div 
            className="m-12 xl:m-16 w-full bg-cover  bg-center bg-no-repeat" 
            style={{ backgroundImage: 'url(https://cdn.wallpapersafari.com/42/55/JE3wDB.png)' }}
          ></div>
        </div>
      </div>
    </div>
  </>
  )
}
