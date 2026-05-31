package com.turfnation.Turfnation_Backend_Project.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOwnerSuggestionMail(
            String toEmail,
            String turfName,
            String sentiment,
            String review,
            String suggestion) {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(toEmail);
        mail.setSubject("Turfnation AI Turf Insight");

        String body;

        if (sentiment.equalsIgnoreCase("BAD")) {
            body =
                    "Turf : " + turfName + "\n\n" +
                            "Player Experience Feedback:\n" +
                            review + "\n\n" +
                            "AI Recommended Fixes:\n" +
                            suggestion + "\n\n" +
                            "Improving these specific areas can increase player satisfaction and ratings.";
        } else {
            body =
                    "Turf : " + turfName + "\n\n" +
                            "Great News! Players are enjoying your turf.\n\n" +
                            "AI Growth Suggestions:\n" +
                            suggestion + "\n\n" +
                            "Applying these strategies can help increase bookings and reputation.";
        }

        mail.setText(body);
        mailSender.send(mail);
    }
}