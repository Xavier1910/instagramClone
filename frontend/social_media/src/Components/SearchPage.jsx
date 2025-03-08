import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/searchPage.css";
import Loader from "./Loader";
import { followUser, unfollowUser, getUserById } from "./AxiosService";
import { FaSpinner } from "react-icons/fa";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loader, setLoader] = useState(true);
  const [isFollowing, setIsFollowing] = useState({});
  const [loading, setLoading] = useState(false); 
  const currentUserId = parseInt(sessionStorage.getItem("userId")); 

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 0) {
        fetchUsers(query);
      } else {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  }, []);

  const fetchUsers = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/SocialShe/api/users/search?username=${searchQuery}`
      );

      if (Array.isArray(response.data)) {
        const filteredUsers = response.data.filter(user => user.id !== currentUserId);
        setUsers(filteredUsers);
        const followStatus = {};
        for (const user of filteredUsers) {
          const userDetails = await getUserById(user.id); 
          followStatus[user.id] = (userDetails.followers || []).includes(currentUserId);
        }        
        setIsFollowing(followStatus);
      } else {
        console.error("Unexpected response format:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    finally {
      setTimeout(() => {
        setLoading(false);

      }, 500);
    }
  };
  
  
  
  const handleFollowUser = async (userId) => {
    try {
      await followUser(currentUserId, userId);
      const updatedUser = await getUserById(userId);
  
      setIsFollowing((prev) => {
        const newState = { ...prev, [userId]: true };
        return newState;
      });
  
      setSelectedUser(updatedUser);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  
  const handleUnfollowUser = async (userId) => {
    try {
      await unfollowUser(currentUserId, userId);
      const updatedUser = await getUserById(userId);
  
      setIsFollowing((prev) => {
        const newState = { ...prev, [userId]: false };
        return newState;
      });
  
      setSelectedUser(updatedUser);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };
  
  
  
  const handleUserSelect = async (user) => {
    try {
      const userDetails = await getUserById(user.id);
      setIsFollowing({
        ...isFollowing,
        [user.id]: (userDetails.followers || []).some(follower => follower === currentUserId),
        
      });
      console.log(userDetails.followers);
  
      setSelectedUser(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
    
  

  return (
    <>
      {(loader && <Loader />) || (
          <div className="searchPageContainer">
            <input
              type="text"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="searchPageInput"
            />
            {loading && <FaSpinner className="SearchIcon spinner" />}
            <div className="searchPageResults">
              {users.length > 0 ?users.map((user) => (
                <div
                  key={user.id}
                  className="searchPageUserCard"
                  onClick={() => handleUserSelect(user)}
                >
                  <img
                    src={
                      user.userImage
                        ? `http://localhost:8080/SocialShe/api/users/files/${user.userImage}`
                        : "/images/profile.png"
                    }
                    alt={user.username}
                    className="searchPageUserImage"
                  />
                  <p className="searchPageUsername">{user.username}</p>
                </div>
              )):
              (!loading && query !== "" && users.length === 0) ? (
                <h2 id="SearchNoResult">No users found.😑</h2>
              ) : null}
            </div>
            {selectedUser && (
              <div className="modalOverlay" onClick={() => setSelectedUser(null)}>
                <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                  <button className="closeButton" onClick={() => setSelectedUser(null)}>X</button>
                  <div className="MainProfileDetails">
                    <div className="userProfileImage">
                      <img
                        src={
                          selectedUser.userImage
                            ? `http://localhost:8080/SocialShe/api/users/files/${selectedUser.userImage}`
                            : "/images/profile.png"
                        }
                        alt={selectedUser.username}
                        className="modalUserImage"
                      />
                    </div>
                    <div className="UserProfile">
                      <p className="modalUsername">{selectedUser.username}</p>
                      <p className="modalBio"> {selectedUser.bio}</p>
                    </div>
                    <div id="FollowButton">
                      {isFollowing[selectedUser.id]===true ? (
                        <button
                          className="followingButton"
                          onClick={() => handleUnfollowUser(selectedUser.id)}
                        >
                          Following
                        </button>
                      ) : (
                        <button
                          className="followButton"
                          onClick={() => handleFollowUser(selectedUser.id)}
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="searchProfilePageStats">
                    <div className="searchProfilePageStatItem">
                      <strong>{selectedUser.posts?selectedUser.posts:0}</strong>
                      <span>Posts</span>
                    </div>
                    <div className="searchProfilePageStatItem">
                      <strong>{selectedUser.followers.length!==0?selectedUser.followers.length:0}</strong>
                      <span>Followers</span>
                    </div>
                    <div className="searchProfilePageStatItem">
                      <strong>{selectedUser.following.length!==0?selectedUser.following.length:0}</strong>
                      <span>Following</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
      )}
    </>
  );
};

export default SearchPage;
