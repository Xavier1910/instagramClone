package com.example.demo.Controller;


import com.example.demo.Model.Post;
import com.example.demo.Repo.PostRepository;
import com.example.demo.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/SocialShe/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;
    
    @Autowired
    private PostRepository repo;

    @PostMapping("/add")
    public Post addPost(
            @RequestParam("userId") Long userId,
            @RequestParam("username") String username,
            @RequestParam("description") String description,
            @RequestParam("userId") int likes,
            @RequestParam("userId") int comments,
            @RequestParam(value = "mediaUrls", required = false) MultipartFile[] mediaUrls
    ) {
        return postService.addPost(userId,username, description,likes,comments, mediaUrls);
    }

    @GetMapping("/allPosts")
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }
    @GetMapping("/user/postCount/{userId}")
    public int getTotalPostsForUserID(@PathVariable Long userId) {
        return repo.countByUserId(userId);
    }
    @GetMapping("/{postId}")
    public Post getPostById(@PathVariable Long postId) {
        return postService.getPostById(postId);
    }
    @GetMapping("/user/{userId}")
    public List<Post> getPostByUserId(@PathVariable Long userId) {
        return postService.getPostsByUserId(userId);
    }

    @PutMapping("/update/{postId}")
    public Post updatePost(
            @PathVariable Long postId,
            @RequestParam("description") String description,
            @RequestParam(value = "mediaFiles", required = false) MultipartFile[] mediaFiles
    ) {
        return postService.updatePost(postId, description, mediaFiles);
    }

    @DeleteMapping("/delete/{postId}")
    public String deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return "Post deleted successfully.";
    }
}
