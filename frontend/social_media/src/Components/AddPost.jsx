import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/AddPost.css";
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { addPost, getTotalPostsForUser, updateUser } from "./AxiosService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

const AddPost = () => {
  const navigate=useNavigate();
  const [user, setUser] = useState({
    username: "",
    userImage: "",
    bio: "",
    posts: 0,
    followers: 0,
    following: 0,
  });
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/SocialShe/api/users/${userId}`
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const userId = sessionStorage.getItem("userId");
  const [postData, setPostData] = useState({
    userId: userId,
    username:"",
    description: "",
    mediaUrls: [],
    likes: 0,
    comments: 0,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };
  useEffect(() => {
    if (userId) {
        fetchUser();
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [userId]);

useEffect(() => {
    setPostData((prevState) => ({
        ...prevState,
        username: user.username || "", 
    }));
}, [user]);  

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPostData({
      ...postData,
      mediaUrls: [...postData.mediaUrls, ...files],
    });
  };

  

  const handleRemoveFile = (index) => {
    setPostData({
      ...postData,
      mediaUrls: postData.mediaUrls.filter((_, i) => i !== index),
    });
    if (currentIndex >= postData.mediaUrls.length - 1) {
      setCurrentIndex(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    formData.append("userId", postData.userId);
    formData.append("username", postData.username);
    formData.append("description", postData.description);
    formData.append("likes", postData.likes);
    formData.append("comments", postData.comments);
    for (let value of postData.mediaUrls) {
      formData.append("mediaUrls", value);
    }
  
    try {
      const response = await addPost(formData);
      if (response) {
        
        const updatedPostCount = await getTotalPostsForUser(postData.userId);

      if (updatedPostCount !== undefined) {
        await updateUser(postData.userId, { posts: updatedPostCount });
      }
  
        setPostData({
          userId: userId,
          username: "",
          description: "",
          mediaUrls: [],
          likes: 0,
          comments: 0,
        });
        toast.success("Post added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/dashboard");
          window.location.reload();
        }, 2500);
      }
    } catch (error) {
      console.error("Error adding post", error);
    }
  };
  


  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % postData.mediaUrls.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + postData.mediaUrls.length) % postData.mediaUrls.length);
  };

  const [loader, setLoader] = useState(true);
  setTimeout(() => {
    setLoader(false);
  }, 1500);
  
  return (
    <>
      {(loader && <Loader />) || (
    <div className="postContainer">
                  <ToastContainer />
      <h2 className="postTitle">Create a Post</h2>
      <form onSubmit={handleSubmit} className="postForm">
        <div className="MediaArea">
          <div className="MediaInputBox">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              className="postFileInput"
            />
            <span className="FileInputIcon">
              <AiOutlineFileAdd />
              <span className="FileInputIconText">Drag and Drop photos and media</span>
            </span>
          </div>
          {postData.mediaUrls.length > 0 && (
              <div className="customCarousel">
                <button className="carouselButton prev" type="button" onClick={prevSlide}>❮</button>
              <div className="carouselItem">
                <span className="removeMedia"  onClick={() => handleRemoveFile(currentIndex)}>
                  <FaTimes />
                </span>
                {postData.mediaUrls[currentIndex].type.startsWith("image") ? (
                  <img src={URL.createObjectURL(postData.mediaUrls[currentIndex])} alt="preview" className="postMediaItem" />
                ) : (
                  <video autoPlay loop className="postMediaItem">
                    <source src={URL.createObjectURL(postData.mediaUrls[currentIndex])} type={postData.mediaUrls[currentIndex].type} />
                  </video>
                )}
              </div>
              <button type="button" className="carouselButton next" onClick={nextSlide}>❯</button>
            </div>
          )}
        </div>
        <textarea
          name="description"
          placeholder="Enter post description"
          value={postData.description}
          onChange={handleInputChange}
          className="postTextArea"
          required
        ></textarea>
        <button type="submit" className="postSubmitButton">
          Post
        </button>
      </form>
    </div>
      )}
      </>
  );
};

export default AddPost;
