import React, { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import axiosInstance from '../../axios'
import Swal from 'sweetalert2'
export default function Header({ userProfileImage }) {
    const [changeX, setchangeX] = useState(false)
    const navigate = useNavigate()
    const userData = JSON.parse(localStorage.getItem("UserData")) || {}; 
    const { email } = userData;
    const handleCart = () => {
 
        const token = localStorage.getItem("token")
        if (token) {
            navigate("/cart")

        } else {

            navigate("/login")
        }
    }
    const removeAccount = async () => {
        try {
            const response = await axiosInstance.post("/logout");
    
            if (response.status === 200 && response.data?.success) {
                // Clear local storage
                localStorage.removeItem('UserData');
                
                // Show success message
                await Swal.fire({
                    icon: 'success',
                    title: 'Logged Out',
                    text: 'You have been successfully logged out.',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                // Redirect to home
                navigate("/login");
                return;
            }
    
            // Handle API success=false cases
            throw new Error(response.data?.message || "Logout operation failed");
    
        } catch (error) {
            let errorTitle = "Error";
            let errorMessage = "An unexpected error occurred. Please try again.";
            let icon = 'error';
    
            if (error.response) {
                // Server responded with error status
                switch (error.response.status) {
                    case 401:
                        errorTitle = "Session Expired";
                        errorMessage = "Your session has expired. Please login again.";
                        icon = 'warning';
                        break;
                    case 403:
                        errorTitle = "Access Denied";
                        errorMessage = "You don't have permission to perform this action.";
                        break;
                    case 500:
                        errorTitle = "Server Error";
                        errorMessage = "Our servers are experiencing issues. Please try again later.";
                        break;
                    default:
                        errorMessage = error.response.data?.message || 
                                      `Request failed with status code ${error.response.status}`;
                }
            } else if (error.request) {
                // No response received
                errorTitle = "Network Error";
                errorMessage = "Unable to connect to the server. Please check your internet connection.";
            }
    
            console.error("Logout error:", error);
    
            // Show error alert
            await Swal.fire({
                icon,
                title: errorTitle,
                text: errorMessage,
                confirmButtonColor: '#3085d6',
            });
    
            // Force logout if authentication error
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiration');
                navigate("/login");
            }
        }
    };
 
    return (
        <nav className="relative cursor-pointer lg:hidden w-[90%]   mx-auto h-10 flex items-center justify-between px-3 rounded-3xl bg-white  lg:mt-8">
            <div onClick={()=>navigate("/")} className="flex items-center w-40 h-full pr-4  ">
                <img className="w-6" src="https://cdn-icons-png.flaticon.com/128/346/346167.png" alt="Logo" />
                <h1 className="text-2xl ml-2 mb-1 text-green-700 font-semibold">onsko</h1>
            </div>

            <div onClick={() => setchangeX(prev => !prev)} className="w-10 ml-[32%]   h-full flex items-center justify-center md:hidden">
                <img className="w-6" src="https://cdn-icons-png.flaticon.com/128/5358/5358649.png" alt="Menu Toggle" />
            </div>
            {/* Mobile Menu */}
            <div className={`absolute   top-0  left-0 w-full h-[20rem] bg-white rounded-l-lg ${changeX ? 'block' : 'hidden'} md:hidden`}>
                <div className="flex items-center justify-between w-full h-10 px-3">
                    <div onClick={()=>navigate("/")} className="flex items-center w-40 h-full pr-14">
                        <img className="w-6" src="https://cdn-icons-png.flaticon.com/128/346/346167.png" alt="Logo" />
                        <h1 className="text-2xl text-green-700 font-semibold">onsko</h1>
                    </div>
                    <div onClick={() => setchangeX(prev => !prev)} className="w-10 h-full flex items-center justify-center">
                        <img className="w-5" src="../close.png" alt="Close Menu" />
                    </div>
                </div>
                <div className="w-full h-[85%] p-5 ">
                    <ul className="text-green-700 space-y-4 text-justify cursor-pointer tracking-tighter">
                        <li>Home</li>
                        <li><Link to="/shop">Shop</Link></li>
                        <li>About</li>
                        <li onClick={() => handleCart()}>Wishlist </li>
                        <li><Link to="/blog">Blog</Link></li>
                       {!email ?<li><Link to="/login">Log</Link></li>:<li onClick={removeAccount}>Logout</li>}
                    </ul>
                </div>
            </div>

            {/* Tablet and Desktop Menu */}
            <div className="hidden md:flex md:w-full md:h-full md:items-center md:pl-14">
                <ul className="flex gap-8 text-green-700">
                    <li>Home</li>
                    <li><Link to="/shop">Shop</Link></li>
                    <li>About</li>
                    <li onClick={() => handleCart()}>Wishlist </li>
                    <li><Link to="/blog">Blog</Link></li>
                </ul>
            </div>
            {!userProfileImage ?
                <div className="hidden md:flex md:w-20 md:h-full md:items-center md:justify-end md:pr-2 ">
                    <Link to="/login"><img className="w-6 h-6" src="https://cdn-icons-png.flaticon.com/128/3870/3870822.png" alt="Profile Icon" /></Link>
                </div> :
                <img onClick={() => navigate("/profile", { state: { userProfileImage: userProfileImage } })} className="w-6 object-cover 2xl:w-10 2xl:h-10 2xl:object-cover h-6 rounded-full" src={userProfileImage} alt="Profile Icon" />

            }
       
        </nav>
    )
}
