package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class OwnerBookingResponse {

    private String playerName;
    private String playerPhone;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String turfName;


}
