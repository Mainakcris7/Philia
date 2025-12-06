package com.mainak.philia.service;

import com.mainak.philia.exception.AppException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class EmailService {
     private final JavaMailSender mailSender;

    public void sendOtpForEmailVerification(String email, String otp) {
        log.info("Sending email to: {}" , email);
        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

            helper.setTo(email);
            helper.setSubject("Philia Email Verification OTP");

            String htmlContent = generateEmailContent(otp);
            helper.setText(htmlContent, true); // 'true' enables HTML

            mailSender.send(message);
        }catch (MessagingException ex){
            log.error("Unable to send email to: {}", email);
            throw new AppException("Unable to send email to: " + email, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        log.info("Email sent to: {} for OTP verification", email);
    }

    private String generateEmailContent(String otp) {
        String emailBody = """
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
                        <h2 style="color: #2c3e50; text-align: center;">Philia Email Verification</h2>
                        <p style="font-size: 16px; color: #333333;">Hi User,</p>
                        <p style="font-size: 16px; color: #333333;">
                            Your One-Time Password (OTP) for email verification is:
                        </p>
                        <div style="text-align: center; margin: 25px 0;">
                            <span style="display: inline-block; background-color: #eaf6ff; color: #007bff; font-size: 24px; font-weight: bold; letter-spacing: 3px; padding: 10px 20px; border-radius: 8px;">
                                %s
                            </span>
                        </div>
                        <p style="font-size: 15px; color: #555555;">
                            This OTP is valid for <b>2 minutes</b>.
                        </p>
                        <p style="font-size: 15px; color: #555555;">
                            If you did not request this, please ignore this email.
                        </p>
                        <hr style="border: none; border-top: 1px solid #dddddd; margin: 25px 0;">
                        <p style="font-size: 14px; color: #888888; text-align: center;">
                            Regards,<br>
                            <b style="color: #007bff;">Philia Team</b>
                        </p>
                    </div>
                </body>
            </html>
            """;
        return String.format(emailBody, otp);
    }

}
