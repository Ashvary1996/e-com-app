import axios from "axios";
import React, { useEffect, useState } from "react";

function HomePage() {
  const [user, setUser] = useState("");
  const [data, setData] = useState([]);
  let jwttoken = localStorage.getItem("jwt-token");
  console.log(data);
  useEffect(() => {
    axios
      .get("/user/home", {
        headers: {
          token: `Bearer ${jwttoken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log(response.data.headers);
        setUser(response.data.currentUser[0].firstName);
      })
      .catch((err) => console.log(err));
  }, []);

  let search = () => {
    axios
      .get("https://dummyjson.com/products")
      .then((response) => setData(response.data.products))
      .catch((err) => console.log(err));

    console.log("clicked");
  };

  return (
    <>
      <nav className="homeNav flex bg-teal-500  justify-between p-2">
        <div>
          <img src="/ " alt="logo" />
        </div>
        <div className="w-[40%] flex m-auto align-middle justify-center ">
          <input
            className="w-[80%]"
            type="text"
            placeholder="Search for Products"
            autoComplete="on"
          />

          <button onClick={search} className="w-[20%]">
            Search
          </button>
        </div>
        <div className="w-[20%] ">
          <div className="flex justify-around mt-1 m-auto">
            <select name="" className="p-3" id="">
              <option value="">{user ? user : "Guest"}</option>
              <option value="">Log out</option>
            </select>
            <p className="p-3 bg-white"> Cart</p>
          </div>
        </div>
      </nav>

      <main className="productsDisplay  border-2 border-red-700">
        <div className=" border-2 border-green-700   flex flex-wrap gap-5 mt-5 p-1 ">
          {data.map((elem, i) => (
            <div className="sProduct relative border-2 border-red-700 h-[400px] w-[300px] p-1 m-auto">
              <img
                className="w-[100%] h-[30vh] m-auto"
                src={elem.thumbnail}
                alt="img"
              />
              <div className="mt-2 ">
                <h1>{elem.title}</h1>
                <h1>{elem.brand}</h1>
                <p>₹ {Math.ceil(elem.price * 83.01)}</p>
                <p className="pdesc">{elem.description}</p>
                <p>{elem.rating}</p>
                <button className=" absolute bottom-0 right-0">
                  Add to Cart
                </button>
              </div>
              <div></div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default HomePage;
