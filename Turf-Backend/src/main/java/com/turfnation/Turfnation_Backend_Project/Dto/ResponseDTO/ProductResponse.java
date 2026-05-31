package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;

import com.turfnation.Turfnation_Backend_Project.Model.SportType;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String imageUrl;
    private String description;
    private Double price;
    private Integer stock;
    private SportType sportType;

}