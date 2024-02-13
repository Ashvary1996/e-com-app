import React from "react";

function Forgotpass() {
  return (
    <>
      <div className="border-2 border-red-600 w-auto m-auto">
        <h1>Forgot password </h1>
        <p>Please enter your email to reset password</p>
        <input
          type="email"
          placeholder="email address"
          className=" text-center p-2 text-lg inline border "
        />
        <br />
        <button className="w-[20%] p-2 mt-3 ">send email</button>

        {/* <p>
          we have sended you an email of 4 digit please verify here to reset
          password
        </p> */}
      </div>
    </>
  );
}

export default Forgotpass;
