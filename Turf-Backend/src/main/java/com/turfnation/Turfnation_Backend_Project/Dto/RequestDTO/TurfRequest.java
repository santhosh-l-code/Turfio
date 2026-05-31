package com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO;


import com.turfnation.Turfnation_Backend_Project.Model.SportType;
import lombok.*;

import java.time.LocalTime;
import java.util.List;


@Getter
@Setter
public class TurfRequest {

    private String name;

    private String imageUrl;

    private String location;

    private double pricePerHour;


    private SportType sportType;

    private List<LocalTime> slotStartTimes;


}