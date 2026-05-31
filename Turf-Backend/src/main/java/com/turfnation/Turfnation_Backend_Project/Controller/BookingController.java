package com.turfnation.Turfnation_Backend_Project.Controller;


import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.BookingRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.BookingResponse;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.OwnerBookingResponse;
import com.turfnation.Turfnation_Backend_Project.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turfSlot")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PreAuthorize("hasRole('PLAYER')")
    @PostMapping("/book")
    public String bookTurfSlots(@RequestBody BookingRequest request,
                               Authentication authentication){
        String email = authentication.getName();

        return bookingService.bookTurfSlots(email,request);

    }

    @PreAuthorize("hasRole('PLAYER')")
    @GetMapping("/my-bookings")
    public List<BookingResponse> myBookings(Authentication authentication){
        String email = authentication.getName();

        return bookingService.myBookings(email);

    }

    @PreAuthorize("hasRole('PLAYER')")
    @DeleteMapping("/cancel/{bookingId}")
    public String cancelBooking(@PathVariable Long bookingId,
                                Authentication authentication){

        String email = authentication.getName();
        return bookingService.cancelBooking(bookingId,email);
    }







}
