package com.mainak.philia.controller;

import com.mainak.philia.dto.auth.LoginResponseDto;
import com.mainak.philia.dto.comment.CommentDto;
import com.mainak.philia.dto.notification.PhiliaNotificationDto;
import com.mainak.philia.dto.post.PostDto;
import com.mainak.philia.dto.user.*;
import com.mainak.philia.service.CommentService;
import com.mainak.philia.service.NotificationService;
import com.mainak.philia.service.PostService;
import com.mainak.philia.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.events.Comment;
import java.util.List;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {
    private final UserService service;
    private final PostService postService;
    private final CommentService commentService;
    private final NotificationService notificationService;

    @GetMapping("")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return service.getAllUsers();
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @GetMapping("/profile/{id}/image")
    public ResponseEntity<byte[]> getUserProfileImageById(@PathVariable Long id) {
        return service.getUserProfileImageById(id);
    }

    @GetMapping("/profile/{id}/posts")
    public ResponseEntity<List<PostDto>> getPostsByUserId(@PathVariable Long id) {
        return postService.getPostsByUserId(id);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentDto>> getCommentsByUserId(@PathVariable Long id) {
        return commentService.getCommentsByUserId(id);
    }

    @GetMapping("/{id}/friends")
    public ResponseEntity<List<UserDto>> getFriendsByUserId(@PathVariable Long id) {
        return service.getFriendsByUserId(id);
    }

    @GetMapping("/{id}/friends/suggestions")
    public ResponseEntity<List<FriendSuggestionDto>> getFriendSuggestions(@PathVariable Long id) {
        return service.getFriendSuggestions(id);
    }

    // Get current logged-in user details
    @GetMapping("/auth/me")
    public ResponseEntity<UserResponseDto> getLoggedInUserDetails(){
        return service.getLoggedInUser();
    }

    @GetMapping("/auth/pre-register/otp/send")
    public ResponseEntity<Void> sendOtpToEmail(@RequestParam String email){
        return service.sendOtpToEmail(email);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponseDto> loginUser(@RequestBody UserLoginDto loginDto) {
        return service.loginUser(loginDto);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<Void> registerUser(
            @Valid @RequestPart("userData") UserRegisterDto dto,
            @RequestPart(name = "profileImage", required = false) MultipartFile profileImage
    ) {
        return service.createUser(dto, profileImage);
    }

    @PutMapping("")
    public ResponseEntity<Void> updateUser(
            @Valid @RequestBody UserUpdateDto dto
    ) {
        return service.updateUser(dto);
    }

    @PutMapping("/profile/{id}/image")
    public ResponseEntity<String> updateUserProfileImage(
            @PathVariable Long id,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        return service.updateProfileImage(id, profileImage);
    }

    @PostMapping("/{userID}/friends/send/{friendId}")
    public boolean sendFriendRequest(@PathVariable Long userID, @PathVariable Long friendId) {
        return service.sendFriendRequest(userID, friendId);
    }

    @PatchMapping("/{userId}/friends/accept/{senderId}")
    public boolean acceptFriendRequest(@PathVariable Long userId, @PathVariable Long senderId) {
        return service.acceptFriendRequest(userId, senderId);
    }

    @DeleteMapping("/{userId}/friends/reject/{senderId}")
    public boolean rejectFriendRequest(@PathVariable Long userId, @PathVariable Long senderId) {
        return service.rejectFriendRequest(userId, senderId);
    }

    @DeleteMapping("/{userId}/friends/cancel/{receiverId}")
    public boolean cancelFriendRequest(@PathVariable Long userId, @PathVariable Long receiverId) {
        return service.cancelFriendRequest(userId, receiverId);
    }

    @DeleteMapping("/{userId}/friends/remove/{friendId}")
    public boolean removeFriend(@PathVariable Long userId, @PathVariable Long friendId) {
        return service.removeFriend(userId, friendId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        return service.deleteUserById(id);
    }

    // Notification Endpoints
    @GetMapping("/{id}/notifications")
    public List<PhiliaNotificationDto> getAllNotificationsForUser(@PathVariable Long id) {
        return notificationService.getAllNotificationsByRecipientId(id);
    }

    @PostMapping("/{userId}/notifications/read/all")
    public boolean readAllNotificationsForUser(
            @PathVariable Long userId) {
        return notificationService.markNotificationsAsRead(userId);
    }

    @PostMapping("/{userId}/notifications/read/{notificationId}")
    public ResponseEntity<Boolean> readNotificationById(@PathVariable Long userId, @PathVariable Long notificationId) {
        return notificationService.markNotificationAsRead(notificationId, userId);
    }

    @DeleteMapping("/{userId}/notifications/delete/{notificationId}")
    public ResponseEntity<Void> deleteNotificationById(@PathVariable Long userId, @PathVariable Long notificationId) {
        return notificationService.deleteNotificationById(userId, notificationId);
    }

    @DeleteMapping("/{userId}/notifications/delete/all")
    public ResponseEntity<Void> clearAllNotifications(@PathVariable Long userId) {
        return notificationService.deleteAllNotificationsByRecipientId(userId);
    }
}
