package com.example.demo.Repo;


import com.example.demo.Model.Post;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
	List<Post> findAllByUserId(Long userId);
    int countByUserId(Long userId);

}
