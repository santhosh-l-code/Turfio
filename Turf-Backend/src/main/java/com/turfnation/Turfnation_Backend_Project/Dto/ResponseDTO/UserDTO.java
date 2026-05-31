package com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private String role;
}
