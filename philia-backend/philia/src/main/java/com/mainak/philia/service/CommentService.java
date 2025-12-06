package com.mainak.philia.service;

import com.mainak.philia.dto.comment.CommentCreateDto;
import com.mainak.philia.dto.comment.CommentDto;
import com.mainak.philia.dto.comment.CommentUpdateDto;
import com.mainak.philia.dto.notification.PhiliaEvent;
import com.mainak.philia.dto.user.UserDto;
import com.mainak.philia.enums.PhiliaEventType;
import com.mainak.philia.exception.AppException;
import com.mainak.philia.model.Comment;
import com.mainak.philia.model.Post;
import com.mainak.philia.model.User;
import com.mainak.philia.repository.CommentRepository;
import com.mainak.philia.repository.PostRepository;
import com.mainak.philia.repository.UserRepository;
import com.mainak.philia.utils.mapper.CommentMapper;
import com.mainak.philia.utils.mapper.UserMapper;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class CommentService {
    private final CommentRepository repo;
    private final PostRepository postRepo;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public ResponseEntity<List<CommentDto>> getCommentsByPostId(Long postId){
        List<CommentDto> comments = repo.findAllByPostIdOrderByCreatedAtDesc(postId).stream().map(CommentMapper::mapToCommentDto).toList();
        return ResponseEntity.ok(comments);
    }

    public ResponseEntity<List<CommentDto>> getCommentsByUserId(Long userId){
        List<CommentDto> comments = repo.findAllByUserId(userId).stream().map(CommentMapper::mapToCommentDto).toList();
        return ResponseEntity.ok(comments);
    }

    public ResponseEntity<CommentDto> getCommentById(Long id){
        Comment comment = repo.findById(id).orElseThrow(() ->
                new AppException("Comment not found with id: " + id, HttpStatus.NOT_FOUND));

        CommentDto commentDto = CommentMapper.mapToCommentDto(comment);
        return ResponseEntity.ok(commentDto);
    }

    public ResponseEntity<List<UserDto>> getLikesByCommentId(Long commentId) {
        Comment comment = repo.findById(commentId).orElseThrow(() -> new AppException("Post not found with id: " + commentId, HttpStatus.NOT_FOUND));
        List<UserDto> likedUsers = comment.getLikes().stream().map(UserMapper::mapToUserDto).toList();
        return ResponseEntity.ok(likedUsers);
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#dto.userId, authentication.name)"
    )
    @Transactional
    public ResponseEntity<CommentDto> addCommentToPost(CommentCreateDto dto){
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() ->
                new AppException("User not found with id: " + dto.getUserId(), HttpStatus.NOT_FOUND));
        Post post = postRepo.findById(dto.getPostId()).orElseThrow(() ->
                new AppException("Post not found with id: " + dto.getPostId(), HttpStatus.NOT_FOUND));

        Comment comment = CommentMapper.mapToCommentFromCommentCreateDto(dto, post, user);
        Comment savedComment = repo.save(comment);
        CommentDto commentDto = CommentMapper.mapToCommentDto(savedComment);

        // If the commenter is not the post owner, send notification
        if(!post.getUser().getId().equals(user.getId())){
            PhiliaEvent postCommentEvent = PhiliaEvent
                    .builder()
                    .eventType(PhiliaEventType.POST_COMMENT)
                    .recipientId(post.getUser().getId())
                    .notifierId(user.getId())
                    .message(String.format(" commented on your post: \"%s\".", comment.getContent()))
                    .link("/posts/" + post.getId())
                    .build();
            eventPublisher.publishEvent(postCommentEvent);
        }

        log.info("New comment on post with id: {} by user with id: {}", dto.getPostId(), dto.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(commentDto);
    }

    @PreAuthorize(
            "@ownerShipSecurity.isCommentOwner(#dto.id, authentication.name)"
    )
    @Transactional
    public ResponseEntity<CommentDto> updateComment(CommentUpdateDto dto){
        Comment comment = repo.findById(dto.getId()).orElseThrow(() ->
                new AppException("Comment not found with id: " + dto.getId(), HttpStatus.NOT_FOUND));
        Comment updatedComment = CommentMapper.updateCommentFromCommentUpdateDto(comment, dto);
        CommentDto commentDto = CommentMapper.mapToCommentDto(updatedComment);

        log.info("Comment updated with id: {}", dto.getId());
        return ResponseEntity.ok(commentDto);
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#userId, authentication.name)"
    )
    @Transactional
    public boolean likeComment(Long commentId, Long userId){
        Comment comment = repo.findById(commentId).orElseThrow(() ->
                new AppException("Comment not found with id: " + commentId, HttpStatus.NOT_FOUND));
        User user = userRepository.findById(userId).orElseThrow(() ->
                new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        comment.addLike(user);
        user.getLikedComments().add(comment);

        // If the comment owner is not the same as the liker, send notification
        if(!comment.getUser().getId().equals(user.getId())){
            PhiliaEvent commentLikedEvent = PhiliaEvent
                    .builder()
                    .eventType(PhiliaEventType.COMMENT_LIKE)
                    .recipientId(comment.getUser().getId())
                    .notifierId(user.getId())
                    .message(String.format(" liked your comment: \"%s\".", comment.getContent()))
                    .link("/posts/" + comment.getPost().getId())
                    .build();
            eventPublisher.publishEvent(commentLikedEvent);
        }

        log.info("Comment liked with id: {} by user with id: {}", commentId, userId);
        return true;
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#userId, authentication.name)"
    )
    @Transactional
    public boolean removeLikeFromComment(Long commentId, Long userId){
        Comment comment = repo.findById(commentId).orElseThrow(() ->
                new AppException("Comment not found with id: " + commentId, HttpStatus.NOT_FOUND));
        User user = userRepository.findById(userId).orElseThrow(() ->
                new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        comment.removeLike(user);
        user.getLikedComments().remove(comment);

        log.info("Like removed from comment with id: {} by user with id: {}", commentId, userId);
        return true;
    }

    @PreAuthorize(
            "@ownerShipSecurity.isCommentOwner(#commentId, authentication.name)"
    )
    @Transactional
    public ResponseEntity<Void> deleteCommentById(Long commentId){
        Comment comment = repo.findById(commentId).orElseThrow(() ->
                new AppException("Comment not found with id: " + commentId, HttpStatus.NOT_FOUND));
        comment.getPost().removeComment(comment);
        repo.delete(comment);

        log.info("Comment deleted with id: {}", commentId);
        return ResponseEntity.noContent().build();
    }
}
