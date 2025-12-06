package com.mainak.philia.security;

import com.mainak.philia.exception.AppException;
import com.mainak.philia.repository.CommentRepository;
import com.mainak.philia.repository.NotificationRepository;
import com.mainak.philia.repository.PostRepository;
import com.mainak.philia.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service("ownerShipSecurity")
@AllArgsConstructor
public class OwnershipSecurity {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final NotificationRepository notificationRepository;


    // For - updateUser, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend, deleteUserById, likePost, removeLikeFromPost, likeComment, removeLikeFromComment
    public boolean isSameUser(Long receivedUserId, String expectedUserEmail){
        Long expectedUserId = userRepository.findByEmail(expectedUserEmail).orElseThrow(
                () -> new AppException("User not found with email: " + expectedUserEmail, HttpStatus.NOT_FOUND))
                .getId();
        return receivedUserId.equals(expectedUserId);
    }

    // For - deletePost, updatePost
    public boolean isPostOwner(Long postId, String loggedInUserEmail){
        Long postOwnerId = postRepository.findById(postId).orElseThrow(
                () -> new AppException("Post not found with id: " + postId, HttpStatus.NOT_FOUND))
                .getUser().getId();
        Long expectedUserId = userRepository.findByEmail(loggedInUserEmail).orElseThrow(
                        () -> new AppException("User not found with email: " + loggedInUserEmail, HttpStatus.NOT_FOUND))
                .getId();
        return postOwnerId.equals(expectedUserId);
    }

    // For - deleteComment, updateComment
    public boolean isCommentOwner(Long commentId, String loggedInUserEmail) {
        Long commentOwnerId = commentRepository.findById(commentId).orElseThrow(
                        () -> new AppException("Comment not found with id: " + commentId, HttpStatus.NOT_FOUND))
                .getUser().getId();
        Long expectedUserId = userRepository.findByEmail(loggedInUserEmail).orElseThrow(
                        () -> new AppException("User not found with email: " + loggedInUserEmail, HttpStatus.NOT_FOUND))
                .getId();
        return commentOwnerId.equals(expectedUserId);
    }

    public boolean isNotificationOwner(Long notificationId, String loggedInUserEmail) {
        Long notificationOwnerId = notificationRepository.findById(notificationId).orElseThrow(
                        () -> new AppException("Notification not found with id: " + notificationId, HttpStatus.NOT_FOUND))
                .getRecipientId();
        Long expectedUserId = userRepository.findByEmail(loggedInUserEmail).orElseThrow(
                        () -> new AppException("User not found with email: " + loggedInUserEmail, HttpStatus.NOT_FOUND))
                .getId();
        return notificationOwnerId.equals(expectedUserId);
    }
}
