package com.turfnation.Turfnation_Backend_Project.Security;


import com.turfnation.Turfnation_Backend_Project.Model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;

@Service
public class JwtService {

    private final String SECRET = "thisisasecretkeythisisasecretkeythisisasecretkey";

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

//  return Jwts.builder()
//          .setClaims(claims)
//                .setSubject(email)
//                .setIssuedAt(new Date())
//            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
//            .signWith(getSignKey(), SignatureAlgorithm.HS256)
//            .compact();


//    public String extractEmail(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(getSignKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//
    public String extractRole(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public String generateToken(User user){
        HashMap<String,Object> claims = new HashMap<>();
        claims.put("role",user.getRole());
        return Jwts.builder()
                .addClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis()+1000 *60))
                .setExpiration(new Date(System.currentTimeMillis()+1000 * 60 * 60*24))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
