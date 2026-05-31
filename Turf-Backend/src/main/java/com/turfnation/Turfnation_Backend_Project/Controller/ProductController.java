package com.turfnation.Turfnation_Backend_Project.Controller;


import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.BuyProductRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.ProductRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.ProductResponse;
import com.turfnation.Turfnation_Backend_Project.Model.SportType;
import com.turfnation.Turfnation_Backend_Project.Service.CloudinaryService;
import com.turfnation.Turfnation_Backend_Project.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/upload-image")
    public Map<String, String> uploadProductImage(
            @RequestParam("file") MultipartFile file) {

        String url = cloudinaryService.uploadImage(file);

        return Map.of("imageUrl", url);
    }

    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/add")
    public ProductResponse addProduct(
            @RequestBody ProductRequest request,
            Authentication authentication){

        String email = authentication.getName();

        return
                productService.addProduct(request,email);
    }

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/owner")
    public List<ProductResponse> getOwnerProducts(
            Authentication authentication){

        String email = authentication.getName();

        return productService.getOwnerProducts(email);
    }

    @GetMapping("/sport/{sportType}")
    public List<ProductResponse> getProductsBySport(
            @PathVariable SportType sportType){


        return productService.getProductsBySport(sportType);
    }

    @PreAuthorize("hasRole('PLAYER')")
    @PostMapping("/buy")
    public String buyProduct(
            @RequestBody BuyProductRequest request,
            Authentication authentication){

        String email = authentication.getName();

        return productService.buyProduct(email,request);
    }

    @PreAuthorize("hasRole('PLAYER')")
    @GetMapping("/recommendation")
    public List<ProductResponse> recommendProducts(
            Authentication authentication){

        String email = authentication.getName();

        return productService.recommendProducts(email);
    }

    @PreAuthorize("hasRole('PLAYER')")
    @GetMapping("/all")
    public List<ProductResponse> getAllProducts(){
        return productService.getAllProducts();

    }
}
