package com.mainak.philia.utils;

public class PhiliaUtils {
    public static String generateOtp(int otpLength) {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            int digit = (int) (Math.random() * 10);
            otp.append(digit);
        }
        return otp.toString();
    }
}
