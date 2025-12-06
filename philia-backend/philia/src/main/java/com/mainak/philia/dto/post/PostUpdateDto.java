package com.mainak.philia.dto.post;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
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
public class PostUpdateDto {
    @NotNull(message = "Post ID cannot be null")
    @Min(value = 1, message = "Post ID must be a positive number")
    private Long id;

    @NotBlank(message = "Caption cannot be blank")
    @NotNull(message = "Caption cannot be null")
    @Size(min = 1, max = 500, message = "Caption must be between 1 and 500 characters")
    private String caption;
}
