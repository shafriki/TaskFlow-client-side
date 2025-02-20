import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";

const Login = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  // Handle Google Signin
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/task");
      alert("Login Successful");  
    } catch (err) {
      alert(err?.message);  
    }
  };

  return (
    <div
      className="relative bg-fixed min-h-screen bg-cover bg-center overflow-auto flex items-center justify-center"
      style={{
        backgroundImage: "url('https://i.ibb.co.com/q33RppLv/pexels-jeshoots-com-147458-714701.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <div
        className="w-full max-w-xl mx-3 md:mx-0 mt-14 p-8 bg-black opacity-20 backdrop-blur-sm rounded-md shadow-lg z-10"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-2">Login to Your Account</h2>
        <p className="text-white text-center text-xs md:text-sm">Welcome back! Please enter your details.</p>

        <div className="flex items-center justify-center px-1 mt-2 pb-3">
          <div className="flex-grow border-t border-gray-400"></div>
          <div className="mx-4 text-gray-500">Or</div>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full px-4 py-2 font-semibold text-white bg-[#0f162f] hover:bg-[#070A16] ease-in-out btn border-none rounded-md"
        >
          {loading ? (
            <div className="loader">Loading...</div>  // You can replace this with a loading spinner like BeatLoader
          ) : (
            <FcGoogle className="text-2xl" /> 
          )}
          Login with Google
        </button>

        <p className="text-sm text-center text-white mt-1"></p>
      </div>
    </div>
  );
};

export default Login;
