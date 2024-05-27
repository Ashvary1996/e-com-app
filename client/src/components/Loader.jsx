import React from "react";

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="loader"></div>
      <div className="mt-4 text-center">
        <p className="text-gray-700">Server Starting</p>
        <p className="text-gray-700">
          Please refresh the page after 30 seconds
        </p>
      </div>
    </div>
  );
}

export default Loader;
