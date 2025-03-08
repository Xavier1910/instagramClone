import PostCard from "./PostCard"
import "../assets/css/Dashboard.css";
import { useState } from "react";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate=useNavigate();
    const [loader, setLoader] = useState(true)
    setTimeout(() => {
        setLoader(false);
    }, 1500);
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if(!isLoggedIn){
        navigate("/");
        return; 
    }
    return (
        <>
        {loader && <Loader/>||
        <div className="DashboardContainer">
            <PostCard/>
        </div>
        }
        </>
    )
}

export default Dashboard
