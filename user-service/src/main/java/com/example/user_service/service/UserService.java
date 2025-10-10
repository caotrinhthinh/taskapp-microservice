package com.example.user_service.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.user_service.Utils.UserMapper;
import com.example.user_service.dtos.CreateUserRequest;
import com.example.user_service.dtos.UpdateUserRequest;
import com.example.user_service.dtos.UserResponse;
import com.example.user_service.entity.User;
import com.example.user_service.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public List<UserResponse> getAllUsers() {
        log.info("Fetching all users");
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(userMapper::mapToResponse)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        log.info("Fetching user with id: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        UserResponse userResponse = userMapper.mapToResponse(user);

        return userResponse;
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creating new user with username: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(request.getPassword());

        User savedUser = userRepository.save(user);
        log.info("User created successfully with id: {}", savedUser.getId());

        UserResponse userResponse = userMapper.mapToResponse(savedUser);

        return userResponse;
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        log.info("Updating user with id: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Nếu muốn thay đổi email mà email đã tồn tại trong db thì ném ra lỗi
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        if (request.getPassword() != null) {
            user.setPassword(request.getPassword());
        }

        User updatedUser = userRepository.save(user);
        log.info("User updated successfully with id: {}", updatedUser.getId());

        UserResponse userResponse = userMapper.mapToResponse(updatedUser);

        return userResponse;
    }

    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting user with id: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        userRepository.delete(user);

        log.info("User deleted successfully with id: {}", id);
    }
}
