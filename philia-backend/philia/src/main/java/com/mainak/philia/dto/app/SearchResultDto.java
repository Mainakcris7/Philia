package com.mainak.philia.dto.app;

import com.mainak.philia.dto.post.PostDto;
import com.mainak.philia.dto.user.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SearchResultDto {
    private List<UserDto> users;
    private List<PostDto> posts;
}
