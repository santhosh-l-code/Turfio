package com.turfnation.Turfnation_Backend_Project.Repository;

import com.turfnation.Turfnation_Backend_Project.Model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking,Long> {

    List<Booking> findByBookingDateAndSlot_Turf_Id(LocalDate bookingDate, Long turfId);

    boolean existsByBookingDateAndSlot_Id(LocalDate bookingDate,Long slotId);

    List<Booking> findByPlayer_Email(String email);

    boolean existsByPlayer_IdAndSlot_Turf_Id(Long id, Long id1);

    boolean existsByPlayer_IdAndSlot_Turf_IdAndBookingDateBefore(Long id, Long id1, LocalDate now);

    List<Booking> findBySlot_Turf_Id(Long turfId);

    List<Booking> findByPlayer_Id(Long playerId);

    List<Booking> findBySlot_Turf_Owner_Email(String email);

    List<Booking> findByPlayer_IdAndBookingDateGreaterThanEqual(Long id, LocalDate now);

    List<Booking> findByPlayer_IdAndBookingDateBefore(Long id, LocalDate now);

    boolean existsBySlot_Id(Long id);

    boolean existsBySlot_Turf_IdAndBookingDateAfter(Long turfId, LocalDate now);
}
