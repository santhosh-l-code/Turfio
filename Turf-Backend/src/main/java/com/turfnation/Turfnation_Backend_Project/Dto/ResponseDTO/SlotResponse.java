package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;


import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SlotResponse {

    private Long slotId;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
}
