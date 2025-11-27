import React, { useState } from 'react';

const EmergencyAssistPage = () => {
    const primaryColor = 'orange'; // Using orange to signify urgency/assistance
    
    // State to hold form data
    const [request, setRequest] = useState({
        assistanceType: '',
        location: '',
        details: '',
        isNewComer: false,
    });
    
    // State for submission feedback
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const assistanceOptions = [
        "Lost and Found",
        "Campus Navigation (Newcomer)",
        "Facility Malfunction (e.g., lift, water)",
        "First Aid / Minor Injury",
        "General Inquiry"
    ];

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setRequest(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API submission delay
        setTimeout(() => {
            console.log('Emergency Assist Request Submitted:', request);
            setIsLoading(false);
            setIsSubmitted(true);
            // In a real app, you would send this to the Node.js backend
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8">
                <div className={`bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg w-full border-t-8 border-${primaryColor}-500`}>
                    <div className={`text-6xl text-${primaryColor}-500 mb-6`}>✅</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Request Sent Successfully!</h2>
                    <p className="text-gray-600 mb-6">
                        An alert has been sent to the nearest **non-teaching staff** with your details and location. Please remain where you are.
                    </p>
                    <p className="text-sm text-gray-500">
                        They will respond to the request promptly.
                    </p>
                    <button 
                        onClick={() => setIsSubmitted(false)}
                        className={`mt-8 py-3 px-6 bg-${primaryColor}-600 text-white font-semibold rounded-lg hover:bg-${primaryColor}-700 transition`}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8">
            <div className={`bg-white p-8 sm:p-12 rounded-xl shadow-xl max-w-2xl w-full`}>
                <header className="mb-8">
                    <h1 className="text-3xl font-bebas tracking-wider text-gray-900">
                        Emergency Assist
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Need immediate, non-academic help? Quickly request assistance from non-teaching staff.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Assistance Type Selector */}
                    <div>
                        <label htmlFor="assistanceType" className="block text-sm font-medium text-gray-700 mb-2">
                            Type of Assistance Required 🚨
                        </label>
                        <select
                            id="assistanceType"
                            value={request.assistanceType}
                            onChange={handleChange}
                            required
                            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500 transition`}
                        >
                            <option value="" disabled>Select a category...</option>
                            {assistanceOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location Input */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Current Location (Room/Landmark) 📍
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={request.location}
                            onChange={handleChange}
                            placeholder="e.g., Block B, Near Library Entrance, Lab 102"
                            required
                            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500`}
                        />
                    </div>

                    {/* Detailed Description */}
                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                            Further Details (Optional)
                        </label>
                        <textarea
                            id="details"
                            value={request.details}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Provide any additional context for the staff."
                            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500`}
                        ></textarea>
                    </div>

                    {/* Newcomer Checkbox (for tailored assistance) */}
                    <div className="flex items-center pt-2">
                        <input
                            id="isNewComer"
                            type="checkbox"
                            checked={request.isNewComer}
                            onChange={handleChange}
                            className={`h-4 w-4 text-${primaryColor}-600 border-gray-300 rounded focus:ring-${primaryColor}-500`}
                        />
                        <label htmlFor="isNewComer" className="ml-2 block text-sm text-gray-900">
                            I am a newcomer and require campus guidance.
                        </label>
                    </div>

                    {/* Disclaimer and Submit Button */}
                    <p className="text-xs text-gray-500 pt-4">
                        By clicking 'Request Assistance', your Register No. and location will be shared immediately with the relevant non-teaching staff.
                    </p>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 bg-${primaryColor}-600 text-white font-semibold rounded-lg shadow-md hover:bg-${primaryColor}-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:ring-offset-2 disabled:opacity-50 flex justify-center items-center space-x-2`}
                    >
                        {isLoading && (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        <span>{isLoading ? 'Sending Request...' : 'Request Assistance'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmergencyAssistPage;