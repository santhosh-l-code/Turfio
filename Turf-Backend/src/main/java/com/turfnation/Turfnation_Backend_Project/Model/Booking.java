package com.turfnation.Turfnation_Backend_Project.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate bookingDate;

    @ManyToOne
    @JoinColumn(name = "slot_id")
    private TurfSlot slot;


    @ManyToOne
    @JoinColumn(name = "player_id")
    private User player;




}
