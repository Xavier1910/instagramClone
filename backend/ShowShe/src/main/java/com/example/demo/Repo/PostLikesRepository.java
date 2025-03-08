package com.example.demo.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.PostLikes;

import java.util.Optional;

public interface PostLikesRepository extends JpaRepository<PostLikes, Long> {
    Optional<PostLikes> findByPostId(Long postId);
}
