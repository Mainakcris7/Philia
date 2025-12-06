package com.mainak.philia.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestDto {
    private UserDto user;
    private LocalDateTime sentAt;
}
