import React from "react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong.
        </h1>
        <p className="text-gray-700 mb-4">
          An unexpected error occurred. Please check the details below or try
          refreshing the page.
        </p>
        <details className="mb-4">
          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
            Error Details
          </summary>
          <div className="mt-2 p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold">Error Message:</h3>
            <pre className="text-sm text-red-500 whitespace-pre-wrap">
              {error.message}
            </pre>
            <h3 className="font-semibold mt-4">Stack Trace:</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-64">
              {error.stack}
            </pre>
          </div>
        </details>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
