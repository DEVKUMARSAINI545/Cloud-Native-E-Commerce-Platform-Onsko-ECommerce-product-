import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import e from 'cors';
import Swal from 'sweetalert2';
import axiosInstance from '../../axios';


export default function Login() {
    const [email, setemail] = useState()
    const [password, setpassword] = useState()
    const [loading,setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const navigate = useNavigate()
    
    const userLogin = async (e) => {
     
      e.preventDefault();
  
      if (  !email || !password ) {
          return Swal.fire({
              icon: 'warning',
              title: 'Missing Fields',
              text: 'Please fill out all fields, including uploading a profile image!',
          });
      }
  
      if (!loading) {
          Swal.fire({
              title: 'It takes a few seconds...',
              imageUrl: '/loadingIcons.gif',
              timer: 2000,
              showConfirmButton: false,
          });
      }
  
      try {
 
          const response = await axiosInstance.post('/login',{email,password})
          // Check backend status codes from the JSON response
        
          const { status, data } = response;
          
    
        
          if (data.success) {
              setLoading(true);
           
              Swal.fire({
                  icon: 'success',
                  title: 'Account Created!',
                  text: data.message || 'You have successfully signed up. Redirecting to login...',
                  timer: 2000,
                  showConfirmButton: false,
              });
              localStorage.setItem("UserData",JSON.stringify({id:data?.userexist?._id,email:data?.userexist?.email,name:data?.userexist?.fullname,profileImage:data?.userexist?.profileImage}))
              navigate('/');
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Failed',
                  text: data.message || 'Something went wrong. Please try again.',
              });
          }
  
      } catch (error) {
          console.error('Sign-in error:', error);
  
          if (error.response) {
              const { status, data } = error.response;
  
              Swal.fire({
                  icon: status >= 400 && status < 500 ? 'warning' : 'error',
                  title: `Error ${status}`,
                  text: data?.message || 'Something went wrong. Please try again later.',
              });
  
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Network Error',
                  text: 'Please check your internet connection and try again.',
              });
          }
      }
     
    };
    const validateForm = () => {
        const emailIsValid = /\S+@\S+\.\S+/.test(email);

        if (!email && !password) {
            setErrorMessage("Email and password are required");
            setEmailError(true);
            setPasswordError(true);
            clearError();
            return;
        }
        if (!email) {
            setErrorMessage("Email can't be empty");
            setEmailError(true);
            clearError();
            return;
        }
        if (!password) {
            setErrorMessage("Password can't be empty");
            setPasswordError(true);
            clearError();
            return;
        }
        if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters");
            setPasswordError(true);
            clearError();
            return;
        }
        if (!emailIsValid) {
            setErrorMessage("Invalid email format");
            setEmailError(true);
            clearError();
            return;
        }
        
        // If everything is valid
        setErrorMessage("");
        setEmailError(false);
        setPasswordError(false);
    };

    const clearError = () => {
        setTimeout(() => {
            setErrorMessage('');
            setEmailError(false);
            setPasswordError(false);
        }, 2000);
    };









    return (
        <> 
 <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign In Dev Kumar Saini</h1>
            <div className="w-full flex-1 mt-8">
             
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign up with e-mail
                </div>
              </div>
              <div className="mx-auto max-w-xs">
                <input  onChange={(e)=>setemail(e.target.value)}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" 
                  type="email" 
                  placeholder="Email" 
                />
                <input  onChange={(e)=>setpassword(e.target.value)}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5" 
                  type="password" 
                  placeholder="Password" 
                />
                <button onClick={userLogin} className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:shadow-outline">
                  <span className="ml-3">Sign Up</span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                You dont have an account ? <span className=' cursor-pointer underline font-semibold' onClick={()=>navigate("/sign")}>please sign Up</span> 
       
                </p>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  <span className=' cursor-pointer underline font-semibold' onClick={()=>navigate("/sign")}>
                    Forgot Password
                  </span>
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
