package com.bloodbridge.controller;

import com.bloodbridge.dto.request.BloodRequestRequest;
import com.bloodbridge.dto.response.ApiResponse;
import com.bloodbridge.dto.response.BloodRequestResponse;
import com.bloodbridge.service.BloodRequestService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class BloodRequestController {

    private final BloodRequestService bloodRequestService = null;

    @PostMapping
    public ResponseEntity<ApiResponse<BloodRequestResponse>> create(@Valid @RequestBody BloodRequestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Blood request created successfully", bloodRequestService.createRequest(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BloodRequestResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success("Blood requests fetched successfully", bloodRequestService.getMyRequests()));
    }

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<List<BloodRequestResponse>>> feed(
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(required = false) String city
    ) {
        return ResponseEntity.ok(ApiResponse.success("Active request feed fetched successfully", bloodRequestService.getActiveFeed(sort, city)));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<BloodRequestResponse>>> active(
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(required = false) String city
    ) {
        return ResponseEntity.ok(ApiResponse.success("Active requests fetched successfully", bloodRequestService.getActiveFeed(sort, city)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BloodRequestResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Blood request fetched successfully", bloodRequestService.getMyRequest(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BloodRequestResponse>> update(@PathVariable Long id, @Valid @RequestBody BloodRequestRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Blood request updated successfully", bloodRequestService.updateRequest(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        bloodRequestService.deleteRequest(id);
        return ResponseEntity.ok(ApiResponse.success("Blood request deleted successfully"));
    }
}
