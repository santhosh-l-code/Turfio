package com.turfnation.Turfnation_Backend_Project.Controller;


import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.*;
import com.turfnation.Turfnation_Backend_Project.Service.OwnerService;
import com.turfnation.Turfnation_Backend_Project.Service.TurfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    @Autowired
    private TurfService turfService;

    @Autowired
    private OwnerService ownerService;


    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/turf/{turfId}/bookings")
    public List<OwnerBookingResponse> getAllTurfBookings(@PathVariable Long turfId,
                                                         Authentication authentication){
        String email = authentication.getName();

        return ownerService.getAllTurfBookings(turfId,email);
    }

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/turf/{turfId}/revenue")
    public RevenueResponse getRevenueForTurf(@PathVariable Long turfId,
                                             Authentication authentication){
        String email = authentication.getName();
        return ownerService.getRevenueForTurf(turfId,email);
    }

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/dashboard")
    public OwnerDashboardResponse getOwnerDashboardResponse(Authentication authentication){
        String email = authentication.getName();
        return ownerService.getOwnerDashboardResponse(email);
    }


    @GetMapping("/turf/{turfId}/reviews")
    public List<OwnerReviewResponse> getReviewsForTurf(@PathVariable Long turfId,Authentication authentication){

        String email = authentication.getName();
        return ownerService.getReviewsForTurf(turfId,email);
    }


    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/turfs")
    public List<TurfResponse> getAllTurfsByOwner(Authentication authentication){
        String email = authentication
                .getName();
        return turfService.getAllTurfsByOwner(email);
    }
}
