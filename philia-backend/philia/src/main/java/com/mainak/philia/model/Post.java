package com.mainak.philia.model;

import com.mainak.philia.exception.AppException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String caption;

    private String imageType;

    @Column(name = "image", columnDefinition = "MEDIUMBLOB")
    @Lob
    private byte[] image;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @EqualsAndHashCode.Exclude
    private User user;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    private Set<Comment> comments = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "post_likes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @EqualsAndHashCode.Exclude
    private Set<User> likes = new HashSet<>();

    @Column(updatable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt = LocalDateTime.now();

    public void addLike(User user) {
        this.likes.add(user);
    }

    public void removeLike(User user) {
        if(!this.likes.contains(user)){
            throw new AppException("The user has not liked this post", HttpStatus.BAD_REQUEST);
        }
        this.likes.remove(user);
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
        comment.setPost(this);
    }

    public void removeComment(Comment comment) {
        if(!this.comments.contains(comment)){
            throw new AppException("The comment does not exist on this post", HttpStatus.BAD_REQUEST);
        }
        this.comments.remove(comment);
        comment.setPost(null);
    }
}
