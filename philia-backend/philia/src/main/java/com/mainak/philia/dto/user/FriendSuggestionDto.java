package com.mainak.philia.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendSuggestionDto {
    private UserDto user;
    private int mutualConnectionsCount;
}
