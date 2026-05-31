package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;


import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueResponse {

    private String turfName;
    private Integer totalBookings;
    private Double revenue;

}
