package com.turfnation.Turfnation_Backend_Project.Service;


import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.BookingRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.BookingResponse;
import com.turfnation.Turfnation_Backend_Project.Model.Booking;
import com.turfnation.Turfnation_Backend_Project.Model.Turf;
import com.turfnation.Turfnation_Backend_Project.Model.TurfSlot;
import com.turfnation.Turfnation_Backend_Project.Model.User;
import com.turfnation.Turfnation_Backend_Project.Repository.BookingRepo;
import com.turfnation.Turfnation_Backend_Project.Repository.TurfRepo;
import com.turfnation.Turfnation_Backend_Project.Repository.TurfSlotRepo;
import com.turfnation.Turfnation_Backend_Project.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private TurfRepo turfRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TurfSlotRepo turfSlotRepo;

    @Autowired
    private BookingRepo bookingRepo;

    public String bookTurfSlots(String email, BookingRequest request) {

        Turf turf =  turfRepo.findById(request.getTurfId()).orElseThrow(()-> new RuntimeException("Turf Does Not Found"));

        User player = userRepo.findByEmail(email).orElseThrow(()-> new RuntimeException("Player Not Found"));

//        if(request.getBookingDate().isBefore(LocalDate.now())){
//            throw new RuntimeException("Cannot book past date");
//        }
        List<TurfSlot> turfSlots = turfSlotRepo.findAllById(request.getSlotIds());

        for(TurfSlot turfSlot : turfSlots){
            boolean booked = bookingRepo.existsByBookingDateAndSlot_Id(request.getBookingDate(),turfSlot.getId());

            if(booked) {
                throw new RuntimeException("Slot Already Booked "+turfSlot.getId());
            }
        }


        List<Booking> bookings = new ArrayList<>();

        for(TurfSlot turfSlot : turfSlots){

            Booking booking = Booking.builder()
                    .bookingDate(request.getBookingDate())
                    .slot(turfSlot)
                    .player(player)
                    .build();

            bookings.add(booking);
        }

        bookingRepo.saveAll(bookings);

        return "Booking Successful..";
    }

    public List<BookingResponse> myBookings(String email) {

        List<Booking> myBookings = bookingRepo.findByPlayer_Email(email);
        System.out.println("TOTAL BOOKINGS = " + myBookings.size());
        List<BookingResponse> responses = new ArrayList<>();

        for(Booking booking:myBookings){
            BookingResponse bookingResponse = BookingResponse.builder()
                    .bookingDate(booking.getBookingDate())
                    .turfId(booking.getSlot().getTurf().getId())
                    .bookingId(booking.getId())
                    .startTime(booking.getSlot().getStartTime())
                    .endTime(booking.getSlot().getEndTime())
                    .turfName(booking.getSlot().getTurf().getName())
                    .location(booking.getSlot().getTurf().getLocation())
                    .sportType(booking.getSlot().getTurf().getSportType())
                    .build();

            responses.add(bookingResponse);

        }
        return responses;
    }

    public String cancelBooking(Long bookingId, String email) {

        User player = userRepo.findByEmail(email).orElseThrow(()-> new RuntimeException("Player Not found"));

        Booking booking = bookingRepo.findById(bookingId).orElseThrow(()-> new RuntimeException(
                "Booking Not found"
        ));

        if(!booking.getPlayer().getEmail().equals(player.getEmail())){
            throw new RuntimeException("You are not allowed to Cancel the Booking");
        }

        LocalDate bookingDate = booking.getBookingDate();
        LocalTime startTime = booking.getSlot().getStartTime();

        LocalDateTime bookingDateTime =
                LocalDateTime.of(bookingDate, startTime);

        if(LocalDateTime.now().isAfter(bookingDateTime.minusHours(2))){
            throw new RuntimeException("Cancellation allowed only 2 hours before slot");
        }

        bookingRepo.delete(booking);

        return "Booking cancelled successfully";


    }
}
