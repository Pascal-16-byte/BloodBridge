package com.bloodbridge.mapper;

import com.bloodbridge.constants.RequestStatus;
import com.bloodbridge.dto.request.BloodRequestRequest;
import com.bloodbridge.dto.response.BloodRequestResponse;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.User;
import org.springframework.stereotype.Component;

@Component
public class BloodRequestMapper {

    public BloodRequest toEntity(BloodRequestRequest request, User createdBy) {
        BloodRequest bloodRequest = new BloodRequest();
        bloodRequest.setCreatedBy(createdBy);
        applyRequest(bloodRequest, request);
        bloodRequest.setStatus(RequestStatus.PENDING);
        return bloodRequest;
    }

    public void updateEntity(BloodRequest bloodRequest, BloodRequestRequest request) {
        applyRequest(bloodRequest, request);
        if (request.getStatus() != null) {
            bloodRequest.setStatus(request.getStatus());
        }
    }

    public BloodRequestResponse toResponse(BloodRequest bloodRequest) {
        User createdBy = bloodRequest.getCreatedBy();
        return BloodRequestResponse.builder()
                .id(bloodRequest.getId())
                .createdById(createdBy.getId())
                .createdByName(createdBy.getFullName())
                .patientName(bloodRequest.getPatientName())
                .bloodGroup(bloodRequest.getBloodGroup())
                .unitsRequired(bloodRequest.getUnitsRequired())
                .hospitalName(bloodRequest.getHospitalName())
                .hospitalAddress(bloodRequest.getHospitalAddress())
                .city(bloodRequest.getCity())
                .district(bloodRequest.getDistrict())
                .state(bloodRequest.getState())
                .contactPerson(bloodRequest.getContactPerson())
                .contactNumber(bloodRequest.getContactNumber())
                .urgency(bloodRequest.getUrgency())
                .requiredBefore(bloodRequest.getRequiredBefore())
                .notes(bloodRequest.getNotes())
                .status(bloodRequest.getStatus())
                .createdAt(bloodRequest.getCreatedAt())
                .build();
    }

    private void applyRequest(BloodRequest bloodRequest, BloodRequestRequest request) {
        bloodRequest.setPatientName(request.getPatientName().trim());
        bloodRequest.setBloodGroup(request.getBloodGroup());
        bloodRequest.setUnitsRequired(request.getUnitsRequired());
        bloodRequest.setHospitalName(request.getHospitalName().trim());
        bloodRequest.setHospitalAddress(request.getHospitalAddress().trim());
        bloodRequest.setCity(request.getCity().trim());
        bloodRequest.setDistrict(request.getDistrict().trim());
        bloodRequest.setState(request.getState().trim());
        bloodRequest.setContactPerson(request.getContactPerson().trim());
        bloodRequest.setContactNumber(request.getContactNumber().trim());
        bloodRequest.setUrgency(request.getUrgency());
        bloodRequest.setRequiredBefore(request.getRequiredBefore());
        bloodRequest.setNotes(trimToNull(request.getNotes()));
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
