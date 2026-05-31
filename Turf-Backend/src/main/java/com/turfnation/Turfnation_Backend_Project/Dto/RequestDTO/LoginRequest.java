package com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO;

import lombok.Data;

@Data
public class LoginRequest {

    private String email;
    private String password;

}
