package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Builder
@Getter
@Setter
public class PlayerBookingResponse {

    private Long bookingId;

    private String turfName;

    private String location;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

}