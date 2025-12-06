package com.mainak.philia.controller;

import com.mainak.philia.dto.comment.CommentDto;
import com.mainak.philia.dto.post.PostCreateDto;
import com.mainak.philia.dto.post.PostDto;
import com.mainak.philia.dto.post.PostUpdateDto;
import com.mainak.philia.dto.user.UserDto;
import com.mainak.philia.service.CommentService;
import com.mainak.philia.service.PostService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/posts")
@AllArgsConstructor
public class PostController {
    private final PostService postService;
    private final CommentService commentService;

    @GetMapping("")
    public ResponseEntity<List<PostDto>> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentDto>> getCommentsByPostId(@PathVariable Long postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @GetMapping("/{postId}/likes")
    public ResponseEntity<List<UserDto>> getLikesByPostId(@PathVariable Long postId) {
        return postService.getLikesByPostId(postId);
    }

    @GetMapping("/{postId}/image")
    public ResponseEntity<byte[]> getImageByPostId(@PathVariable Long postId) {
        return postService.getPostImageById(postId);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<PostDto>> getTrendingPosts() {
        return postService.getTop10TrendingPosts();
    }

    @PostMapping("")
    public ResponseEntity<PostDto> createPost(
            @Valid @RequestPart("postData") PostCreateDto dto,
            @RequestPart(value = "postImage", required = false) MultipartFile postImage) {
        return postService.createPost(dto, postImage);
    }

    @PutMapping("")
    public ResponseEntity<PostDto> updatePost(
            @Valid @RequestPart("postData") PostUpdateDto dto,
            @RequestPart(value = "postImage", required = false) MultipartFile postImage) {
        return postService.updatePost(dto, postImage);
    }

    @PostMapping("/{postId}/likes/add/{userId}")
    public boolean likePost(@PathVariable Long postId, @PathVariable Long userId) {
        return postService.likePost(postId, userId);
    }

    @DeleteMapping("/{postId}/likes/remove/{userId}")
    public boolean removeLikeFromPost(@PathVariable Long postId, @PathVariable Long userId) {
        return postService.removeLikeFromPost(postId, userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        return postService.deletePostById(id);
    }
}
