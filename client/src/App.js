import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./Pages/SignUpPage";
import LogInPage from "./Pages/LogInPage";
import HomePage from "./Pages/HomePage";
import Forgotpass from "./components/Forgotpass";
import ResetPass from "./components/ResetPass";
import Cart from "./components/Cart";
import BuyPage from "./components/BuyPage";
import ItemDescription from "./components/ItemDescription";

function App() {
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
          <Route path="/forgot/" element={<Forgotpass />}>
            LogIn
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
          <Route path="/paymentGateway" element={<BuyPage />}>
            FinalBuyPage
          </Route>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="*" element={<HomePage />}></Route>
          <Route path="/item/:itemId" element={<ItemDescription />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
