package com.turfnation.Turfnation_Backend_Project.Repository;

import com.turfnation.Turfnation_Backend_Project.Model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepo extends JpaRepository<Purchase,Long> {
}