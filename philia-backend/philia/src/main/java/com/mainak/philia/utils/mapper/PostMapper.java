package com.mainak.philia.utils.mapper;

import com.mainak.philia.dto.post.PostCreateDto;
import com.mainak.philia.dto.post.PostDto;
import com.mainak.philia.dto.post.PostUpdateDto;
import com.mainak.philia.dto.user.UserDto;
import com.mainak.philia.exception.AppException;
import com.mainak.philia.model.Post;
import com.mainak.philia.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;
import java.util.stream.Collectors;

public class PostMapper {
    public static Post mapToPostFromPostCreateDto(PostCreateDto postCreateDto, User user, MultipartFile postImage){
        Post post = new Post();
        post.setCaption(postCreateDto.getCaption());
        post.setUser(user);
        user.getPosts().add(post);

        if(postImage == null || postImage.isEmpty()){
            return post;
        }

        post.setImageType(postImage.getContentType());
        try{
            post.setImage(postImage.getBytes());
        } catch (Exception e){
            throw new AppException("Error while converting post image to byte array: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return post;
    }

    public static Post updatePostFromPostUpdateDto(Post post, PostUpdateDto dto, MultipartFile postImage){
        post.setCaption(dto.getCaption());

        // Not allowing user to update post image to null/empty (basically can't remove image from post)
        if(postImage == null || postImage.isEmpty()){
            return post;
        }
        post.setImageType(postImage.getContentType());
        try{
            post.setImage(postImage.getBytes());
        } catch (Exception e){
            throw new AppException("Error while converting post image to byte array: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return post;
    }

    public static PostDto mapToPostDto(Post post){
        PostDto postDto = new PostDto();
        postDto.setId(post.getId());
        postDto.setCaption(post.getCaption());
//        postDto.setImage(post.getImage());
        if(post.getImage() == null){
            postDto.setImageUrl(null);
        } else{
            postDto.setImageUrl(String.format("/posts/%d/image", post.getId()));
        }
        postDto.setCreatedAt(post.getCreatedAt());
        postDto.setUser(UserMapper.mapToUserDto(post.getUser()));
        postDto.setPostCommentsUrl(String.format("/posts/%d/comments", post.getId()));

        Set<UserDto> likes = post.getLikes().stream().map(UserMapper::mapToUserDto).collect(Collectors.toSet());

        postDto.setPostLikesUrl(String.format("/posts/%d/likes", post.getId()));
        postDto.setLikesCount((long)likes.size());
        postDto.setCommentsCount((long)post.getComments().size());

        return postDto;
    }
}
