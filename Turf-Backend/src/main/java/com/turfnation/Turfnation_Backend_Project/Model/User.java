package com.turfnation.Turfnation_Backend_Project.Model;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "users")

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String password;

    @Column(unique = true)
    private String email;

    @Enumerated(value = EnumType.STRING)
    private Role role;

    private String phone;

    private String status;

//    @OneToMany(mappedBy = "owner")
//    private List<Turf> turfList;
//
//    @OneToMany(mappedBy = "player")
//    private List<Booking> bookings;
//
//    @OneToMany(mappedBy = "owner")
//    private List<Product> products;  Not Neceesary

}
