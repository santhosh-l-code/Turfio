package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;


import com.turfnation.Turfnation_Backend_Project.Model.SportType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {

    private Long bookingId;

    private Long turfId;

    private String turfName;

    private LocalTime startTime;

    private LocalTime endTime;

    private LocalDate bookingDate;

    private String location;

    private SportType sportType;

}
