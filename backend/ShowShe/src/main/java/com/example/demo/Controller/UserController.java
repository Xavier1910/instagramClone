package com.example.demo.Controller;

import com.example.demo.Model.User;
import com.example.demo.Repo.UserRepository;
import com.example.demo.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/SocialShe/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;


    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        User savedUser = userService.registerUser(user);
        
        if (savedUser != null) {
            return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", savedUser.getId()));
        }
        
        return ResponseEntity.badRequest().body(Map.of("error", "Registration failed"));
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        Optional<User> user = userService.loginUser(loginData.get("email"), loginData.get("password"));
        if (user.isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Login successful", "userId", user.get().getId()));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password"));
    }
    
    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean exists = userRepository.existsByUsername(username);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow();

        user.setFollowers(user.getFollowers());
        user.setFollowing(user.getFollowing());

        return ResponseEntity.ok(user);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String username) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCase(username);
        return ResponseEntity.ok(users);
    }


    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws Exception {
        Path filePath = Paths.get("uploads/").resolve(filename);
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        // Detect content type
        String contentType = "application/octet-stream"; 
        try {
            contentType = java.nio.file.Files.probeContentType(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(resource);
    }
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "userImage", required = false) MultipartFile userImage,
            @RequestParam(value = "posts", required = false) Long posts,
            @RequestParam(value = "followers", required = false) Long followers,
            @RequestParam(value = "following", required = false) Long following) {

        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (username != null) user.setUsername(username);
            if (bio != null) user.setBio(bio);
            if (posts != null) user.setPosts(posts);

            if (userImage != null && !userImage.isEmpty()) {
                try {
                    String fileName = userService.saveFile(userImage);
                    user.setUserImage(fileName);
                } catch (IOException e) {
                    return ResponseEntity.internalServerError().build();
                }
            }

            userRepository.save(user);
            return ResponseEntity.ok(user);
        }

        return ResponseEntity.notFound().build();
    }
    



    @PutMapping("/{userId}/follow/{targetUserId}")
    public ResponseEntity<String> followUser(@PathVariable Long userId, @PathVariable Long targetUserId) {
        String response = userService.followUser(userId, targetUserId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/unfollow/{targetUserId}")
    public ResponseEntity<String> unfollowUser(@PathVariable Long userId, @PathVariable Long targetUserId) {
        String response = userService.unfollowUser(userId, targetUserId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/followers/count")
    public ResponseEntity<Integer> getFollowersCount(@PathVariable Long userId) {
        int count = userService.getFollowersCount(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{userId}/following/count")
    public ResponseEntity<Integer> getFollowingCount(@PathVariable Long userId) {
        int count = userService.getFollowingCount(userId);
        return ResponseEntity.ok(count);
    }
    @PostMapping("/fetchUsers")
    public ResponseEntity<List<User>> getUsersByIds(@RequestBody Map<String, List<Long>> request) {
        List<Long> userIds = request.get("userIds");
        List<User> users = userRepository.findAllById(userIds);
        return ResponseEntity.ok(users);
    }

}
