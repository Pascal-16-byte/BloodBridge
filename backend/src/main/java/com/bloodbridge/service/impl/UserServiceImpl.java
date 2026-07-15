package com.bloodbridge.service.impl;

import com.bloodbridge.dto.response.UserResponse;
import com.bloodbridge.entity.User;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.mapper.UserMapper;
import com.bloodbridge.repository.UserRepository;
import com.bloodbridge.service.UserService;
import com.bloodbridge.util.SecurityUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getAuthenticatedUserProfile() {
        String email = SecurityUtils.getCurrentUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user was not found"));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }
}
