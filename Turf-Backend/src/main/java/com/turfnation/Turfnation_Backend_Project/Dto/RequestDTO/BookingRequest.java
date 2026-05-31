package com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO;

import com.turfnation.Turfnation_Backend_Project.Model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@Builder
@Getter
@Setter
public class BookingRequest {

    private Long turfId;
    private List<Long> slotIds;
    private LocalDate bookingDate;

}
