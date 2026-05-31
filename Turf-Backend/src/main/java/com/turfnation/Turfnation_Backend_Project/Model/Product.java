package com.turfnation.Turfnation_Backend_Project.Model;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String imageUrl;

    private String description;

    private Double price;

    private Integer stock;

    @Enumerated(EnumType.STRING)
    private SportType sportType;

    private Integer totalSold;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
}
