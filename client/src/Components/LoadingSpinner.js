// components/StatusComponents.js
import React from 'react';

export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-6">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
    <p className="text-lg text-gray-600">Loading...</p>
  </div>
);

// eslint-disable-next-line
export const ErrorDisplay = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-6 mt-24 rounded-lg">
    <div className="text-red-500 text-center mb-4">
      <svg 
        className="w-12 h-12 mx-auto mb-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p className="text-[15px] font-medium">Ops! There was an error from your network or browser end!
         <br/>
      Kindly close this mini app and open it again</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-btn text-white rounded hover:bg-yellow-600 
                 transition-colors duration-200"
      >
        Refresh
      </button>
    )}
  </div>
);