package com.example.demo.Model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String bio;

    @Column(length = 500)
    private String userImage;

    private long posts;

    // Store followers as an array of user IDs
    @ElementCollection
    private List<Long> followers;

    // Store following as an array of user IDs
    @ElementCollection
    private List<Long> following;

    // Constructors
    public User() {}

    public User(Long id, String username, String email, String password, String bio, String userImage, long posts,
                List<Long> followers, List<Long> following) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.userImage = userImage;
        this.posts = posts;
        this.followers = followers;
        this.following = following;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getUserImage() { return userImage; }
    public void setUserImage(String userImage) { this.userImage = userImage; }

    public long getPosts() { return posts; }
    public void setPosts(long posts) { this.posts = posts; }

    public List<Long> getFollowers() { return followers; }
    public void setFollowers(List<Long> followers) { this.followers = followers; }

    public List<Long> getFollowing() { return following; }
    public void setFollowing(List<Long> following) { this.following = following; }
}
