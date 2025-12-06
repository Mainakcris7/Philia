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
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @EqualsAndHashCode.Exclude
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    @EqualsAndHashCode.Exclude
    private Post post;

    @Column(updatable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToMany
    @JoinTable(
            name = "comment_likes",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @EqualsAndHashCode.Exclude
    private Set<User> likes = new HashSet<>();

    public void addLike(User user) {
        this.likes.add(user);
    }

    public void removeLike(User user) {
        if(!this.likes.contains(user)) {
            throw new AppException("The user has not liked this comment", HttpStatus.BAD_REQUEST);
        }
        this.likes.remove(user);
    }
}
