import axios from "axios";
import React, { useEffect, useState } from "react";

function HomePage() {
  const [user, setUser] = useState("");
  let jwttoken = localStorage.getItem("jwt-token");

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

  return (
    <div>
      Home Page <br />
      <b className="text-6xl">hi {user ? user : "Guest"}</b>
      <br />
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        quam quo excepturi quaerat animi? Voluptatibus, quasi? Non tenetur eius
        iste necessitatibus omnis qui consequuntur reprehenderit quo similique
        neque adipisci dolores, saepe nam soluta laborum animi perferendis
        aspernatur ipsum quidem reiciendis id voluptate? Repudiandae id
        molestiae neque sint ipsa minus tenetur eius magnam quae nulla eligendi
        laborum eos, dolor, inventore, voluptatibus non molestias nisi rerum
        porro.
      </p>
    </div>
  );
}

export default HomePage;
