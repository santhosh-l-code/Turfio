package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OwnerDashboardResponse {

    private Integer totalTurfs;
    private Integer totalBookings;
    private Double totalRevenue;
    private Double avgRating;

    private List<MonthlyRevenueDTO> monthlyRevenue;
    private List<OwnerBookingResponse> recentBookings;

}
