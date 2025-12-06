package com.mainak.philia.controller;

import com.mainak.philia.dto.comment.CommentCreateDto;
import com.mainak.philia.dto.comment.CommentDto;
import com.mainak.philia.dto.comment.CommentUpdateDto;
import com.mainak.philia.dto.user.UserDto;
import com.mainak.philia.service.CommentService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@AllArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/{id}")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable Long id) {
        return commentService.getCommentById(id);
    }

    @GetMapping("/{commentId}/likes")
    public ResponseEntity<List<UserDto>> getLikesByCommentId(@PathVariable Long commentId) {
        return commentService.getLikesByCommentId(commentId);
    }

    @PostMapping("")
    public ResponseEntity<CommentDto> addCommentToPost(@Valid @RequestBody CommentCreateDto dto) {
        return commentService.addCommentToPost(dto);
    }

    @PutMapping("")
    public ResponseEntity<CommentDto> updateComment(@Valid @RequestBody CommentUpdateDto dto) {
        return commentService.updateComment(dto);
    }

    @PostMapping("/{commentId}/likes/add/{userId}")
    public boolean likeComment(@PathVariable Long commentId, @PathVariable Long userId) {
        return commentService.likeComment(commentId, userId);
    }

    @DeleteMapping("/{commentId}/likes/remove/{userId}")
    public boolean removeLikeFromComment(@PathVariable Long commentId, @PathVariable Long userId) {
        return commentService.removeLikeFromComment(commentId, userId);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteCommentById(@PathVariable Long commentId) {
        return commentService.deleteCommentById(commentId);
    }
}
