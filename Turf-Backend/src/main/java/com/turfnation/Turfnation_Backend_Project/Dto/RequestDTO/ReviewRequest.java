package com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {

    private Long turfId;

    private String comment;

}