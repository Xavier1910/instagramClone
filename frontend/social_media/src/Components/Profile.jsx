import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/profilePage.css";
import Loader from "./Loader";
import FollowersModal from "./FollowersModal"; // Import dark modal

const Profile = () => {
  const userId = sessionStorage.getItem("userId");
  const [user, setUser] = useState({
    username: "",
    userImage: "",
    bio: "",
    posts: 0,
    followers: [],
    following: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loader, setLoader] = useState(true);
  const [preview, setPreview] = useState(null);


  // Modal state
  const [modalType, setModalType] = useState(null);
  const [modalUsers, setModalUsers] = useState([]);

  // Fetch user details
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

  // Fetch followers or following users
  const fetchModalUsers = async (type) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/SocialShe/api/users/fetchUsers`,
        { userIds: user[type] }
      );
      setModalUsers(response.data);
      setModalType(type);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setUser((prevUser) => ({
        ...prevUser,
        userImage: file,
      }));

      setPreview(URL.createObjectURL(file));
    }
  };
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  setTimeout(() => setLoader(false), 1500);

  return (
    <>
      {loader ? <Loader /> : 
        <div className="profilePageContainer">
          <div className="profilePageCard">
            <div className="profilePageHeader">
              <div className="profileImageInfo">
              {isEditing ? (
                  <img
                    src={preview || "/images/profile.png"}
                    alt="User"
                    className="profilePageImage"
                  />
                ) : (
                  <img
                    src={
                      user.userImage
                        ? `http://localhost:8080/SocialShe/api/users/files/${user.userImage}`
                        : "/images/profile.png"
                    }
                    alt="User"
                    className="profilePageImage"
                  />
                )}

                {isEditing && (
                  <input
                    type="file"
                    id="profileImageInput"
                    name="userImage"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                )}
              </div>
              <div className="profilePageInfo">
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    className="profilePageInput"
                  />
                ) : (
              <h2 className="profilePageUsername">{user.username}</h2>
                )}
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    className="profilePageInput"
                  />
                ) : (
                  <p className="profilePageBio">{user.bio}</p>
                )}
              </div>
            </div>

            <div className="profilePageStats">
            <div className="profilePageStatItem">
                <strong>{user.posts}</strong>
                <span>Posts</span>
              </div>
              <div
                className="profilePageStatItem profilePageClickable"
                onClick={() => fetchModalUsers("followers")}
              >
                <strong>{user.followers.length}</strong>
                <span>Followers</span>
              </div>
              <div
                className="profilePageStatItem profilePageClickable"
                onClick={() => fetchModalUsers("following")}
              >
                <strong>{user.following.length}</strong>
                <span>Following</span>
              </div>
            </div>

            <div className="ActionButtons">
              <button
                className="profilePageEditButton"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Save" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      }

      {/* Dark Theme Modal */}
      {modalType && (
        <FollowersModal
          title={modalType === "followers" ? "Followers" : "Following"}
          users={modalUsers}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
};

export default Profile;
