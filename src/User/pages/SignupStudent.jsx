import React, { useState } from 'react';

// Main Component
const StudentSignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    registerNo: '',
    mobileNo: '',
    email: '',
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
    console.log('Student Sign-up Form submitted:', formData);
    // Add your student registration logic here (e.g., API call)
  };

  // The custom indigo-600 color is used for a clean, modern look.
  const primaryColor = 'indigo'; // You can change this to 'purple', 'sky', etc., for a different look

  return (
    // Outer container: Full screen, centered, light gray background
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      
      {/* Main Card Container: Two columns, shadow, rounded corners */}
      <div className="flex w-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden min-h-[600px]">
        
        {/* Left Side: Form Container */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
          
          {/* Logo/Header Area */}
          <header className="mb-6">
            <h1 className="text-xl font-extrabold text-gray-800">Campus Core</h1>
          </header>

          {/* Form Content Area */}
          <div className="flex-grow flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Student Sign Up</h2>
            <p className="text-gray-500 mb-8">Please enter your registration details</p>

            <form onSubmit={handleSubmit}>
              
              {/* Name Input Group */}
              <div className="mb-4">
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500`}
                />
              </div>

              {/* Register No Input Group */}
              <div className="mb-4">
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
                  placeholder="Registration Number"
                  required
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500`}
                />
              </div>

              {/* Mobile No Input Group */}
              <div className="mb-4">
                <label 
                  htmlFor="mobileNo" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mobile no
                </label>
                <input
                  type="tel" // Use type tel for mobile numbers
                  id="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  required
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500`}
                />
              </div>
              
              {/* Email Input Group */}
              <div className="mb-4">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Student Email"
                  required
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500`}
                />
              </div>

              

              {/* Sign Up Button */}
              <button
                type="submit"
                className={`w-full py-3 bg-${primaryColor}-600 text-white font-semibold rounded-lg shadow-md hover:bg-${primaryColor}-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:ring-offset-2`}
              >
                Sign up
              </button>
            </form>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? 
            <a href="/student-signin" className={`font-semibold text-${primaryColor}-600 hover:text-${primaryColor}-500 ml-1`}>
              Sign in
            </a>
          </p>
        </div>

        {/* Right Side: Visual/Illustration Container (Hidden on small screens) */}
        <div className={`hidden lg:flex lg:w-1/2 bg-${primaryColor}-600 items-center justify-center p-12`}>
          <div className="text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Welcome, Future Leader!</h3>
            <p className="text-indigo-200">
              The registration process is quick and secure.
            </p>
            <div className="mt-8 text-6xl">
                🎓
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentSignUpPage;