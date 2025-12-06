package com.mainak.philia.utils.mapper;

import com.mainak.philia.dto.user.UserDto;
import com.mainak.philia.dto.user.UserResponseDto;
import com.mainak.philia.dto.user.UserRegisterDto;
import com.mainak.philia.dto.user.UserUpdateDto;
import com.mainak.philia.exception.AppException;
import com.mainak.philia.model.Comment;
import com.mainak.philia.model.Post;
import com.mainak.philia.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class UserMapper {
    public static User mapToUserFromUserSaveDto(UserRegisterDto userRegisterDto, MultipartFile profileImage){
        User user = new User();
        user.setFirstName(userRegisterDto.getFirstName());
        user.setLastName(userRegisterDto.getLastName());
        user.setAbout(userRegisterDto.getAbout());
        user.setAddress(userRegisterDto.getAddress());
        user.setDateOfBirth(userRegisterDto.getDateOfBirth());
        user.setEmail(userRegisterDto.getEmail());
        user.setPassword(userRegisterDto.getPassword());

        if(profileImage == null || profileImage.isEmpty()){
            return user;
        }
        user.setProfileImageType(profileImage.getContentType());
        try{
            user.setProfileImage(profileImage.getBytes());
        } catch (Exception e){
            throw new AppException("Error while converting profile image to byte array: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return user;
    }

    public static User updateUserFromUserUpdateDto(User user, UserUpdateDto updateDto){
        user.setFirstName(updateDto.getFirstName());
        user.setLastName(updateDto.getLastName());
        user.setAbout(updateDto.getAbout());
        user.setAddress(updateDto.getAddress());
        user.setDateOfBirth(updateDto.getDateOfBirth());
        return user;
    }

    public static UserDto mapToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        if(user.getProfileImage() == null){
            userDto.setProfileImageUrl(null);
        } else{
            userDto.setProfileImageUrl(String.format("/users/profile/%d/image", user.getId()));
        }
        return userDto;
    }

    public static UserResponseDto mapToUserResponseDto(User user) {
        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setId(user.getId());
        userResponseDto.setFirstName(user.getFirstName());
        userResponseDto.setLastName(user.getLastName());
        userResponseDto.setEmail(user.getEmail());
        userResponseDto.setAbout(user.getAbout());
        userResponseDto.setAddress(user.getAddress());
        userResponseDto.setDateOfBirth(user.getDateOfBirth());
        userResponseDto.setCreatedAt(user.getCreatedAt());

        if(user.getProfileImage() == null){
            userResponseDto.setProfileImageUrl(null);
        } else{
            userResponseDto.setProfileImageUrl(String.format("/users/profile/%d/image", user.getId()));
        }

        Long friendsCount = (long) user.getFriends().size();

        Set<Long> postLikedIds = user.getLikedPosts().stream().map(Post::getId).collect(Collectors.toSet());
        Set<Long> commentLikedIds = user.getLikedComments().stream().map(Comment::getId).collect(Collectors.toSet());

        userResponseDto.setUserPostsUrl(String.format("/users/profile/%d/posts", user.getId()));
        userResponseDto.setUserCommentsUrl(String.format("/users/%d/comments", user.getId()));
        userResponseDto.setFriendsUrl(String.format("/users/%d/friends", user.getId()));
        userResponseDto.setFriendsCount(friendsCount);
        userResponseDto.setLikedPostIds(postLikedIds);
        userResponseDto.setLikedCommentIds(commentLikedIds);

        return userResponseDto;
    }
}
