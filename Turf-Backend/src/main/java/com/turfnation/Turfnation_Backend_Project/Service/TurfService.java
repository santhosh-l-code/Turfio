package com.turfnation.Turfnation_Backend_Project.Service;

import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.TurfRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.OwnerReviewResponse;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.SlotResponse;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.TurfResponse;
import com.turfnation.Turfnation_Backend_Project.Model.*;
import com.turfnation.Turfnation_Backend_Project.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TurfService {

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TurfRepo turfRepo;

    @Autowired
    private TurfSlotRepo turfSlotRepo;

    @Autowired
    private BookingRepo bookingRepo;

    public TurfResponse createTurf(TurfRequest request, String email) {

        User owner = userRepo.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("Owner not found"));

        Turf turf = Turf.builder()
                .name(request.getName())
                .location(request.getLocation())
                .pricePerHour(request.getPricePerHour())
                .sportType(request.getSportType())
                .imageUrl(request.getImageUrl())
                .rating(0.0)
                .totalReviews(0)
                .owner(owner)
                .build();


        List<TurfSlot> slots = new ArrayList<>();

        for(LocalTime time: request.getSlotStartTimes()){
            TurfSlot slot = TurfSlot.builder().
                    startTime(time).
                    endTime(time.plusHours(1))
                    .turf(turf)
                    .build();
            slots.add(slot);
        }

        turf.setSlots(slots);

         turfRepo.save(turf);
         return mapToResponse(turf);

    }

    public List<SlotResponse> getSlots(Long turfId, LocalDate bookingDate) {

        Turf turf = turfRepo.findById(turfId)
                .orElseThrow(() -> new RuntimeException("Turf not found"));

        List<TurfSlot> allSlots = turfSlotRepo.findByTurf_Id(turfId);

        List<Booking> bookings =
                bookingRepo.findByBookingDateAndSlot_Turf_Id(bookingDate, turfId);

        Set<Long> bookedSlotIds = bookings.stream()
                .map(b -> b.getSlot().getId())
                .collect(Collectors.toSet());

        List<SlotResponse> responses = new ArrayList<>();

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        for (TurfSlot slot : allSlots) {

            // ⭐ Skip past slots ONLY for today
            if (bookingDate.isEqual(today)
                    && slot.getStartTime().isBefore(now)) {
                continue;
            }

            responses.add(
                    SlotResponse.builder()
                            .slotId(slot.getId())
                            .startTime(slot.getStartTime())
                            .endTime(slot.getEndTime())
                            .status(bookedSlotIds.contains(slot.getId())
                                    ? "BOOKED"
                                    : "AVAILABLE")
                            .build()
            );
        }

        return responses;
    }

    public List<TurfResponse> findBySportType(SportType sportType) {
        List<Turf> turfs = turfRepo.findBySportType(sportType);
        List<TurfResponse> responses = new ArrayList<>();
        for(Turf turf:turfs){
            responses.add( TurfResponse.builder()
                    .id(turf.getId())
                    .name(turf.getName())
                    .location(turf.getLocation())
                    .sportType(turf.getSportType())
                    .pricePerHour(turf.getPricePerHour())
                    .rating(turf.getRating())
                    .totalReviews(turf.getTotalReviews())
                    .build());
        }
        return responses;

    }

    @Transactional
    public TurfResponse updateTurf(TurfRequest request, Long turfId, String email) {

        User owner = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Turf turf = turfRepo.findById(turfId)
                .orElseThrow(() -> new RuntimeException("Turf Not Found"));

        if (!turf.getOwner().getEmail().equals(owner.getEmail())) {
            throw new RuntimeException("Unauthorized to update this turf");
        }

        // ⭐ Update basic fields
        turf.setName(request.getName());
        turf.setLocation(request.getLocation());
        turf.setPricePerHour(request.getPricePerHour());
        turf.setSportType(request.getSportType());

        // ⭐ Step 1: New requested slot times
        Set<LocalTime> newSlotTimes = new HashSet<>(request.getSlotStartTimes());

        // ⭐ Step 2: Process existing slots
        for (TurfSlot slot : turf.getSlots()) {

            boolean isBooked = bookingRepo.existsBySlot_Id(slot.getId());

            // ❌ Delete only if NOT booked AND not in new request
            if (!newSlotTimes.contains(slot.getStartTime()) && !isBooked) {
                turfSlotRepo.deleteById(slot.getId());
            }
        }

        // ⭐ Step 3: Keep only required slots in memory
        turf.getSlots().removeIf(slot ->
                !newSlotTimes.contains(slot.getStartTime())
                        && !bookingRepo.existsBySlot_Id(slot.getId())
        );

        // ⭐ Step 4: Add new slots (avoid duplicates)
        for (LocalTime time : newSlotTimes) {

            boolean exists = turf.getSlots().stream()
                    .anyMatch(s -> s.getStartTime().equals(time));

            if (!exists) {
                TurfSlot newSlot = TurfSlot.builder()
                        .startTime(time)
                        .endTime(time.plusHours(1))
                        .turf(turf)
                        .build();

                turf.getSlots().add(newSlot);
            }
        }

        turfRepo.save(turf);

        return mapToResponse(turf);
    }
    @Transactional
    public String deleteTurf(String email, Long turfId) {

        User owner = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Turf turf = turfRepo.findById(turfId)
                .orElseThrow(() -> new RuntimeException("Turf Not Found"));

        // ⭐ OWNER CHECK
        if (!turf.getOwner().getEmail().equals(owner.getEmail())) {
            throw new RuntimeException("Unauthorized to delete this turf");
        }

        // ⭐ OPTIONAL (RECOMMENDED): Prevent deleting future bookings
        boolean hasFutureBookings = bookingRepo
                .existsBySlot_Turf_IdAndBookingDateAfter(turfId, LocalDate.now());

        if (hasFutureBookings) {
            throw new RuntimeException("Cannot delete turf with upcoming bookings");
        }

        // ⭐ DELETE ORDER (VERY IMPORTANT)

        // 1. Delete bookings
        List<Booking> bookings = bookingRepo.findBySlot_Turf_Id(turfId);
        bookingRepo.deleteAll(bookings);

        // 2. Delete reviews
        List<Review> reviews = reviewRepo.findByTurf_Id(turfId);
        reviewRepo.deleteAll(reviews);

        // 3. Delete slots
        List<TurfSlot> slots = turfSlotRepo.findByTurf_Id(turfId);
        turfSlotRepo.deleteAll(slots);

        // 4. Delete turf
        turfRepo.delete(turf);

        return "Turf Deleted Successfully";
    }

    public List<TurfResponse> getAllTurfs() {
        List<Turf> turfs =  turfRepo.findAll();

        List<TurfResponse> responses = new ArrayList<>();

        for(Turf turf:turfs){
            TurfResponse turfResponse = mapToResponse(turf);

            responses.add(turfResponse);
        }
        return responses;
    }

    public List<TurfResponse> getAllTurfsByOwner(String email) {
        List<Turf> turfs =  turfRepo.findByOwner_Email(email);
        List<TurfResponse> responses = new ArrayList<>();

        for (Turf turf : turfs) {

            responses.add(
                    TurfResponse.builder()
                            .id(turf.getId())
                            .name(turf.getName())
                            .location(turf.getLocation())
                            .sportType(turf.getSportType())
                            .imageUrl(turf.getImageUrl())
                            .pricePerHour(turf.getPricePerHour())
                            .rating(turf.getRating())
                            .totalReviews(turf.getTotalReviews())
                            .startTime(!turf.getSlots().isEmpty() ? turf.getSlots().get(0).getStartTime():null)
                            .endTime(!turf.getSlots().isEmpty() ? turf.getSlots().get(turf.getSlots().size()-1).getEndTime():null)
                            .build()
            );
        }

        return responses;
    }

    public TurfResponse getTurfById(Long turfId) {
        Turf turf = turfRepo.findById(turfId).orElseThrow(()-> new RuntimeException("Turf Not Found"));

        List<Review> reviews = reviewRepo.findByTurf_Id(turfId);
        List<OwnerReviewResponse> reviewResponses = new ArrayList<>();
        for(Review reviewResponse : reviews){
            reviewResponses.add(
                    OwnerReviewResponse.builder().playerName(reviewResponse.getPlayer().getName())
                            .comment(reviewResponse.getComment()).build()
            );
        }
        return   TurfResponse.builder().id(turf.getId())
                .name(turf.getName())
                .sportType(turf.getSportType())
                .location(turf.getLocation())
                .totalReviews(turf.getTotalReviews())
                .rating(turf.getRating())
                .imageUrl(turf.getImageUrl())
                .pricePerHour(turf.getPricePerHour())
                .reviews(reviewResponses)
                .startTime(turf.getSlots().get(0).getStartTime())
                .endTime(turf.getSlots().get(turf.getSlots().size()-1).getEndTime())
                .build();
    }

    public List<TurfResponse> findTurfsByLocation(String location) {
        List<Turf> turfs = turfRepo.findByLocationContainingIgnoreCase(location);
        List<TurfResponse> responses = new ArrayList<>();

        for (Turf turf : turfs) {

            responses.add(
                    TurfResponse.builder()
                            .id(turf.getId())
                            .name(turf.getName())
                            .location(turf.getLocation())
                            .sportType(turf.getSportType())
                            .imageUrl(turf.getImageUrl())
                            .pricePerHour(turf.getPricePerHour())
                            .rating(turf.getRating())
                            .totalReviews(turf.getTotalReviews())
                            .build()
            );
        }
        return responses;

    }



    private TurfResponse mapToResponse(Turf turf) {

        return TurfResponse.builder()
                .id(turf.getId())
                .name(turf.getName())
                .location(turf.getLocation())
                .pricePerHour(turf.getPricePerHour())
                .sportType(turf.getSportType())
                .imageUrl(turf.getImageUrl())
                .rating(turf.getRating())
                .totalReviews(turf.getTotalReviews())
                .build();
    }



}
