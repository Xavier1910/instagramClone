package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Service.PostLikesService;

import java.util.List;

@RestController
@RequestMapping("/SocialShe/api/postLikes")
public class PostLikesController {

    @Autowired
    private PostLikesService postLikesService;

    @PostMapping("/add")
    public void addLike(@RequestParam Long postId, @RequestParam Long userId) {
        postLikesService.addPostLikes(postId, userId);
    }

    @PostMapping("/remove")
    public void removeLike(@RequestParam Long postId, @RequestParam Long userId) {
        postLikesService.removePostLike(postId, userId);
    }

    @PostMapping("/toggle")
    public void toggleLike(@RequestParam Long postId, @RequestParam Long userId) {
        postLikesService.updatePostLikes(postId, userId);
    }

    @GetMapping("/{postId}")
    public List<Long> getLikes(@PathVariable Long postId) {
        return postLikesService.getPostLikes(postId);
    }
}

