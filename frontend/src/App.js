import { ToastContainer } from "react-toastify";
import NavBar from "./components/Navbar/Navbar";
import "./App.scss";
import "react-toastify/dist/ReactToastify.css";
import Home from "./containers/Home/Home";
import Login from "./containers/Login/Login";
import Register from "./containers/Register/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./containers/Profile/Profile";

function App() {
  const isLoggedIn = localStorage.getItem("token") || false;
  return (
    <BrowserRouter>
      <NavBar />
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        {isLoggedIn && <Route path="profile" element={<Profile />} />}
        {!isLoggedIn && <Route path="login" element={<Login />} />}
        {!isLoggedIn && <Route path="register" element={<Register />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
