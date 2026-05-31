package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;


import com.turfnation.Turfnation_Backend_Project.Model.SportType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TurfResponse {
    private Long id;

    private String name;

    private String imageUrl;

    private String location;

    private double pricePerHour;

    private SportType sportType;

    private Double rating;

    private Integer totalReviews;

    private List<OwnerReviewResponse> reviews;

    private LocalTime startTime;

    private LocalTime endTime;
}
