package com.turfnation.Turfnation_Backend_Project.Controller;


import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.LoginRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.RegisterRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.UserDTO;
import com.turfnation.Turfnation_Backend_Project.Service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request){
         return userService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        String username = request.getEmail();
        String password = request.getPassword();
        return userService.login(username,password);


    }
}
