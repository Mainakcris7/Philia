package com.mainak.philia.dto.post;

import com.mainak.philia.dto.comment.CommentDto;
import com.mainak.philia.dto.user.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private Long id;
    private String caption;
    private String imageUrl;
    private UserDto user;
    private Long likesCount;
    private Long commentsCount;
    private String postLikesUrl;
    private String postCommentsUrl;
    private LocalDateTime createdAt;
}
