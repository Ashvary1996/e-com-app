import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

function PaymentFailed() {
  const location = useLocation();
//   const errMsg = location.state ? location.state.msg : "";
  console.log(location);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Payment Failed</h1>
      <p className="text-red-500 text-center">
        Your payment was not successful. Please try again later.
      </p>
      <h2 className="text-xl font-bold text-center mb-4">Error Message:</h2>
      <p className="text-red-500 text-center">{"errMsg.error.message"}</p>{" "}
      {/* Render actual error message */}
      <Link to="/home" className="block text-center mt-4 underline">
        Back to Home Page
      </Link>
    </div>
  );
}

export default PaymentFailed;
