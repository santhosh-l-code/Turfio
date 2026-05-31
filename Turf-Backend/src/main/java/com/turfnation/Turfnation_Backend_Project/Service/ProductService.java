package com.turfnation.Turfnation_Backend_Project.Service;


import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.BuyProductRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.ProductRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.ProductResponse;
import com.turfnation.Turfnation_Backend_Project.Model.*;
import com.turfnation.Turfnation_Backend_Project.Repository.BookingRepo;
import com.turfnation.Turfnation_Backend_Project.Repository.ProductRepo;
import com.turfnation.Turfnation_Backend_Project.Repository.PurchaseRepo;
import com.turfnation.Turfnation_Backend_Project.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PurchaseRepo purchaseRepo;

    @Autowired
    private BookingRepo bookingRepo;


    public ProductResponse addProduct(ProductRequest request,String email){
        User owner = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .sportType(request.getSportType())
                .imageUrl(request.getImageUrl()) // ⭐ IMPORTANT
                .owner(owner)
                .build();

        productRepo.save(product);

        return mapToResponse(product);
    }

    public List<ProductResponse> getOwnerProducts(String email){

        List<Product> products =
                productRepo.findByOwner_Email(email);

        List<ProductResponse> responses =
                new ArrayList<>();

        for(Product product : products){

            responses.add(
                    ProductResponse.builder()
                            .id(product.getId())
                            .name(product.getName())
                            .description(product.getDescription())
                            .price(product.getPrice())
                            .stock(product.getStock())
                            .sportType(product.getSportType())
                            .build()
            );
        }

        return responses;
    }

    public List<ProductResponse> getProductsBySport(SportType sportType){

        List<Product> products =
                productRepo.findBySportType(sportType);

        List<ProductResponse> responses =
                new ArrayList<>();

        for(Product product : products){

            responses.add(
                    ProductResponse.builder()
                            .id(product.getId())
                            .name(product.getName())
                            .description(product.getDescription())
                            .price(product.getPrice())
                            .stock(product.getStock())
                            .sportType(product.getSportType())
                            .build()
            );
        }

        return responses;
    }

    public String buyProduct(String email, BuyProductRequest request){

        User player = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Player Not Found"));

        Product product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        if(product.getStock() < request.getQuantity()){
            throw new RuntimeException("Not enough stock");
        }

        product.setStock(
                product.getStock() - request.getQuantity()
        );

        productRepo.save(product);

        Purchase purchase = Purchase.builder()
                .player(player)
                .product(product)
                .quantity(request.getQuantity())
                .purchaseTime(LocalDateTime.now())
                .build();

        product.setTotalSold(
                product.getTotalSold() == null
                        ? 1
                        : product.getTotalSold() + 1
        );

        productRepo.save(product);

        purchaseRepo.save(purchase);

        return "Product Purchased Successfully";
    }


    public List<ProductResponse> recommendProducts(String email){

        User player = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Player Not Found"));

        List<Booking> bookings =
                bookingRepo.findByPlayer_Id(player.getId());

        // ⭐ Cold Start Case
        if(bookings.isEmpty()){

            List<Product> popularProducts =
                    productRepo.findTop5ByOrderByTotalSoldDesc();

            return popularProducts.stream()
                    .map(this::mapToResponse)
                    .toList();
        }

        // ⭐ Normal Recommendation Case
        Map<SportType,Integer> sportCount = new HashMap<>();

        for(Booking booking : bookings){

            SportType sport =
                    booking.getSlot()
                            .getTurf()
                            .getSportType();

            sportCount.put(
                    sport,
                    sportCount.getOrDefault(sport,0) + 1
            );
        }

        SportType mostPlayedSport =
                Collections.max(
                        sportCount.entrySet(),
                        Map.Entry.comparingByValue()
                ).getKey();

        List<Product> products =
                productRepo.findBySportType(mostPlayedSport);

        return products.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ProductResponse mapToResponse(Product product){

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .stock(product.getStock())
                .sportType(product.getSportType())
                .build();
    }


    public List<ProductResponse> getAllProducts() {

        List<Product> products = productRepo.findAll();
        List<ProductResponse> responses = new ArrayList<>();

        for(Product product:products){
            responses.add(ProductResponse.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .price(product.getPrice())
                    .description(product.getDescription())
                    .stock(product.getStock())
                    .sportType(product.getSportType())
                    .build());
        }
        return responses;
    }
}
