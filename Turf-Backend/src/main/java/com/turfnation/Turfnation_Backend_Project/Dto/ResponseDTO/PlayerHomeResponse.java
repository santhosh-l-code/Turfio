package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
public class PlayerHomeResponse {

    private List<TurfResponse> recommendedTurfs;

    private List<ProductResponse> recommendedProducts;

    private List<PlayerBookingResponse> upcomingBookings;

    private List<TurfResponse> popularTurfs;

}