package com.mainak.philia.dto.user;

import com.mainak.philia.model.Address;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String profileImageUrl;
    private String email;
    private String about;
    private Address address;
    private String userPostsUrl;
    private String userCommentsUrl;
    private String friendsUrl;
    private Long friendsCount;
    private List<FriendRequestDto> sentFriendRequests;
    private List<FriendRequestDto> receivedFriendRequests;
    private Set<Long> likedPostIds;
    private Set<Long> likedCommentIds;
    private LocalDate dateOfBirth;
    private LocalDateTime createdAt;
}
