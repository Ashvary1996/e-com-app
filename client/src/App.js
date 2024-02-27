import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./components/SignUpPage";
import LogInPage from "./components/LogInPage";
import HomePage from "./components/HomePage";
import Forgotpass from "./components/Forgotpass";
import ResetPass from "./components/ResetPass";
import Cart from "./components/Cart";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/userSlice";
import { useEffect } from "react";

function App() {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   const token = localStorage.getItem("jwt-token");
  //   if (token) {
  //     dispatch(loginSuccess());
  //   }
  // }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUpPage />}>
            SignUp
          </Route>
          <Route path="/login" element={<LogInPage />}>
            LogIn
          </Route>
          <Route path="/home" element={<HomePage />}>
            home
          </Route>
          <Route path="/forgot/:email" element={<Forgotpass />}>
            LogIn
          </Route>
          <Route path="/reset/:token" element={<ResetPass />}>
            LogIn
          </Route>
          <Route path="/cart" element={<Cart />}>
            LogIn
          </Route>
          <Route path="/" element={<HomePage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
