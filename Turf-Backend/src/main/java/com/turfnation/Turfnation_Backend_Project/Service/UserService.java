package com.turfnation.Turfnation_Backend_Project.Service;

import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.RegisterRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.UserDTO;
import com.turfnation.Turfnation_Backend_Project.Model.User;
import com.turfnation.Turfnation_Backend_Project.Repository.UserRepo;
import com.turfnation.Turfnation_Backend_Project.Security.JwtService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service

@NoArgsConstructor
@AllArgsConstructor
public class UserService {
    @Autowired
    private  UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String register(RegisterRequest request) {

        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            return "User Already Exists..";
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .status("ACTIVE")
                .build();

        userRepo.save(user);

        return "User Registered Successfully..";
    }

    public ResponseEntity<?> login(String username, String password) {
        User user = userRepo.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User Not found"));

        if(!passwordEncoder.matches(password,user.getPassword())){
            throw new RuntimeException("Invalid Credentials");
        }
       String jwtToken =  jwtService.generateToken(user);

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", jwtToken);
        UserDTO userDto = UserDTO.builder()
                .id(user.getId())
                        .username(user.getName())
                                .role(user.getRole().toString())
                                        .email(user.getEmail()).build();

        response.put("user", userDto);
        return ResponseEntity.ok(response);
    }
}