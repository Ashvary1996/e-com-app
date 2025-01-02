import React from "react";
// import React, { useEffect, useState } from "react";

function Loader() {
  // const [time, setTime] = useState(60);

  // useEffect(() => {
  //   if (time > 0) {
  //     const timerId = setInterval(() => {
  //       setTime((prevTime) => prevTime - 1);
  //     }, 1000);

  //     return () => clearInterval(timerId);
  //   }
  // }, [time]);

  return (
    <div className="flex flex-col items-center justify-center    mt-11">
      <div className="loader mt-11"></div>
      <div className="mt-11 text-center">
        {/* <p className="text-gray-700 text-lg font-semibold">
          Server Starting in {time} seconds.
        </p>
        {time === 0 ? (
          <p
            className="text-gray-700 mt-2 cursor-pointer"
            onClick={() => {
              window.location.reload();
            }}
          >
            Click here to
            <span className="font-bold text-red-600"> reload the page</span>.
          </p>
        ) : (
          <p className="text-gray-700 mt-2 pb-2">
            It takes a minute for initial start.
          </p>
        )} */}
      </div>
    </div>
  );
}

export default Loader;
