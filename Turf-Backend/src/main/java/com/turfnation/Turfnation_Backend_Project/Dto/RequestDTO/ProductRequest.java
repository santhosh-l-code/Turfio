package com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO;


import com.turfnation.Turfnation_Backend_Project.Model.SportType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequest {

    private String name;
    private String imageUrl;
    private String description;
    private Double price;
    private Integer stock;
    private SportType sportType;


}