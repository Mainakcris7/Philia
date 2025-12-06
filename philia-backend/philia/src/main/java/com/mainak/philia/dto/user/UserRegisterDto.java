package com.mainak.philia.dto.user;

import com.mainak.philia.model.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterDto {
    @NotNull(message = "First name is required")
    @NotBlank(message = "First name cannot be blank")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotNull(message = "Last name is required")
    @NotBlank(message = "Last name cannot be blank")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @Size(max = 255, message = "About must contain at most 255 characters")
    private String about;

    @Valid
    private Address address;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotNull(message = "Email is required")
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email id")
    private String email;

    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$",
             message = "Password must be 8-20 characters long, contain at least one digit, one uppercase letter, one lowercase letter, one special character, and have no whitespace")
    private String password;

     @Pattern(regexp = "^[0-9]{6}$", message = "Invalid OTP format")
     @NotNull(message = "OTP cannot be null")
    private String registrationOtp;
}
