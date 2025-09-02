import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import UsersPage from "./pages/users/UserPage";
import SongsPage from "./pages/songs/SongsPage";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.auth.user);
  // console.log("user===>", user);

  return (
    <>
      <Routes>
        {/* <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} /> */}
        {/* Public routes */}
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/signup" element={user ? <Home /> : <Signup />} />
        <Route path="/home" element={user ? <Home /> : <Login />} />
        <Route path="/users" element={user ? <UsersPage /> : <Login />} />
        <Route path="/songs" element={user ? <SongsPage /> : <Login />} />
      </Routes>
    </>
  );
}

export default App;
