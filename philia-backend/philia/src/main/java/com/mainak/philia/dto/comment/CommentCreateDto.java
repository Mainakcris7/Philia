package com.mainak.philia.dto.comment;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreateDto {
    @NotNull(message = "Post ID cannot be null")
    @Min(value = 1, message = "Post ID must be a positive number")
    private Long postId;

    @NotNull(message = "User ID cannot be null")
    @Min(value = 1, message = "User ID must be a positive number")
    private Long userId;

    @NotNull(message = "Comment cannot be null")
    @NotBlank(message = "Comment cannot be blank")
    @Size(min = 1, max = 300, message = "Comment must be between 1 and 300 characters")
    private String content;
}
