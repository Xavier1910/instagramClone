package com.example.demo.Repo;


import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.Model.User;

import java.util.List;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    List<User> findByUsernameContainingIgnoreCase(String username);

}
