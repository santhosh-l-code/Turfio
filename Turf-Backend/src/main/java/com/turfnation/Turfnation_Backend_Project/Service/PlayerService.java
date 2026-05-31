package com.turfnation.Turfnation_Backend_Project.Service;


import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.*;
import com.turfnation.Turfnation_Backend_Project.Model.*;
import com.turfnation.Turfnation_Backend_Project.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.*;
import com.turfnation.Turfnation_Backend_Project.Model.*;
import com.turfnation.Turfnation_Backend_Project.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class PlayerService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private TurfRepo turfRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ProductService productService;

    public PlayerHomeResponse getHome(String email) {

        User player = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Player Not Found"));

        // ================================
        // ⭐ 1️⃣ Upcoming Bookings
        // ================================
        List<Booking> upcoming =
                bookingRepo.findByPlayer_IdAndBookingDateGreaterThanEqual(
                        player.getId(),
                        LocalDate.now()
                );

        List<PlayerBookingResponse> upcomingResponses = new ArrayList<>();

        for (Booking b : upcoming) {
            upcomingResponses.add(
                    PlayerBookingResponse.builder()
                            .bookingId(b.getId())
                            .turfName(b.getSlot().getTurf().getName())
                            .location(b.getSlot().getTurf().getLocation())
                            .bookingDate(b.getBookingDate())
                            .startTime(b.getSlot().getStartTime())
                            .endTime(b.getSlot().getEndTime())
                            .build()
            );
        }

        // ================================
        // ⭐ 2️⃣ Find Played Sports (History)
        // ================================
        List<Booking> pastBookings =
                bookingRepo.findByPlayer_IdAndBookingDateBefore(
                        player.getId(),
                        LocalDate.now()
                );

        Set<SportType> sportsPlayed = new HashSet<>();

        for (Booking b : pastBookings) {
            sportsPlayed.add(
                    b.getSlot().getTurf().getSportType()
            );
        }

        // ================================
        // ⭐ 3️⃣ Recommended Turfs
        // ================================
        List<Turf> recommendedTurfs;

        if (sportsPlayed.isEmpty()) {
            // NEW USER → show top rated turfs
            recommendedTurfs =
                    turfRepo.findTop5ByOrderByRatingDesc();
        } else {
            // OLD USER → show turfs of played sports
            recommendedTurfs =
                    turfRepo.findTop5BySportTypeInOrderByRatingDesc(
                            new ArrayList<>(sportsPlayed)
                    );
        }

        List<TurfResponse> turfResponses = new ArrayList<>();

        for (Turf t : recommendedTurfs) {
            turfResponses.add(
                    TurfResponse.builder()
                            .id(t.getId())
                            .name(t.getName())
                            .location(t.getLocation())
                            .pricePerHour(t.getPricePerHour())
                            .sportType(t.getSportType())
                            .rating(t.getRating() == null ? 0 : t.getRating())
                            .totalReviews(
                                    t.getTotalReviews() == null ? 0 : t.getTotalReviews()
                            )
                            .build()
            );
        }

        // ================================
        // ⭐ 4️⃣ Recommended Products
        // ================================
        List<Product> recommendedProducts;

        if (sportsPlayed.isEmpty()) {
            // NEW USER → show latest/top products
            recommendedProducts =
                    productRepo.findTop5ByOrderByPriceDesc();
        } else {
            // OLD USER → show sport based products
            recommendedProducts =
                    productRepo.findTop5BySportTypeIn(
                            new ArrayList<>(sportsPlayed)
                    );
        }

        List<ProductResponse> productResponses = new ArrayList<>();

        for (Product p : recommendedProducts) {
            productResponses.add(
                    ProductResponse.builder()
                            .id(p.getId())
                            .name(p.getName())
                            .description(p.getDescription())
                            .price(p.getPrice())
                            .stock(p.getStock())
                            .sportType(p.getSportType())
                            .build()
            );
        }

        // ================================
        // ⭐ 5️⃣ Popular Turfs (Global)
        // ================================
        List<Turf> popularTurfs =
                turfRepo.findTop5ByOrderByRatingDesc();

        List<TurfResponse> popularResponses = new ArrayList<>();

        for (Turf t : popularTurfs) {
            popularResponses.add(
                    TurfResponse.builder()
                            .id(t.getId())
                            .name(t.getName())
                            .location(t.getLocation())
                            .pricePerHour(t.getPricePerHour())
                            .sportType(t.getSportType())
                            .rating(t.getRating() == null ? 0 : t.getRating())
                            .totalReviews(
                                    t.getTotalReviews() == null ? 0 : t.getTotalReviews()
                            )
                            .build()
            );
        }

        // ================================
        // ⭐ FINAL RESPONSE
        // ================================
        return PlayerHomeResponse.builder()
                .upcomingBookings(upcomingResponses)
                .recommendedTurfs(recommendTurfs(email))
                .recommendedProducts(productService.recommendProducts(email))
                .popularTurfs(popularResponses)
                .build();
    }

    public List<TurfResponse> recommendTurfs(String email){

        User player = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Player Not Found"));

        List<Booking> bookings =
                bookingRepo.findByPlayer_Id(player.getId());

        // ⭐ Cold Start
        if(bookings.isEmpty()){

            List<Turf> popularTurfs =
                    turfRepo.findTop5ByOrderByRatingDesc();

            return popularTurfs.stream()
                    .map(this::mapTurfResponse)
                    .toList();
        }

        // ⭐ Normal Recommendation
        Map<SportType,Integer> sportCount = new HashMap<>();

        for(Booking booking : bookings){

            SportType sport =
                    booking.getSlot()
                            .getTurf()
                            .getSportType();

            sportCount.put(
                    sport,
                    sportCount.getOrDefault(sport,0) + 1
            );
        }

        SportType mostPlayedSport =
                Collections.max(
                        sportCount.entrySet(),
                        Map.Entry.comparingByValue()
                ).getKey();

        List<Turf> turfs =
                turfRepo.findTop5BySportTypeOrderByRatingDesc(mostPlayedSport);

        return turfs.stream()
                .map(this::mapTurfResponse)
                .toList();
    }
    private TurfResponse mapTurfResponse(Turf turf){

        return TurfResponse.builder()
                .id(turf.getId())
                .name(turf.getName())
                .location(turf.getLocation())
                .pricePerHour(turf.getPricePerHour())
                .rating(turf.getRating())
                .sportType(turf.getSportType())
                .totalReviews(turf.getTotalReviews())
                .build();
    }
}