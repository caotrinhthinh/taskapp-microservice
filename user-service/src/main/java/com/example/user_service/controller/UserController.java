package com.example.user_service.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.user_service.dtos.CreateUserRequest;
import com.example.user_service.dtos.UpdateUserRequest;
import com.example.user_service.dtos.UserResponse;
import com.example.user_service.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Users retrieved successfully");
        response.put("data", users);
        response.put("count", users.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable("id") Long id) {
        UserResponse user = userService.getUserById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User retrieved successfully");
        response.put("data", user);

        return ResponseEntity.ok(response);
    }

    @PostMapping()
    public ResponseEntity<Map<String, Object>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse user = userService.createUser(request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User created successfully");
        response.put("data", user);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> putMethodName(@PathVariable("id") Long id,
            @RequestBody UpdateUserRequest request) {
        UserResponse user = userService.updateUser(id, request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User updated successfully");
        response.put("data", user);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User deleted successfully");

        return ResponseEntity.ok(response);
    }
}
