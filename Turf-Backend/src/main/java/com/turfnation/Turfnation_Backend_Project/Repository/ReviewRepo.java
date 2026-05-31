package com.turfnation.Turfnation_Backend_Project.Repository;

import com.turfnation.Turfnation_Backend_Project.Model.Review;
import com.turfnation.Turfnation_Backend_Project.Model.Turf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review,Long> {


    boolean existsByTurf_IdAndPlayer_Id(Long turfId,Long playerId);

    List<Review> findByTurf_Id(Long turfId);
}
