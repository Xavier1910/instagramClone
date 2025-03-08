import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BsFillHouseFill,
  BsPerson,
  BsPlusCircle,
  BsSearch,
  BsGrid1X2,
} from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { useState, useEffect } from "react";
import "../assets/css/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(
    localStorage.getItem("activeSidebar") || "/dashboard"
  );
  const [Active, setActive] = useState(false)
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const handleSidebarClick = (path) => {
    localStorage.setItem("activeSidebar", path);
    setActiveItem(path);  
    setActive(false)  
  };

  const logout = () => {
    sessionStorage.setItem("isLoggedIn", false);
    sessionStorage.clear("userId");
    window.location.reload();
    navigate("/");
  };
  const Profile=()=>{
    let path="/profile";
    navigate(path);
    setActiveItem(path);  
    setActive(true);  

  }

  const sidebar = [
    { id: 1, title: "Home", path: "/dashboard", icon: <BsFillHouseFill /> },
    { id: 2, title: "Search", path: "/search", icon: <BsSearch /> },
    // { id: 3, title: "Message", path: "/message", icon: <BsChatDots /> },
    { id: 4, title: "Create", path: "/create", icon: <BsPlusCircle /> },
    { id: 5, title: "Posts", path: "/posts", icon: <BsGrid1X2 /> },
  ];

  const sideFoot = [
    {
      id: 1,
      title: "Profile",
      icon: <BsPerson />,
      path: "/profile",
      function: Profile,
    },
    { id: 2, title: "Logout",icon: <MdLogout />, function: logout },
  ];

  return (
    <div className="SidebarContainer">
      <div className="SideHead">
        <img src="/images/Logo1_fav.png" alt="" />
        <h1 className="TitleHead">Show<span>S<span><span className="TitleHead-He">he</span></span></span>
        </h1>
      </div>

      <div className="sidebar">
        {sidebar.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="sidebarItem"
            onClick={() => handleSidebarClick(item.path)}
          >
            <ul>
              <li className={`sidebarIcon  ${
              activeItem === item.path ? "Active" : ""
            }`} >
                <b>{item.icon}</b>
                <span className="sidebarTitle">{item.title}</span>
              </li>
            </ul>
          </Link>
        ))}
      </div>

      <div className="sidebarFooter">
        <div className="sideFootBottom">
          {sideFoot.map((item) => (
            <div key={item.id} className="sideFootItem">
              <div className={`sideFootIcon ${item.title==="Profile"?Active?"Active":"":""}`} onClick={item.function}>
                {item.icon}
                <span className="sideFootTitle">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
