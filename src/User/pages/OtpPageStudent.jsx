import React, { useState, useEffect, useRef } from 'react';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '']); // State for individual OTP digits
  const [remainingTime, setRemainingTime] = useState(60); // 60 seconds countdown
  const [resendEnabled, setResendEnabled] = useState(false);
  const inputRefs = useRef([]); // Ref for OTP input fields for focus management

  const primaryColor = 'indigo';

  // Countdown timer logic
  useEffect(() => {
    if (remainingTime <= 0) {
      setResendEnabled(true);
      return;
    }

    const timer = setTimeout(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup on component unmount or time change
  }, [remainingTime]);

  // Handle OTP input changes
  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Allow only single digit numbers
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus to next input
      if (value !== '' && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle Backspace for OTP inputs
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = () => {
    console.log('Resending OTP...');
    setRemainingTime(60); // Reset timer
    setResendEnabled(false);
    setOtp(['', '', '', '']); // Clear OTP fields
    inputRefs.current[0].focus(); // Focus first input
    // Implement your actual resend OTP logic here (e.g., API call)
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length === 4) {
      console.log('Verifying OTP:', fullOtp);
      // Implement your actual OTP verification logic here (e.g., API call)
      alert(`Verifying OTP: ${fullOtp}`);
    } else {
      alert('Please enter a complete 4-digit OTP.');
    }
  };

  const handleCancel = () => {
    console.log('OTP verification cancelled.');
    // Implement your cancellation logic (e.g., navigate back)
    alert('Verification Cancelled.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Outer container for the page */}
      <div className="relative w-full max-w-lg lg:max-w-3xl"> {/* Adjusted max-w for a single column */}
        
        {/* Main Card Container: No more split layout, just the content */}
        <div className="relative z-10 bg-white rounded-xl shadow-xl flex flex-col min-h-[500px] py-12 px-6 sm:px-12">
          
          {/* Main OTP Content Area - now centered */}
          <div className="w-full flex flex-col justify-center items-center text-center">
            
            <div className="max-w-md w-full"> {/* Inner content wrapper */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">OTP verification</h2>
              <p className="text-gray-600 mb-8">
                Please enter the OTP (One-Time Password) sent to your registered email/phone number to complete your verification.
              </p>

              {/* OTP Input Fields */}
              <div className="flex justify-center space-x-4 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500 transition duration-150"
                  />
                ))}
              </div>

              {/* Timer and Resend Link */}
              <div className="flex justify-center items-center text-gray-600 text-sm mb-8 space-x-2">
                <p>Remaining time: <span className="font-semibold">{remainingTime < 10 ? `0${remainingTime}` : remainingTime}s</span></p>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleResendOtp}
                  disabled={!resendEnabled}
                  className={`font-semibold ${resendEnabled ? `text-${primaryColor}-600 hover:text-${primaryColor}-500` : 'text-gray-400 cursor-not-allowed'}`}
                >
                  Resend
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleVerify}
                  className={`w-full py-3 bg-${primaryColor}-600 text-white font-semibold rounded-lg shadow-md hover:bg-${primaryColor}-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:ring-offset-2`}
                >
                  Verify
                </button>
                <button
                  onClick={handleCancel}
                  className={`w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:ring-offset-2`}
                >
                  Cancel
                </button>
              </div>

              {/* Info Link */}
              <p className="text-xs text-gray-500 mt-10">
                Wondering how we use this code for verification? 
                <a href="#" className={`font-semibold text-${primaryColor}-600 hover:text-${primaryColor}-500 ml-1`}>
                  Know here
                </a>
              </p>
            </div> {/* End inner content wrapper */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;