import { useEffect, useState } from "react";
import "../assets/css/PostCard.css";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { getAllPosts, getLikesForPost, toggleLike } from "./AxiosService";
import PropTypes from "prop-types";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

const calculateTimeAgo = (postedDate) => {
    const currentDate = new Date();
    const postDate = new Date(postedDate);
    const diffTime = Math.floor((currentDate - postDate) / 1000);

    if (diffTime < 60) return diffTime === 1 ? `${diffTime} second ago` : `${diffTime} seconds ago`;
    const diffMinutes = Math.floor(diffTime / 60);
    if (diffMinutes < 60) return diffMinutes === 1 ? `${diffMinutes} minute ago` : `${diffMinutes} minutes ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return diffHours === 1 ? `${diffHours} hour ago` : `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return diffDays === 1 ? `${diffDays} day ago` : `${diffDays} days ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    return diffWeeks === 1 ? `${diffWeeks} week ago` : `${diffWeeks} weeks ago`;
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
        <div className="customPostCarousel">
            <button className="postCarouselButton prev" onClick={prevSlide}>
                <BsCaretLeftFill />
            </button>
            <div className="postCarouselItem">
                {mediaUrls[currentIndex].endsWith(".mp4") ? (
                    <video
                        src={`http://localhost:8080/SocialShe/api/users/files/${mediaUrls[currentIndex]}`}
                        controls autoPlay loop className="postMediaItem"
                    />
                ) : (
                    <img
                        src={`http://localhost:8080/SocialShe/api/users/files/${mediaUrls[currentIndex]}`}
                        alt="Post Media"
                        className="postMediaItem"
                    />
                )}
            </div>
            <button className="postCarouselButton next" onClick={nextSlide}>
                <BsCaretRightFill />
            </button>
        </div>
    );
};

MediaCarousel.propTypes = {
    mediaUrls: PropTypes.array.isRequired,
};

const PostCard = () => {
    const [posts, setPosts] = useState([]);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [likedPosts, setLikedPosts] = useState({});
    const [likeCounts, setLikeCounts] = useState({});

    const userId = parseInt(sessionStorage.getItem("userId")); 

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getAllPosts();
                const sortedPosts = response.data.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

                // Fetch likes for each post
                const likesData = await Promise.all(
                    sortedPosts.map(async (post) => {
                        const likeResponse = await getLikesForPost(post.postId);
                        
                        return {
                            postId: post.postId,
                            likedByCurrentUser: likeResponse.includes(userId), // Check if user liked this post
                            likeCount: likeResponse.length, // Count total likes
                        };
                    })
                );

                const initialLikedPosts = {};
                const initialLikeCounts = {};
                likesData.forEach(({ postId, likedByCurrentUser, likeCount }) => {
                    initialLikedPosts[postId] = likedByCurrentUser;
                    initialLikeCounts[postId] = likeCount;
                });

                setPosts(sortedPosts);
                setLikedPosts(initialLikedPosts);
                setLikeCounts(initialLikeCounts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, [userId]);
    // console.log(likedPosts);
    // console.log(likeCounts);
    

    const toggleDescription = (postId) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const handleLikeToggle = async (postId) => {
        try {
            await toggleLike(postId, userId);

            setLikedPosts((prev) => {
                const wasLiked = prev[postId];
                return {
                    ...prev,
                    [postId]: !wasLiked,
                };
            });

            setLikeCounts((prev) => {
                const wasLiked = likedPosts[postId]; // Use previous state
                return {
                    ...prev,
                    [postId]: wasLiked ? prev[postId] - 1 : prev[postId] + 1, // Adjust count correctly
                };
            });
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return (
        <div>
            {posts.map((post) => {
                const isDescriptionExpanded = expandedDescriptions[post.postId] || false;
                const isLiked = likedPosts[post.postId] || false;
                const likeCount = likeCounts[post.postId] || 0;

                return (
                    <div key={post.postId} className="post-card">
                        <div className="post-header">
                            <span className="username">{post.username}</span>
                            <span className="date">{calculateTimeAgo(post.postedDate)}</span>
                        </div>

                        <div className="post-media">
                            {post.mediaUrls.length > 0 && <MediaCarousel mediaUrls={post.mediaUrls} />}
                        </div>

                        <div className="post-description">
                            <p>
                                {isDescriptionExpanded ? post.description : `${post.description.slice(0, 100)}...`}
                            </p>
                            <button onClick={() => toggleDescription(post.postId)}>
                                {isDescriptionExpanded ? "Show less" : "Show more"}
                            </button>
                        </div>

                        <div className="post-footer">
                            <button
                                className={`like-button ${isLiked ? "liked" : ""}`}
                                onClick={() => handleLikeToggle(post.postId)}
                            >
                                {isLiked ? <GoHeartFill /> : <GoHeart />}
                            </button>
                            <span className="like-count">{likeCount} {likeCount === 1 ? "like" : "likes"}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PostCard;
