import React from 'react';
import {  useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, formData);
      alert(res.data.message);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };
  return (
    <div>
         <div className="flex items-center gap-2 mb-10 p-5">
        <img className="h-10" src="logo/download.jpg" alt="SnapLink Logo" />
        <h1 className="font-bold text-4xl text-gray-800">SnapLink</h1>
      </div>
    
    <div className=" flex flex-col justify-center items-center ">
      {/* Header */}
     

      {/* Main Content */}
      <div className="flex flex-col md:flex-row bg-white  rounded-lg overflow-hidden w-full max-w-5xl">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
          <img
            src="logo/landing-2x.png"
            alt="SnapLink Landing"
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>

        {/* Right: Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center mb-2 text-gray-700">
            SignUp to SnapLink
          </h2>
<p className="text-sm  text-center mb-6 text-gray-700">Sign up to see photos and videos from your friends.</p>

<div className="  mb-4">
            <button className="bg-blue-700 text-white p-2 w-full items-center justify-center rounded-sm text-center font-medium flex  gap-2">
              <img src="logo/download (1).png" alt="Facebook" className="h-6 rounded-full object-fill" />
              Signup with Facebook
            </button>
          </div>
           {/* OR separator */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>
          <form className="space-y-4 " onSubmit={handleSubmit}>
            <input
              name='email'
              className="bg-gray-100 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              onChange={handleChange}
              value={formData.email}
              placeholder="Phone or Email"
            />
            <input
            name='password'
              className="bg-gray-100 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <input
              name='fullName'
              className="bg-gray-100 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              onChange={handleChange}
              value={formData.fullName}
              placeholder="Full Name    "
            />
            <input
              name='username'
              className="bg-gray-100 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              onChange={handleChange}
              value={formData.username}
              placeholder="Username"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md w-full font-medium"
            >
              Signup
            </button>
          </form>

         

          {/* Facebook Login */}
          

          <p className="text-sm text-center text-blue-500 cursor-pointer mb-6">
            Forgot Password?
          </p>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button className="text-blue-600 font-medium" onClick={()=>
                navigate('/')
              }>Login</button>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignUp;
