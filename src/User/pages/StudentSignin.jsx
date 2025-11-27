import React, { useState } from 'react';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    registerNo: '',
    password: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Student Sign-in Form submitted:', formData);
    // Add your sign-in logic here (e.g., API call, authentication)
  };

  const primaryColor = 'indigo'; 

  return (
    // Outer container: Full screen, centered, light gray background
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      
      {/* Main Card Container: Two columns, shadow, rounded corners */}
      <div className="flex w-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden min-h-[600px]">
        
        {/* Left Side: Form Container */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
          
          {/* Logo/Header Area */}
          <header className="mb-6">
            <h1 
              className="text-3xl font-bebas tracking-wider text-gray-800"
            >
              Campus Core
            </h1>
          </header>

          {/* Form Content Area */}
          <div className="flex-grow flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500 mb-8">Welcome back! Please enter your credentials.</p>

            <form onSubmit={handleSubmit}>
              
              {/* Register No Input Group */}
              <div className="mb-6">
                <label 
                  htmlFor="registerNo" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Register no
                </label>
                <input
                  type="text"
                  id="registerNo"
                  value={formData.registerNo}
                  onChange={handleChange}
                  placeholder="Your Registration Number"
                  required
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500`}
                />
              </div>

             

              {/* Sign In Button */}
              <button
                type="submit"
                className={`w-full py-3 bg-${primaryColor}-600 text-white font-semibold rounded-lg shadow-md hover:bg-${primaryColor}-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:ring-offset-2`}
              >
                Sign in
              </button>
            </form>
          </div>

          {/* Registration Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Not a user? 
            <a href="/student-signup" className={`font-semibold text-${primaryColor}-600 hover:text-${primaryColor}-500 ml-1`}>
              Register
            </a>
          </p>
        </div>

        {/* Right Side: Visual/Illustration Container (Hidden on small screens) */}
        <div className={`hidden lg:flex lg:w-1/2 bg-${primaryColor}-600 items-center justify-center p-12`}>
          <div className="text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Access Your Student Dashboard!</h3>
            <p className="text-indigo-200">
              Enter your details to continue your learning journey.
            </p>
            <div className="mt-8 text-6xl">
                📚
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignInPage;