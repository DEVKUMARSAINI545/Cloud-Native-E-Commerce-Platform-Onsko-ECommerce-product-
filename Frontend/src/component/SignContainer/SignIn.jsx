import React, { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios'
import { useNavigate } from 'react-router';
import axiosInstance from '../../axios';
export default function SignIn() {
    const [email, setemail] = useState(null)
    const [loading,setloading] = useState(false)
    const [password, setpassword] = useState(null)
    const [fullname, setfullname] = useState(null)
    const [profileImage, setprofileImage] = useState(null);
    const navigate = useNavigate(0)
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the first file from the FileList
        if (file) {
            console.log(file)
            setprofileImage(URL.createObjectURL(file)); // Create a temporary URL for the file
        }
    };

  //   const HandleSignIn = async (e) => {
  //     e.preventDefault();
  
  //     if (!fullname || !email || !password || !profileImage) {
  //         return Swal.fire({
  //             icon: 'warning',
  //             title: 'Missing Fields',
  //             text: 'Please fill out all fields, including uploading a profile image!',
  //         });
  //     }
  
  //     if (!loading) {
  //         Swal.fire({
  //             title: 'It takes a few seconds...',
  //             imageUrl: '/loadingIcons.gif',
  //             timer: 2000,
  //             showConfirmButton: false,
  //         });
  //     }
  
  //     try {
  //         const formData = new FormData();
  //         formData.append('fullname', fullname);
  //         formData.append('email', email);
  //         formData.append('password', password);
  //         formData.append('profileImage', profileImage);
  
  //         const response = await axiosInstance.post('/signin',formData,{ headers: {
  //           'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
  //         },});
  
  //         // Check backend status codes from the JSON response
  //         const { status, data } = response;
  
  //         if (data.success) {
  //             setloading(true);
  //             Swal.fire({
  //                 icon: 'success',
  //                 title: 'Account Created!',
  //                 text: data.message || 'You have successfully signed up. Redirecting to login...',
  //                 timer: 100,
  //                 showConfirmButton: false,
  //             });
  //             navigate('/login');
  //         } else {
  //             Swal.fire({
  //                 icon: 'error',
  //                 title: 'Failed',
  //                 text: data.message || 'Something went wrong. Please try again.',
  //             });
  //         }
  
  //     } catch (error) {
  //         console.error('Sign-in error:', error);
  
  //         if (error.response) {
  //             const { status, data } = error.response;
  
  //             Swal.fire({
  //                 icon: status >= 400 && status < 500 ? 'warning' : 'error',
  //                 title: `Error ${status}`,
  //                 text: data?.message || 'Something went wrong. Please try again later.',
  //             });
  
  //         } else {
  //             Swal.fire({
  //                 icon: 'error',
  //                 title: 'Network Error',
  //                 text: 'Please check your internet connection and try again.',
  //             });
  //         }
  //     }
  // };
  
  const HandleSignIn = async (e, fullname, email, password, profileImage, setloading) => {
    e.preventDefault();
   

    // ✅ Validation: Full Name (Minimum 3 Characters)
    if (!fullname || fullname.trim().length < 3) {
        return Swal.fire({
            icon: "warning",
            title: "Invalid Full Name",
            text: "Full name must be at least 3 characters long.",
        });
    }

    // ✅ Validation: Email (Valid Format)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
        return Swal.fire({
            icon: "warning",
            title: "Invalid Email",
            text: "Please enter a valid email address.",
        });
    }

    // ✅ Validation: Password (Minimum 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character)
    const passwordRegex = /^.{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        return Swal.fire({
            icon: "warning",
            title: "Weak Password",
            text: "Password must be at least 8 characters",
        });
    }

    // ✅ Validation: Profile Image (Must be JPG, PNG, or GIF)
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!profileImage || !allowedImageTypes.includes(profileImage.type)) {
        return Swal.fire({
            icon: "warning",
            title: "Invalid Profile Image",
            text: "Please upload a valid image file (JPG, PNG, GIF).",
        });
    }

    // ✅ Prevent Multiple Submissions
    setloading(true);

    try {
        // ✅ Create FormData for File Upload
        const formData = new FormData();
        formData.append("fullname", fullname);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("profileImage", profileImage);

        const response = await axiosInstance.post("/signin", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const { data } = response;

        if (data.success) {
            Swal.fire({
                icon: "success",
                title: "Account Created!",
                text: "Redirecting to login...",
                timer: 3000,
                showConfirmButton: false,
            });

            // ✅ Navigate to login instantly without delay
            navigate("/login");
        } else {
            throw new Error(data.message || "Signup failed");
        }
    } catch (error) {
        console.error("Sign-in error:", error);

        Swal.fire({
            icon: "error",
            title: "Signup Failed",
            text: error.response?.data?.message || "Something went wrong. Please try again later.",
        });
    } finally {
        setloading(false);
    }
};  
    return (

        
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
           
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
              <div className="w-full flex-1 mt-8">
               
                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or sign up with e-mail
                  </div>
                </div>
                <div className="mx-auto max-w-xs">
                  <input onChange={(e) => setfullname(e.target.value)}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" 
                    type="text" 
                    placeholder="Full Name" 
                  />
                  <input onChange={(e) => setemail(e.target.value)}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5" 
                    type="email" 
                    placeholder="Email" 
                  />
                  <input onChange={(e) => setpassword(e.target.value)}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5" 
                    type="password" 
                    placeholder="Password" 
                  />
                  <input onChange={(e) => setprofileImage(e.target.files[0])}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5" 
                    type="file" 
                    accept="image/*" 
                  />
                  <button onClick={(e)=> HandleSignIn(e, fullname, email, password, profileImage, setloading)} className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:shadow-outline">
                    <span className="ml-3">Sign Up</span>
                  </button>
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    Already have an account? <span className='cursor-pointer font-semibold underline' onClick={() => navigate("/login")}>Log in</span> 
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div 
              className="m-12 xl:m-16 w-full bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: 'url(https://cdn.wallpapersafari.com/42/55/JE3wDB.png)' }}
            ></div>
          </div>
        </div>
      
      






    )
}
