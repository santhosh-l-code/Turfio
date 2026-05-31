package com.turfnation.Turfnation_Backend_Project.Service;

import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.*;
import com.turfnation.Turfnation_Backend_Project.Model.Booking;
import com.turfnation.Turfnation_Backend_Project.Model.Review;
import com.turfnation.Turfnation_Backend_Project.Model.Turf;
import com.turfnation.Turfnation_Backend_Project.Model.User;
import com.turfnation.Turfnation_Backend_Project.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OwnerService {

    @Autowired
    private ReviewRepo reviewRepo;
    @Autowired
    private BookingRepo bookingRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private TurfRepo turfRepo;
    @Autowired
    private TurfSlotRepo turfSlotRepo;

    public List<OwnerBookingResponse> getAllTurfBookings(Long turfId, String email) {
        User owner = userRepo.findByEmail(email).orElseThrow(()-> new RuntimeException("Owner Not Found"));

        Turf turf = turfRepo.findById(turfId).orElseThrow(()-> new RuntimeException("Turf Not Found"));

        if(!turf.getOwner().getEmail().equals(email)){
            throw new RuntimeException("UnAuthorised Access");
        }

        List<Booking> bookings = bookingRepo.findBySlot_Turf_Id(turfId);

        List<OwnerBookingResponse> responses = new ArrayList<>();

        for(Booking booking:bookings){
            OwnerBookingResponse ownerBookingResponse = OwnerBookingResponse.builder()
                    .bookingDate(booking.getBookingDate())
                    .playerName(booking.getPlayer().getName())
                    .startTime(booking.getSlot().getStartTime())
                    .endTime(booking.getSlot().getEndTime())
                    .playerPhone(booking.getPlayer().getPhone())
                    .build();
            responses.add(ownerBookingResponse);
        }
        return responses;
    }


    public RevenueResponse getRevenueForTurf(Long turfId, String email) {

        User owner = userRepo.findByEmail(email).orElseThrow(()-> new RuntimeException("Owner Not Found"));

        Turf turf = turfRepo.findById(turfId).orElseThrow(()-> new RuntimeException("Turf Not Found"));

        if(!turf.getOwner().getEmail().equals(email)){
            throw new RuntimeException("UnAuthorised Access");
        }

//        Integer totalBookings = turfSlotRepo.findByTurf_Id(turfId).size();

        List<Booking> bookings = bookingRepo.findBySlot_Turf_Id(turfId);

        Integer totalBookings = bookings.size();

        Double revenue = totalBookings * turf.getPricePerHour();

        return RevenueResponse.builder()
                .turfName(turf.getName())
                .revenue(revenue)
                .totalBookings(totalBookings).build();


    }

    public OwnerDashboardResponse getOwnerDashboardResponse(String email) {

        // ⭐ Get all owner turfs
        List<Turf> turfs = turfRepo.findByOwner_Email(email);

        int totalTurfs = turfs.size();

        int totalBookings = 0;
        double totalRevenue = 0.0;
        double totalRating = 0.0;
        int ratingCount = 0;

        Map<String, Double> monthlyRevenueMap = new HashMap<>();
        List<Booking> allBookings = new ArrayList<>();

        for (Turf turf : turfs) {

            // ⭐ rating aggregation
            if (turf.getRating() != null && turf.getTotalReviews() != null) {

                totalRating += turf.getRating() * turf.getTotalReviews();
                ratingCount += turf.getTotalReviews();
            }

            // ⭐ bookings for this turf
            List<Booking> bookings =
                    bookingRepo.findBySlot_Turf_Id(turf.getId());

            totalBookings += bookings.size();

            for (Booking booking : bookings) {

                totalRevenue += turf.getPricePerHour();

                // ⭐ monthly revenue grouping
                String month =
                        booking.getBookingDate().getYear() + "-"
                                + String.format("%02d",
                                booking.getBookingDate().getMonthValue());

                monthlyRevenueMap.put(
                        month,
                        monthlyRevenueMap.getOrDefault(month, 0.0)
                                + turf.getPricePerHour()
                );
            }

            allBookings.addAll(bookings);
        }

        double avgRating =
                ratingCount == 0 ? 0.0 : totalRating / ratingCount;

        // ⭐ convert monthly map → list
        List<MonthlyRevenueDTO> monthlyRevenue = new ArrayList<>();

        for (Map.Entry<String, Double> entry : monthlyRevenueMap.entrySet()) {

            monthlyRevenue.add(
                    MonthlyRevenueDTO.builder()
                            .month(entry.getKey())
                            .revenue(entry.getValue())
                            .build()
            );
        }

        // ⭐ sort by month
        monthlyRevenue.sort(
                Comparator.comparing(MonthlyRevenueDTO::getMonth)
        );

        // ⭐ sort bookings latest first
        allBookings.sort(
                (a, b) -> b.getBookingDate().compareTo(a.getBookingDate())
        );

        // ⭐ take recent 5 bookings
        List<OwnerBookingResponse> recentBookings = new ArrayList<>();

        for (int i = 0; i < Math.min(5, allBookings.size()); i++) {

            Booking booking = allBookings.get(i);

            recentBookings.add(
                    OwnerBookingResponse.builder()
                            .bookingDate(booking.getBookingDate())
                            .playerName(booking.getPlayer().getName())
                            .startTime(booking.getSlot().getStartTime())
                            .endTime(booking.getSlot().getEndTime())
                            .playerPhone(booking.getPlayer().getPhone())
                            .turfName(booking.getSlot().getTurf().getName())
                            .build()
            );
        }

        return OwnerDashboardResponse.builder()
                .totalTurfs(totalTurfs)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .avgRating(avgRating)
                .monthlyRevenue(monthlyRevenue)
                .recentBookings(recentBookings)
                .build();
    }

    public List<OwnerReviewResponse> getReviewsForTurf(Long turfId, String email) {

        Turf turf = turfRepo.findById(turfId).orElseThrow(()-> new RuntimeException("Turf Not Found"));



        List<Review> reviews = reviewRepo.findByTurf_Id(turfId);

//        private String playerName;
//        private Double rating;
//        private String comment;
////
        List<OwnerReviewResponse> responses = new ArrayList<>();

        for(Review review:reviews){
            responses.add(OwnerReviewResponse.builder()
                    .playerName(review.getPlayer().getName())
                    .comment(review.getComment())
                    .build()  );

        }

        return responses;
    }
}