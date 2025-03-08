package com.example.demo.Model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;
    
    private Long userId;

    private String username;

    @Column(nullable = false, updatable = false)
    private Instant postedDate; 

    @Column(length = 2000)
    private String description;

    private int likes;
    private int comments;

    @ElementCollection
    private List<String> mediaUrls; 

    @PrePersist
    protected void onCreate() {
        this.postedDate = Instant.now(); 
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Instant getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(Instant postedDate) {
        this.postedDate = postedDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getComments() {
        return comments;
    }

    public void setComments(int comments) {
        this.comments = comments;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

	public Post() {
		super();
	}

	public Post(Long postId, Long userId, String username, Instant postedDate, String description, int likes,
			int comments, List<String> mediaUrls) {
		super();
		this.postId = postId;
		this.userId = userId;
		this.username = username;
		this.postedDate = postedDate;
		this.description = description;
		this.likes = likes;
		this.comments = comments;
		this.mediaUrls = mediaUrls;
	}

	
}

