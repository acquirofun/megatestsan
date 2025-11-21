import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCheckmarkCircle, IoWarningOutline } from "react-icons/io5";
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { useAuth } from "../../context/AuthContext";
import Spinner from "../Spinner";
import { images, texts } from "../../constants";

const LoginComp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('')
  // eslint-disable-next-line
  const { login, error, setError } = useAuth();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      const from = location.state?.from?.pathname || '/dashBoardAdx/stats';
      navigate(from);
      setSuccessMessage("Login successful! Redirecting to dashboard...");
      setLoading(false);
    } else {
      setLoading(false)
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
    {successMessage ? 
        (
            <Spinner/>
        ) : (
          <div className="form-wrapper flex flex-col items-start">
          <div className="w-full text-center pb-4 flex flex-col items-center justify-center">
            <img src={images.logo} alt="ddfd" className="w-[100px]"/>
            <h1 className="text-[24px] sm:text-[28px] font-medium pb-1">
             {texts.projectName} <br/>Admin Dashboard
            </h1>
              <p className="text-[#b0b0b0] text-[14px] sm:text-[13px] font-light">
                Enter your email and password to login
              </p>
            </div>
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-3 sm:space-y-4">

            <div className="pb-5 flex flex-col items-start w-full sm:w-[48%]">
        <input
          className="bg-[#2e3e50] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[12px] flex items-center px-6"
          placeholder="Your Email"
          value={email}
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          />
             </div>

            <div className="pb-5 flex flex-col items-start justify-center w-full sm:w-[48%] relative">
        <input
          className="bg-[#2e3e50] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[12px] flex items-center px-6"
          placeholder="Password"
          value={password}
          type={showPassword ? "text" : "password"}
          required
          onChange={(e) => setPassword(e.target.value)}
          />
                      <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 text-[#a1a1a1]"
            >
              {showPassword ? (
                <PiEyeClosedBold size={20} />
              ) : (
                <PiEyeBold size={20} />
              )}
            </button>
             </div>

              <div className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center space-y-6 sm:space-y-4 w-full sm:w-[47%]">
                  <button
                    className="bg-[#ffffff] uppercase hover:bg-[#c2fa7c] w-full ease-in duration-300 text-[#000] text-[15px] justify-center text-center font-medium h-[50px] border-none outline-none rounded-[12px] flex items-center px-6"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        Logging in
                        <AiOutlineLoading3Quarters
                          size={18}
                          className="animate-spin ml-[12px]"
                        />
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </div>
            </form>
      

          </div>

        )
    }
                {error && (
              <div className="z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4 top-6">
                <div className="w-full text-[#ff4d4d] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">
                  <IoWarningOutline size={16} />
                  <span className="text-[15px]">{typeof error === 'string' ? error : 'An error occurred'}</span>
                </div>
              </div>
            )}
      
            {successMessage && (
              <div className="z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4 top-6">
                <div className="w-full text-[#4dff4d] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">
                  <IoCheckmarkCircle size={16} />
                  <span className="text-[15px]">{successMessage}</span>
                </div>
              </div>
            )}
</>
  );
};

export default LoginComp;
