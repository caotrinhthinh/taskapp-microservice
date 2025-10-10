package com.example.user_service.Utils;

import org.springframework.stereotype.Component;

import com.example.user_service.dtos.UserResponse;
import com.example.user_service.entity.User;

@Component
public class UserMapper {
    public UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getIsActive());
    }
}
