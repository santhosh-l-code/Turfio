package com.turfnation.Turfnation_Backend_Project.Controller;


import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.ReviewRequest;
import com.turfnation.Turfnation_Backend_Project.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PreAuthorize("hasRole('PLAYER')")
    @PostMapping("/add")
    public String addReview(@RequestBody ReviewRequest request, Authentication authentication){

        String email = authentication.getName();
        return reviewService.addReview(request,email);
    }
}
