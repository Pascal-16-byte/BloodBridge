package com.bloodbridge.service;

import com.bloodbridge.dto.response.UserResponse;
import java.util.List;

public interface UserService {

    UserResponse getAuthenticatedUserProfile();

    List<UserResponse> getAllUsers();
}
