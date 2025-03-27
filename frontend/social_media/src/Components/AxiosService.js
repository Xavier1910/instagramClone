import axios from "axios";

const API_URL = "http://localhost:8080/SocialShe/api";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "An error occurred" };
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, loginData);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Invalid credentials" };
  }
};
export const checkUsernameAvailability = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/users/check-username`, {
      params: { username },
    });
    return response.data.exists;
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const fetchUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};


export const updateUser = async (userId, updateData) => {
  try {
    const formData = new FormData();
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        formData.append(key, updateData[key]);
      }
    });

    const response = await axios.put(`${API_URL}/users/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // console.log("User updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

//returns the total post for user from database
export const getTotalPostsForUser = async (userId) => {
  try {
      const response = await axios.get(`${API_URL}/posts/user/postCount/${userId}`);
      return response.data;
  } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
  }
};
export const followUser = async (currentUserId, targetUserId) => {
  try {
    await axios.put(`${API_URL}/users/${currentUserId}/follow/${targetUserId}`);
  } catch (error) {
    console.error("Error following user:", error);
  }
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  try {
    await axios.put(`${API_URL}/users/${currentUserId}/unfollow/${targetUserId}`);
  } catch (error) {
    console.error("Error un-following user:", error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};



// Function to add a post
export const addPost = async (formdata) => {

    try {
        const response = await axios.post(`${API_URL}/posts/add`, formdata, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding post:", error);
        throw error;
    }
};

// Function to get all posts
export const getAllPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/posts/allPosts`);
        return response;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
};


// Function to get a post by ID
export const getPostById = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/posts/${postId}`);
        return response;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};
export const getPostsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/posts/user/${userId}`);
        return response;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};

// Function to update a post
export const updatePost = async (postId, description, files) => {
    const formData = new FormData();
    formData.append("description", description);

    if (files) {
        for (let i = 0; i < files.length; i++) {
            formData.append("mediaFiles", files[i]);
        }
    }

    try {
        const response = await axios.put(`${API_URL}/posts/update/${postId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
};

// Function to delete a post
export const deletePost = async (postId) => {
    try {
        const response = await axios.delete(`${API_URL}/posts/delete/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
};

export const getLikesForPost = async (postId) => {
  try {
      const response = await axios.get(`${API_URL}/postLikes/${postId}`);
      return response.data;
  } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
  }
};
export const toggleLike = async (postId, userId) => {
  return axios.post(`${API_URL}/postLikes/toggle`, null, {
      params: { postId, userId }
  });
};