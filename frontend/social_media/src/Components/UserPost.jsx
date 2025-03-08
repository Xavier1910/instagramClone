import { useEffect, useState } from "react";
import "../assets/css/Post.css";
import {  deletePost, getPostsByUserId, getTotalPostsForUser, updateUser } from "./AxiosService";
import PropTypes from "prop-types";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

const calculateTimeAgo = (postedDate) => {
    const currentDate = new Date();
    const postDate = new Date(postedDate);
    const diffTime = Math.floor((currentDate - postDate) / 1000);

    if (diffTime < 60) return `${diffTime} seconds ago`;
    const diffMinutes = Math.floor(diffTime / 60);
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} weeks ago`;
};

const MediaCarousel = ({ mediaUrls }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaUrls.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaUrls.length) % mediaUrls.length);
    };

    return (
        <div className="UserPostCarousel">
            <button className="userPostCarouselButton prev" onClick={prevSlide}><BsCaretLeftFill />
            </button>
            <div className="userPostCarouselItem">
                {mediaUrls[currentIndex].endsWith(".mp4") ? (
                    <video src={`http://localhost:8080/SocialShe/api/users/files/${mediaUrls[currentIndex]}`} controls autoPlay loop className="postMediaItem" />
                ) : (
                    <img src={`http://localhost:8080/SocialShe/api/users/files/${mediaUrls[currentIndex]}`} alt="Post Media" className="postMediaItem" />
                )}
            </div>
            <button className="userPostCarouselButton next" onClick={nextSlide}><BsCaretRightFill />
            </button>
        </div>
    );
};
MediaCarousel.propTypes = {
    mediaUrls: PropTypes.string.isRequired
  }
  const UserPosts = () => {
    const userId = sessionStorage.getItem("userId");

    const [posts, setPosts] = useState([]); 
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
+
    useEffect(() => {
        const fetchPosts = async () => {
            if (!userId) return; 

            try {
                const response = await getPostsByUserId(userId);
                setPosts(response.data); 
                
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPosts([]); 
            }
        };

        fetchPosts();
    }, [userId]); // Add userId as a dependency

    const toggleDescription = (postId) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };
    const handleDelete = async (postId) => {
        if(confirm("Are you sure you want to delete")){
            try {
                await deletePost(postId);
                const updatedPostCount = await getTotalPostsForUser(userId);
                
                        if (updatedPostCount !== undefined) {
                            await updateUser(userId, { posts: updatedPostCount });
                        }
                setPosts(posts.filter((p) => p.postId!== postId));
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    }

    return (
        <div className="UserPostContainer">
            {posts.length > 0 ? (
                posts.map((post) => {
                    const isDescriptionExpanded = expandedDescriptions[post.postId] || false;

                    return (
                        <div key={post.postId} className="UserPostCard">
                            <div className="UserPostHeader">
                                <span className="username">{post.username}</span>
                                <span className="date">{calculateTimeAgo(post.postedDate)}</span>
                            </div>

                            <div className="UserPostMedia">
                                {post.mediaUrls && post.mediaUrls.length > 0 && (
                                    <MediaCarousel mediaUrls={post.mediaUrls} />
                                )}
                            </div>

                            <div className="UserPostDescription">
                                <p>
                                    {isDescriptionExpanded
                                        ? post.description
                                        : `${post.description.slice(0, 100)}...`}
                                </p>
                                <button onClick={() => toggleDescription(post.postId)}>
                                    {isDescriptionExpanded ? "Show less" : "Show more"}
                                </button>
                            </div>

                            <div className="userPostFooter">
                                {/* <button className="UserPostEditButton">Edit</button> */}
                                <button className="UserPostDeleteButton" onClick={() => handleDelete(post.postId)}>Delete</button>
                                </div>
                        </div>
                    );
                })
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};

export default UserPosts;
