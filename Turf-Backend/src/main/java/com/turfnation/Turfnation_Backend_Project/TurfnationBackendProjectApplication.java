package com.turfnation.Turfnation_Backend_Project;

import com.turfnation.Turfnation_Backend_Project.Model.TestClass;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TurfnationBackendProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(TurfnationBackendProjectApplication.class, args);
		TestClass t = TestClass.builder().name("Hello").build();
	}

}
