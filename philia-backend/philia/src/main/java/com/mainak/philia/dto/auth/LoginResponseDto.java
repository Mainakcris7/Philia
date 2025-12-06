package com.mainak.philia.dto.auth;

import com.mainak.philia.dto.user.UserResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    private UserResponseDto user;
    private String jwtToken;
}
