package com.mainak.philia.service;

import com.mainak.philia.dto.app.SearchResultDto;
import com.mainak.philia.dto.post.PostDto;
import com.mainak.philia.dto.user.UserDto;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class AppService {
    private final UserService userService;
    private final PostService postService;

    public SearchResultDto searchByKeyword(String keyword){
        List<UserDto> users = userService.searchUsersByKeyword(keyword);
        List<PostDto> posts = postService.searchPostsByKeyword(keyword);

        log.info("Searching by keyword: {}", keyword);
        return new SearchResultDto(users, posts);
    }

}
