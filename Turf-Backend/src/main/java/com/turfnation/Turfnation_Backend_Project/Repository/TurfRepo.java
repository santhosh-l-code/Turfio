package com.turfnation.Turfnation_Backend_Project.Repository;

import com.turfnation.Turfnation_Backend_Project.Model.SportType;
import com.turfnation.Turfnation_Backend_Project.Model.Turf;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

public interface TurfRepo extends JpaRepository<Turf,Long> {
    List<Turf> findBySportType(SportType sportType);


    List<Turf> findByOwner_Email(String email);

    List<Turf> findByLocationContainingIgnoreCase(String location);

    List<Turf> findTop5ByOrderByRatingDesc();

    List<Turf> findTop5BySportTypeInOrderByRatingDesc(ArrayList<SportType> sportTypes);

    List<Turf> findTop5BySportTypeOrderByRatingDesc(SportType mostPlayedSport);
}
