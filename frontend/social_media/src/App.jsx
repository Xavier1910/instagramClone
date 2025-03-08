import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login"; 
import "./App.css";
import AddPost from "./Components/AddPost";
import Profile from "./Components/Profile";
import SearchPage from "./Components/SearchPage";
import Posts from "./Components/Posts";

const App = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  return (
    <Router>
      <div>
        {isLoggedIn && <Sidebar />}
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login /> } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<AddPost />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
