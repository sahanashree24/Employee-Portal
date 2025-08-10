import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center p-8 bg-gradient-to-r from-blue-100 to-blue-200">
      <h1
        className="text-5xl font-extrabold mb-4 text-blue-900 drop-shadow-md opacity-0 animate-fadeIn"
        style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
      >
        Welcome to Tech Drushti
      </h1>

      <p
        className="text-lg text-blue-800 max-w-xl mb-8 opacity-0 animate-fadeIn"
        style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
      >
        Your one-stop portal to manage employees and track performance with ease.
      </p>

      <img
        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
        alt="Modern workspace"
        className="w-full max-w-xl rounded-lg shadow-xl mb-10 cursor-pointer transform hover:scale-105 transition-transform duration-300 opacity-0 animate-fadeIn"
        style={{ animationDelay: "1s", animationFillMode: "forwards" }}
        onClick={() => navigate("/dashboard")}
      />

      <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition shadow-md font-semibold text-lg opacity-0 animate-fadeIn"
        style={{ animationDelay: "1.4s", animationFillMode: "forwards" }}
        aria-label="View Employees"
      >
        View Employees
      </button>

      <style>
        {`
          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: none;
            }
          }
          .animate-fadeIn {
            opacity: 0;
            animation-name: fadeIn;
            animation-duration: 0.8s;
            animation-timing-function: ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default Home;

