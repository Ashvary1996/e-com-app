import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import SignUpPage from "./Pages/SignUpPage";
import LogInPage from "./Pages/LogInPage";
import HomePage from "./Pages/HomePage";
import Forgotpass from "./components/Forgotpass";
import ResetPass from "./components/ResetPass";
import Cart from "./components/Cart";
import ItemDescription from "./components/ItemDescription";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from "./components/Breadcrumb";
import CheckOutSteps from "./components/CheckOutSteps";
import { ChakraProvider } from "@chakra-ui/react";
import ShippingDetails from "./components/ShippingDetails";
import ContactInfo from "./components/ContactInfo";
import ConfirmDetails from "./components/ConfirmDetails";
import PaymentSuccess from "./components/PaymentSuccess";

function App() {
  function BreadcrumbControlled() {
    const location = useLocation();

    const pathsToHideBreadcrumb = ["/login", "/signup", "/home", "/"];
    const shouldHideBreadcrumb = pathsToHideBreadcrumb.includes(
      location.pathname
    );
    return shouldHideBreadcrumb ? null : <Breadcrumb />;
  }

  return (
    <div className="App">
      <ChakraProvider>
        <ToastContainer closeOnClick id="myContainer" />

        <Router>
          <BreadcrumbControlled />
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
            <Route path="/cart/check_out" element={<CheckOutSteps />}>
              CheckOutSteps
            </Route>
            <Route path="/shippingDetails" element={<ShippingDetails />}>
              ShippingDetails
            </Route>
            <Route path="/contactInfo" element={<ContactInfo/>}>
            contactInfo
            </Route>
            <Route path="/confirmDetails" element={<ConfirmDetails/>}>
            ConfirmDetails
            </Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="*" element={<HomePage />}></Route>
            <Route path="/item/:itemId" element={<ItemDescription />} />
            <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </div>
  );
}

export default App;
