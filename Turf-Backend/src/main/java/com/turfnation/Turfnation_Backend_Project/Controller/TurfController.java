package com.turfnation.Turfnation_Backend_Project.Controller;


import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.TurfRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.SlotResponse;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.TurfResponse;
import com.turfnation.Turfnation_Backend_Project.Model.SportType;
import com.turfnation.Turfnation_Backend_Project.Model.Turf;
import com.turfnation.Turfnation_Backend_Project.Service.CloudinaryService;
import com.turfnation.Turfnation_Backend_Project.Service.TurfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/turf")
@CrossOrigin(origins = "http://localhost:5173")
public class TurfController {

    @Autowired
    private TurfService turfService;

    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/create")
    public TurfResponse create(@RequestBody TurfRequest request,
                               Authentication authentication){
        String email = authentication.getName();
        return turfService.createTurf(request,email);
    }

    @Autowired
    private CloudinaryService cloudinaryService;

    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/upload-image")
    public Map<String, String> uploadImage(
            @RequestParam("file") MultipartFile file) {
        String url = cloudinaryService.uploadImage(file);
        return Map.of("imageUrl", url);
    }

    @PreAuthorize("hasRole('OWNER')")
    @PutMapping("/update/{turfId}")
    public TurfResponse updateTurf(@RequestBody TurfRequest request,
                                   @PathVariable Long turfId,
                                   Authentication authentication){
        String email = authentication.getName();
        return turfService.updateTurf(request,turfId,email);
    }

    @PreAuthorize("hasRole('OWNER')")
    @DeleteMapping("/delete/{turfId}")
    public String deleteTurf(@PathVariable Long turfId,
                             Authentication authentication){
        String email = authentication.getName();
        return turfService.deleteTurf(email,turfId);
    }


    @GetMapping("/{turfId}/slots")
    public List<SlotResponse> getSlots(@PathVariable Long turfId
                                       ,@RequestParam String date){
        LocalDate bookingDate = LocalDate.parse(date);
        return turfService.getSlots(turfId,bookingDate);
    }

    @GetMapping("/game/{sportType}")
    public List<TurfResponse> getTurfsBySport(@PathVariable SportType sportType) {
        return turfService.findBySportType(sportType);
    }


    @GetMapping("/allTurfs")
    public List<TurfResponse> getAllTurfs(){
        return turfService.getAllTurfs();
    }

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/owner")
    public List<TurfResponse> getAllTurfsByOwner(Authentication authentication){
        String email = authentication
                .getName();
        return turfService.getAllTurfsByOwner(email);
    }

    @GetMapping("/search")
    public List<TurfResponse> findTurfsByLocation(@RequestParam String location){
        return turfService.findTurfsByLocation(location);
    }

    @GetMapping("/{turfId}")
    public TurfResponse getTurfById(@PathVariable Long turfId){
        return turfService.getTurfById(turfId);
    }


}
