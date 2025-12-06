package com.mainak.philia.service;

import com.mainak.philia.dto.notification.PhiliaEvent;
import com.mainak.philia.dto.post.PostCreateDto;
import com.mainak.philia.dto.post.PostDto;
import com.mainak.philia.dto.post.PostUpdateDto;
import com.mainak.philia.dto.user.UserDto;
import com.mainak.philia.enums.PhiliaEventType;
import com.mainak.philia.exception.AppException;
import com.mainak.philia.model.Post;
import com.mainak.philia.model.User;
import com.mainak.philia.repository.PostRepository;
import com.mainak.philia.repository.UserRepository;
import com.mainak.philia.utils.mapper.PostMapper;
import com.mainak.philia.utils.mapper.UserMapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.MediaType;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class PostService {
    private final PostRepository repo;
    private final UserRepository userRepo;
    private final ApplicationEventPublisher eventPublisher;

    public ResponseEntity<List<PostDto>> getAllPosts() {
        List<PostDto> posts = new ArrayList<>(repo.findAllByOrderByCreatedAtDesc().stream().map(PostMapper::mapToPostDto).toList());
        if(posts.isEmpty()) {
            throw new AppException("No posts found", HttpStatus.NOT_FOUND);
        }
        // If the user is not authenticated, return random 10 posts
        if(!SecurityContextHolder.getContext().getAuthentication().isAuthenticated()){
            Collections.shuffle(posts);
            List<PostDto> random10posts = posts.stream().limit(10).toList();
            return ResponseEntity.ok(random10posts);
        }
        return ResponseEntity.ok(posts);
    }

    public ResponseEntity<PostDto> getPostById(Long id) {
        Post post = repo.findById(id).orElseThrow(() -> new AppException("Post not found with id: " + id, HttpStatus.NOT_FOUND));
        PostDto postDto = PostMapper.mapToPostDto(post);
        return ResponseEntity.ok(postDto);
    }

    public ResponseEntity<List<PostDto>> getPostsByUserId(Long userId){
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));
        List<Post> userPosts = repo.findAllByUserIdOrderByCreatedAtDesc(user.getId());

        List<PostDto> posts = userPosts.stream().map(PostMapper::mapToPostDto).toList();

        log.info("Get posts by user id: {}", userId);
        return ResponseEntity.ok(posts);
    }

    public ResponseEntity<byte[]> getPostImageById(Long id) {
        Post post = repo.findById(id).orElseThrow(() -> new AppException("Post not found with id: " + id, HttpStatus.NOT_FOUND));

        if(post.getImage() == null){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(post.getImageType()))
                .body(post.getImage());
    }

    public ResponseEntity<List<PostDto>> getTop10TrendingPosts(){
        List<Post> posts = new ArrayList<>(repo.findAll());
        LocalDateTime currTimeStamp = LocalDateTime.now();

        posts.sort((post1, post2) -> {
            long likesAndCommentsCntForPost1 = post1.getComments().size() + post1.getLikes().size();
            long likesAndCommentsCntForPost2 = post2.getComments().size() + post2.getLikes().size();

            long timeElapsedForPost1 = Duration.between(post1.getCreatedAt(), currTimeStamp).toMinutes();
            long timeElapsedForPost2 = Duration.between(post2.getCreatedAt(), currTimeStamp).toMinutes();

            double scoreForPost1 = (likesAndCommentsCntForPost1) / Math.pow((timeElapsedForPost1 + 2), 1.5);
            double scoreForPost2 = (likesAndCommentsCntForPost2) / Math.pow((timeElapsedForPost2 + 2), 1.5);

            // Sort in descending order of score
            return Double.compare(scoreForPost2, scoreForPost1);
        });

        List<PostDto> top10TrendingPosts = posts.stream()
                .limit(10)
                .map(PostMapper::mapToPostDto)
                .toList();

        return ResponseEntity.ok(top10TrendingPosts);
    }

    public ResponseEntity<List<UserDto>> getLikesByPostId(Long postId) {
        Post post = repo.findById(postId).orElseThrow(() -> new AppException("Post not found with id: " + postId, HttpStatus.NOT_FOUND));
        List<UserDto> likedUsers = post.getLikes().stream().map(UserMapper::mapToUserDto).toList();
        return ResponseEntity.ok(likedUsers);
    }

    public List<PostDto> searchPostsByKeyword(String keyword) {
        List<Post> posts = repo.findByCaptionContainingIgnoreCaseOrderByCreatedAtDesc(keyword);
        return posts.stream().map(PostMapper::mapToPostDto).toList();
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#dto.userId, authentication.name)"
    )
    @Transactional
    public ResponseEntity<PostDto> createPost(PostCreateDto dto, MultipartFile postImage) {
        User user = userRepo.findById(dto.getUserId()).orElseThrow(() -> new AppException("User not found with id: " + dto.getUserId(), HttpStatus.NOT_FOUND));
        Post post = PostMapper.mapToPostFromPostCreateDto(dto, user, postImage);
        Post savedPost = repo.save(post);
//        userRepo.save(user);
        PostDto postDto = PostMapper.mapToPostDto(savedPost);

        log.info("Create post with id: {} for user with id: {}", savedPost.getId(), dto.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(postDto);
    }

    @PreAuthorize(
            "@ownerShipSecurity.isPostOwner(#dto.id, authentication.name)"
    )
    @Transactional
    public ResponseEntity<PostDto> updatePost(PostUpdateDto dto, MultipartFile postImage) {
        Post post = repo.findById(dto.getId()).orElseThrow(() -> new AppException("Post not found with id: " + dto.getId(), HttpStatus.NOT_FOUND));
        Post updatedPost = PostMapper.updatePostFromPostUpdateDto(post, dto, postImage);
//        Post savedPost = repo.save(updatedPost);
        PostDto postDto = PostMapper.mapToPostDto(updatedPost);

        log.info("Post updated with id: {}", updatedPost.getId());
        return ResponseEntity.ok(postDto);
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#userId, authentication.name)"
    )
    @Transactional
    public boolean likePost(Long postId, Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));
        Post post = repo.findById(postId).orElseThrow(() -> new AppException("Post not found with id: " + postId, HttpStatus.NOT_FOUND));

        post.addLike(user);
        user.getLikedPosts().add(post);

        repo.save(post);

        // If the post owner is not the same as the liker, send notification
        if(!post.getUser().getId().equals(user.getId())){
            PhiliaEvent postLikedEvent = PhiliaEvent
                    .builder()
                    .eventType(PhiliaEventType.POST_LIKE)
                    .recipientId(post.getUser().getId())
                    .notifierId(user.getId())
                    .message(" has liked your post.")
                    .link("/posts/" + post.getId())
                    .build();
            eventPublisher.publishEvent(postLikedEvent);
        }

        log.info("Post liked with id: {} by user with id: {}", postId, userId);
        return true;
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#userId, authentication.name)"
    )
    @Transactional
    public boolean removeLikeFromPost(Long postId, Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));
        Post post = repo.findById(postId).orElseThrow(() -> new AppException("Post not found with id: " + postId, HttpStatus.NOT_FOUND));

        post.removeLike(user);
        user.getLikedPosts().remove(post);

        repo.save(post);

        log.info("Post like removed with id: {} by user with id: {}", postId, userId);
        return true;
    }

    @PreAuthorize(
            "@ownerShipSecurity.isPostOwner(#id, authentication.name)"
    )
    @Transactional
    public ResponseEntity<Void> deletePostById(Long id) {
        Post post = repo.findById(id).orElseThrow(() -> new AppException("Post not found with id: " + id, HttpStatus.NOT_FOUND));
        repo.delete(post);

        log.info("Post deleted with id: {}", id);
        return ResponseEntity.noContent().build();
    }
}
