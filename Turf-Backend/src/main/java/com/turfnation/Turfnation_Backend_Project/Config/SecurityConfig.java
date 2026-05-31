package com.turfnation.Turfnation_Backend_Project.Config;


import com.turfnation.Turfnation_Backend_Project.Security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers("/api/auth/**",
                                        "/api/turf/game/**",
                                        "/api/turf/allTurfs",
                                        "/api/turf/{turfId}",
                                        "/api/review/turf/**",
                                        "/api/turf/{turfId}/slots",
                                        "/api/product/sport/{sportType}"
                                ).permitAll()
                        .requestMatchers("/api/owner/turf/{turfId}/reviews").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
