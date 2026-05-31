package com.turfnation.Turfnation_Backend_Project.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Turf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String imageUrl;

    private String location;

    private double pricePerHour;

    @Enumerated(EnumType.STRING)
    private SportType sportType;   // ⭐ important field

    private Double rating;

    private Integer totalReviews;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "turf", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TurfSlot> slots;
}