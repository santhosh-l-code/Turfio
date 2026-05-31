package com.turfnation.Turfnation_Backend_Project.Controller;


import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.PlayerHomeResponse;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.TurfResponse;
import com.turfnation.Turfnation_Backend_Project.Service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/player")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @PreAuthorize("hasRole('PLAYER')")
    @GetMapping("/home")
    public PlayerHomeResponse getHome(Authentication authentication){

        String email = authentication.getName();

        return playerService.getHome(email);
    }

    @PreAuthorize("hasRole('PLAYER')")
    @GetMapping("/recommend/turfs")
    public List<TurfResponse> recommendTurfs(Authentication authentication){
        return playerService.recommendTurfs(authentication.getName());
    }
}