package com.turfnation.Turfnation_Backend_Project.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.turfnation.Turfnation_Backend_Project.Dto.RequestDTO.ReviewRequest;
import com.turfnation.Turfnation_Backend_Project.Dto.ResponseDTO.AiReviewResponse;
import com.turfnation.Turfnation_Backend_Project.Model.Review;
import com.turfnation.Turfnation_Backend_Project.Model.Turf;
import com.turfnation.Turfnation_Backend_Project.Model.User;
import com.turfnation.Turfnation_Backend_Project.Repository.BookingRepo;
import com.turfnation.Turfnation_Backend_Project.Repository.ReviewRepo;
import com.turfnation.Turfnation_Backend_Project.Repository.TurfRepo;
import com.turfnation.Turfnation_Backend_Project.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TurfRepo turfRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private EmailService emailService;

    public String addReview(ReviewRequest request, String email) {

        // 1️⃣ Find Player
        User player = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Player Not Found"));

        // 2️⃣ Find Turf
        Turf turf = turfRepo.findById(request.getTurfId())
                .orElseThrow(() -> new RuntimeException("Turf Not Found"));

        // 3️⃣ Prevent Duplicate Review
        if (reviewRepo.existsByTurf_IdAndPlayer_Id(turf.getId(), player.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You already reviewed this turf"
            );
        }

        // 4️⃣ Allow review only after match played
        boolean hasCompletedBooking =
                bookingRepo.existsByPlayer_IdAndSlot_Turf_IdAndBookingDateBefore(
                        player.getId(),
                        turf.getId(),
                        LocalDate.now()
                );

        if (!hasCompletedBooking) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You can review only after playing"
            );
        }

        // 5️⃣ Build AI Prompt
        String aiPrompt = """
                You are a professional sports turf facility consultant.
                
                Sport Type: %s
                
                Player Review:
                "%s"
                
                Tasks:
                
                1. Detect sentiment STRICTLY → GOOD or BAD
                
                2. If BAD:
                   - Identify exact problems mentioned
                   - Suggest highly SPECIFIC solutions relevant to the sport
                   - Mention real equipment brands or facility upgrades related to that sport
                
                3. If GOOD:
                   - Appreciate strengths
                   - Suggest ideas to increase bookings and improve player experience
                
                Rules:
                - Suggestions MUST be sport specific
                - Do NOT give cricket suggestions for tennis turf
                - Give minimum 2 actionable improvements
                
                IMPORTANT: Return ONLY raw JSON. No markdown, no code fences, no explanation.
                
                {
                 "sentiment":"BAD",
                 "score":0.3,
                 "ownerMessage":"Example suggestion"
                }
                """.formatted(turf.getSportType(), request.getComment());

        // 6️⃣ Call Gemini
        String aiResponse = null;
        try {
            aiResponse = geminiService.ask(aiPrompt).block();
            System.out.println("=============================");
            System.out.println("RAW AI RESPONSE: " + aiResponse);
            System.out.println("=============================");
        } catch (Exception e) {
            System.out.println("GEMINI CALL FAILED: " + e.getMessage());
            e.printStackTrace();
        }

        // 7️⃣ Defaults
        String sentiment = "BAD";
        double sentimentScore = 0.4;
        String ownerMessage = "Improve facility maintenance and equipment quality.";

        // 8️⃣ Parse AI Response
        if (aiResponse != null) {
            try {
                String cleanedResponse = aiResponse
                        .replaceAll("```json", "")
                        .replaceAll("```", "")
                        .trim();

                System.out.println("CLEANED RESPONSE: " + cleanedResponse);

                ObjectMapper mapper = new ObjectMapper();
                AiReviewResponse ai = mapper.readValue(cleanedResponse, AiReviewResponse.class);

                System.out.println("PARSED SENTIMENT: " + ai.getSentiment());
                System.out.println("PARSED SCORE: " + ai.getScore());
                System.out.println("PARSED MESSAGE: " + ai.getOwnerMessage());

                sentiment = ai.getSentiment();
                sentimentScore = ai.getScore();
                ownerMessage = ai.getOwnerMessage();

            } catch (Exception e) {
                System.out.println("AI PARSING FAILED REASON: " + e.getMessage());
                System.out.println("RAW AI RESPONSE WAS: " + aiResponse);

                // Keyword fallback
                String commentLower = request.getComment().toLowerCase();
                if (commentLower.contains("bad")
                        || commentLower.contains("broken")
                        || commentLower.contains("poor")
                        || commentLower.contains("worst")
                        || commentLower.contains("not good")) {
                    sentiment = "BAD";
                } else {
                    sentiment = "GOOD";
                    sentimentScore = 0.75;
                }
            }
        }

        // 9️⃣ Calculate Rating
        double rating = sentimentScore * 5;

        // 🔟 Save Review
        Review review = Review.builder()
                .comment(request.getComment())
                .turf(turf)
                .sentimentScore(sentimentScore)
                .generatedRating(rating)
                .player(player)
                .build();

        reviewRepo.save(review);

        // 1️⃣1️⃣ Send Mail to Owner
        emailService.sendOwnerSuggestionMail(
                turf.getOwner().getEmail(),
                turf.getName(),
                sentiment,
                request.getComment(),
                ownerMessage
        );

        // 1️⃣2️⃣ Update Turf Rating
        int currentTotalReviews = turf.getTotalReviews() == null ? 0 : turf.getTotalReviews();
        double currentRating = turf.getRating() == null ? 0.0 : turf.getRating();

        int newTotalReviews = currentTotalReviews + 1;
        double newRating = ((currentRating * currentTotalReviews) + rating) / newTotalReviews;

        turf.setTotalReviews(newTotalReviews);
        turf.setRating(newRating);
        turfRepo.save(turf);

        return "Review Added + Owner Notified";
    }
}