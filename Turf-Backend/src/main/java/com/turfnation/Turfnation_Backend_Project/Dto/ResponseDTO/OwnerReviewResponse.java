package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OwnerReviewResponse {

    private String playerName;
    private String comment;

}
