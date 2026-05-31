package com.turfnation.Turfnation_Backend_Project.Repository;

import com.turfnation.Turfnation_Backend_Project.Model.TurfSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TurfSlotRepo extends JpaRepository<TurfSlot,Long> {

    List<TurfSlot> findByTurf_Id(Long turfId);
}
