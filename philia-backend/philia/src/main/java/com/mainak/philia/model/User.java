package com.mainak.philia.model;

import com.mainak.philia.exception.AppException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String about;

    @Embedded
    private Address address;

    @Column(unique = true, nullable = false)
    private String email;
    private String password;
    private LocalDate dateOfBirth;

    private String profileImageType;

    @Column(name = "image", columnDefinition = "MEDIUMBLOB")
    @Lob
    private byte[] profileImage;

    @Column(updatable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    private Set<Post> posts = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "user_friends",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    @EqualsAndHashCode.Exclude
    private Set<User> friends = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "friend_requests",
        joinColumns = @JoinColumn(name = "sender_id"),
        inverseJoinColumns = @JoinColumn(name = "receiver_id")
    )
    @EqualsAndHashCode.Exclude
    private Set<User> sentFriendRequests = new HashSet<>();

    @ManyToMany(mappedBy = "sentFriendRequests")
    @EqualsAndHashCode.Exclude
    private Set<User> receivedFriendRequests = new HashSet<>();

    @ManyToMany(mappedBy = "likes")
    @EqualsAndHashCode.Exclude
    private Set<Post> likedPosts = new HashSet<>();

    @ManyToMany(mappedBy = "likes")
    @EqualsAndHashCode.Exclude
    private Set<Comment> likedComments = new HashSet<>();

    public void sendFriendRequest(User receiver) {
        if(this.getFriends().contains(receiver)) {
            throw new AppException("You are already friends with this user.", HttpStatus.BAD_REQUEST);
        }
        if(this.getSentFriendRequests().contains(receiver)) {
            throw new AppException("Friend request already sent to this user.", HttpStatus.BAD_REQUEST);
        }
        if(this.getReceivedFriendRequests().contains(receiver)) {
            throw new AppException("This user has already sent you a friend request.", HttpStatus.BAD_REQUEST);
        }
        this.getSentFriendRequests().add(receiver);
        receiver.getReceivedFriendRequests().add(this);
    }

    public void acceptFriendRequest(User sender) {
        if(!this.getReceivedFriendRequests().contains(sender)) {
            throw new AppException("No friend request from this user.", HttpStatus.BAD_REQUEST);
        }
        this.getReceivedFriendRequests().remove(sender);
        sender.getSentFriendRequests().remove(this);
        this.getFriends().add(sender);
        sender.getFriends().add(this);
    }

    public void cancelFriendRequest(User receiver){
        if(!this.getSentFriendRequests().contains(receiver)) {
            throw new AppException("No sent friend request to this user.", HttpStatus.BAD_REQUEST);
        }
        this.getSentFriendRequests().remove(receiver);
        receiver.getReceivedFriendRequests().remove(this);
    }

    public void declineFriendRequest(User sender){
        if(!this.getReceivedFriendRequests().contains(sender)) {
            throw new AppException("No friend request from this user.", HttpStatus.BAD_REQUEST);
        }
        this.getReceivedFriendRequests().remove(sender);
        sender.getSentFriendRequests().remove(this);
    }

    public void removeFriend(User friend) {
        if(!this.getFriends().contains(friend)) {
            throw new AppException("This user is not in your friends list.", HttpStatus.BAD_REQUEST);
        }
        this.getFriends().remove(friend);
        friend.getFriends().remove(this);
    }
}
