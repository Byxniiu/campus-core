import React from "react";

export default function StudentLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="backdrop-blur-md bg-white/30 shadow-xl rounded-2xl p-8 w-full max-w-sm border border-white/40">
        <h2 className="text-2xl font-semibold mb-6 text-center">Student Login</h2>

        <form className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student ID</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg border outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded-lg border outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:underline">Forgot password?</button>
        </div>
      </div>
    </div>
  );
}


