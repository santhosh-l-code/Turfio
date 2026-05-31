package com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BuyProductRequest {

    private Long productId;
    private Integer quantity;

}