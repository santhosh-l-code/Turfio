package com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO;


import com.turfnation.Turfnation_Backend_Project.Model.Role;
import lombok.Data;


@Data
public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role;


}
