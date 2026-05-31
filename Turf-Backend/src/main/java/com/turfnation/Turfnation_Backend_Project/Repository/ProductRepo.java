package com.turfnation.Turfnation_Backend_Project.Repository;


import com.turfnation.Turfnation_Backend_Project.Model.Product;
import com.turfnation.Turfnation_Backend_Project.Model.SportType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {
    List<Product> findByOwner_Email(String email);

    List<Product> findBySportType(SportType sportType);

    List<Product> findTop5ByOrderByTotalSoldDesc();


    List<Product> findTop5ByOrderByIdDesc();

    List<Product> findTop5BySportTypeIn(ArrayList<SportType> sportTypes);

    List<Product> findTop5ByOrderByPriceDesc();
}
