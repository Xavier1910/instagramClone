package com.example.demo.Service;

import com.example.demo.Model.Post;
import com.example.demo.Repo.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private static final String UPLOAD_DIR = "uploads/";

    @Autowired
    private PostRepository postRepository;

    public Post addPost(Long userId,String username, String description,int likes,int comments, MultipartFile[] mediaFiles) {
        Post post = new Post();
        post.setUserId(userId);
        post.setUsername(username);
        post.setDescription(description);
        post.setLikes(0);
        post.setComments(0);

        List<String> mediaUrls = saveFiles(mediaFiles);
        post.setMediaUrls(mediaUrls);
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long postId) {
        return postRepository.findById(postId).orElse(null);
    }
    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findAllByUserId(userId);
    }

    public Post updatePost(Long postId, String description, MultipartFile[] mediaFiles) {
        Optional<Post> existingPost = postRepository.findById(postId);
        if (existingPost.isPresent()) {
            Post post = existingPost.get();
            post.setDescription(description);

            if (mediaFiles != null && mediaFiles.length > 0) {
                List<String> mediaUrls = saveFiles(mediaFiles);
                post.setMediaUrls(mediaUrls);
            }

            return postRepository.save(post);
        } else {
            throw new RuntimeException("Post not found with ID: " + postId);
        }
    }

    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    private List<String> saveFiles(MultipartFile[] mediaFiles) {
        List<String> mediaUrls = new ArrayList<>();
        try {
            for (MultipartFile file : mediaFiles) {
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, file.getBytes());
                mediaUrls.add(fileName);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload media files", e);
        }
        return mediaUrls;
    }

	
}
