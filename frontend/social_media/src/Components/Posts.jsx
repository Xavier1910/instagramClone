import { useState } from "react";
import UserPosts from "./UserPost"
import Loader from "./Loader";

const Posts = () => {
  const [loader, setLoader] = useState(true);
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  return (
    <>
      {(loader && <Loader />) || (
    <div className="UserPostMainContainer">
      <UserPosts/>
    </div>
      )}
      </>
  )
}

export default Posts
