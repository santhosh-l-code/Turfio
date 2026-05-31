package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MonthlyRevenueDTO {

    private String month; // "2026-03"
    private Double revenue;

}