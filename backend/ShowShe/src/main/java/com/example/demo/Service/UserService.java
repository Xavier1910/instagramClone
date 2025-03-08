package com.example.demo.Service;


import com.example.demo.Model.User;
import com.example.demo.Repo.UserRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && password.equals(user.get().getPassword()) ) {
            return user;
        }
        return Optional.empty();
    }
    
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    public String saveFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        // Ensure upload directory exists
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate a unique filename to avoid conflicts
        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destinationPath = uploadPath.resolve(uniqueFileName);

        // Save the file
        try {
            file.transferTo(destinationPath.toFile());
        } catch (IOException e) {
            throw new IOException("File upload failed: " + e.getMessage(), e);
        }

        return uniqueFileName;
    }
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }


    // Follow a user
    public String followUser(Long userId, Long targetUserId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<User> targetUserOpt = userRepository.findById(targetUserId);

        if (userOpt.isPresent() && targetUserOpt.isPresent()) {
            User user = userOpt.get();
            User targetUser = targetUserOpt.get();

            if (!targetUser.getFollowers().contains(userId)) {
                targetUser.getFollowers().add(userId);
                user.getFollowing().add(targetUserId);
                userRepository.save(user);
                userRepository.save(targetUser);
                return "User followed successfully";
            } else {
                return "Already following this user";
            }
        }
        return "User not found";
    }

    // Un-follow a user
    public String unfollowUser(Long userId, Long targetUserId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<User> targetUserOpt = userRepository.findById(targetUserId);

        if (userOpt.isPresent() && targetUserOpt.isPresent()) {
            User user = userOpt.get();
            User targetUser = targetUserOpt.get();

            if (targetUser.getFollowers().contains(userId)) {
                targetUser.getFollowers().remove(userId);
                user.getFollowing().remove(targetUserId);
                userRepository.save(user);
                userRepository.save(targetUser);
                return "User unfollowed successfully";
            } else {
                return "Not following this user";
            }
        }
        return "User not found";
    }
    

    public int getFollowersCount(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getFollowers().size())
                .orElse(0);
    }

    public int getFollowingCount(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getFollowing().size())
                .orElse(0);
    }
}
