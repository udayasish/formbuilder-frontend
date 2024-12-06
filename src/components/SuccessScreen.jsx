import React from "react";

function SuccessScreen({ title, message, onClose }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-600">{title}</h1>
        <p className="text-gray-700 mt-4">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default SuccessScreen;
