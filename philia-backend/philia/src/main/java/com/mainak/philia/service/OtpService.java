package com.mainak.philia.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.mainak.philia.utils.PhiliaUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class OtpService {
    private final EmailService emailService;
    private final Cache<String, String> otpCache;

    public OtpService(EmailService emailService) {
        this.emailService = emailService;
        this.otpCache = Caffeine.newBuilder()
                .expireAfterWrite(2, TimeUnit.MINUTES)
                .maximumSize(10_000)
                .build();
    }

    public void sendOtpToEmail(String email) {
        String otp = PhiliaUtils.generateOtp(6);
        log.info("OTP generated for email: {}", email);
        emailService.sendOtpForEmailVerification(email, otp);
        otpCache.put(email, otp);
    }

    public boolean verifyOtpForEmail(String email, String otp) {
        String storedOtp = otpCache.getIfPresent(email);

        if (storedOtp == null) return false;
        if(storedOtp.equals(otp)){
            log.info("OTP verification successful for email: {}", email);
            otpCache.invalidate(email);
            return true;
        }
        return false;
    }
}
