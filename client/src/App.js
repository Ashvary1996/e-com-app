import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./components/SignUpPage";
import LogInPage from "./components/LogInPage";
import HomePage from "./components/HomePage";
import Forgotpass from "./components/Forgotpass";

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
            LogIn
          </Route>
          <Route path="/forgot/:email" element={<Forgotpass />}>
            LogIn
          </Route>
          <Route path="*" element={<SignUpPage />}>
            LogIn
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
