import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import UsersPage from "./pages/users/UserPage";
import SongsPage from "./pages/songs/SongsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/songs" element={<SongsPage />} />
      </Routes>
    </>
  );
}

export default App;
