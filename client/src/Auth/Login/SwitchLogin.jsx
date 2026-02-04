import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SwitchLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );

      // Optionally store token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div>
      <div className=" flex flex-col justify-center items-center ">
        <div className="flex flex-col md:flex-row bg-white  rounded-lg overflow-hidden w-full max-w-5xl">
          <div className="w-full  p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
              Login to SnapLink
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className="bg-gray-100 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Phone, Username, or Email"
              />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-100 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="Password"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md w-full font-medium"
              >
                Login
              </button>
            </form>

            {/* OR separator */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-2 text-sm text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            {/* Facebook Login */}
            <div className=" flex justify-center items-center mb-4 gap-2 ">
              <button className="text-blue-700 text-center font-medium flex  gap-2 cursor-pointer items-center">
                <img
                  src="logo/download (1).png"
                  alt="Facebook"
                  className="h-5 items-center"
                />
                Login with Facebook
              </button>
            </div>

            <p className="text-sm text-center text-blue-500 cursor-pointer mb-6">
              Forgot Password?
            </p>

            {/* Signup Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  className="text-blue-600 font-medium"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default SwitchLogin;
