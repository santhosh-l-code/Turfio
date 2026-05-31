package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;

import lombok.Data;

@Data
public class AiReviewResponse {

    private String sentiment;
    private double score;
    private String ownerMessage;

}