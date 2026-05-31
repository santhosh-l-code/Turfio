package com.turfnation.Turfnation_Backend_Project.Repository;

import com.turfnation.Turfnation_Backend_Project.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);

}
