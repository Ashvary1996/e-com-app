import React from "react";

function Loader() {
  return (
    <div className=" flex flex-col items-center justify-center ">
      <div className="loader"></div>
      <div className="mt-4 text-center">
        <p className="text-gray-700">Backend-Server Starting</p>
        <p className="text-gray-700">Relaod Page After need 30 seconds</p>
      </div>
    </div>
  );
}

export default Loader;
