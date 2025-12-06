package com.mainak.philia.dto.comment;

import com.mainak.philia.dto.user.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private Long id;
    private Long postId;
    private String content;
    private UserDto user;
    private Long likesCount;
    private String commentLikesUrl;
    private LocalDateTime createdAt;
}
