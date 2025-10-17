package com.example.user_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.user_service.Utils.UserMapper;
import com.example.user_service.dtos.CreateUserRequest;
import com.example.user_service.dtos.UpdateUserRequest;
import com.example.user_service.dtos.UserEvent;
import com.example.user_service.dtos.UserResponse;
import com.example.user_service.entity.User;
import com.example.user_service.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.key.user-created}")
    private String userCreatedRoutingKey;

    @Value("${rabbitmq.routing.key.user-updated}")
    private String userUpdatedRoutingKey;

    @Value("${rabbitmq.routing.key.user-deleted}")
    private String userDeletedRoutingKey;

    public UserService(UserRepository userRepository, UserMapper userMapper, RabbitTemplate rabbitTemplate) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.rabbitTemplate = rabbitTemplate;
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

        publishUserEvent("CREATED", savedUser);

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

        publishUserEvent("UPDATED", updatedUser);

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

        publishUserEvent("DELETED", user);
    }

    private void publishUserEvent(String eventType, User user) {
        try {
            UserEvent event = new UserEvent();
            event.setEventType(eventType);
            event.setUserId(user.getId());
            event.setUsername(user.getUsername());
            event.setEmail(user.getEmail());
            event.setFullName(user.getFullName());
            event.setTimestamp(LocalDateTime.now().toString());

            String routingKey = switch (eventType) {
                case "CREATED" -> userCreatedRoutingKey;
                case "UPDATED" -> userUpdatedRoutingKey;
                case "DELETED" -> userDeletedRoutingKey;
                default -> throw new IllegalArgumentException("Invalid event type: " + eventType);
            };

            rabbitTemplate.convertAndSend(exchangeName, routingKey, event);
            log.info("User event published: {} for user id: {}", eventType, user.getId());
        } catch (IllegalArgumentException | AmqpException e) {
            log.error("Failed to publish user event: {}", e.getMessage(), e);
        }
    }
}
