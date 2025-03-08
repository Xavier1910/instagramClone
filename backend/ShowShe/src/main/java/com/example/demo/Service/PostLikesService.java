package com.example.demo.Service;

import org.springframework.stereotype.Service;

import com.example.demo.Model.PostLikes;
import com.example.demo.Repo.PostLikesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@Service
public class PostLikesService {

    @Autowired
    private PostLikesRepository postLikesRepository;

    // Add Likes for a Post
    public void addPostLikes(Long postId, Long userId) {
        Optional<PostLikes> postLikesOpt = postLikesRepository.findByPostId(postId);

        if (postLikesOpt.isPresent()) {
            PostLikes postLikes = postLikesOpt.get();
            List<Long> userIds = postLikes.getUserIds();
            if (!userIds.contains(userId)) {
                userIds.add(userId);
                postLikes.setUserIds(userIds);
                postLikesRepository.save(postLikes);
            }
        } else {
            postLikesRepository.save(new PostLikes(postId, List.of(userId)));
        }
    }

    // Remove Like from a Post
    public void removePostLike(Long postId, Long userId) {
        Optional<PostLikes> postLikesOpt = postLikesRepository.findByPostId(postId);

        if (postLikesOpt.isPresent()) {
            PostLikes postLikes = postLikesOpt.get();
            List<Long> userIds = postLikes.getUserIds();
            userIds.remove(userId);
            if (userIds.isEmpty()) {
                postLikesRepository.delete(postLikes);
            } else {
                postLikes.setUserIds(userIds);
                postLikesRepository.save(postLikes);
            }
        }
    }

    // Toggle Like (Add or Remove)
    public void updatePostLikes(Long postId, Long userId) {
        Optional<PostLikes> postLikesOpt = postLikesRepository.findByPostId(postId);

        if (postLikesOpt.isPresent()) {
            PostLikes postLikes = postLikesOpt.get();
            List<Long> userIds = postLikes.getUserIds();
            if (userIds.contains(userId)) {
                userIds.remove(userId); // Unlike post
            } else {
                userIds.add(userId); // Like post
            }
            if (userIds.isEmpty()) {
                postLikesRepository.delete(postLikes);
            } else {
                postLikes.setUserIds(userIds);
                postLikesRepository.save(postLikes);
            }
        } else {
            postLikesRepository.save(new PostLikes(postId, List.of(userId)));
        }
    }

    // Get Users Who Liked a Post
    public List<Long> getPostLikes(Long postId) {
        return postLikesRepository.findByPostId(postId)
                .map(PostLikes::getUserIds)
                .orElse(List.of());
    }
}

