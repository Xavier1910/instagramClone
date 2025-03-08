package com.example.demo.Model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class PostLikes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long postId;

    @ElementCollection
    private List<Long> userIds; 

    public PostLikes() {}

    public PostLikes(Long postId, List<Long> userIds) {
        this.postId = postId;
        this.userIds = userIds;
    }

    public Long getId() {
        return id;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }
}

