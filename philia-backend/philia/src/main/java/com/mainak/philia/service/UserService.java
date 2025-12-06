package com.mainak.philia.service;

import com.mainak.philia.dto.auth.LoginResponseDto;
import com.mainak.philia.dto.notification.PhiliaEvent;
import com.mainak.philia.dto.user.*;
import com.mainak.philia.enums.PhiliaEventType;
import com.mainak.philia.exception.AppException;
import com.mainak.philia.model.FriendRequestMetaData;
import com.mainak.philia.model.User;
import com.mainak.philia.repository.FriendRequestMetaDataRepository;
import com.mainak.philia.repository.UserRepository;
import com.mainak.philia.security.JwtUtils;
import com.mainak.philia.service.auth.AppUserDetails;
import com.mainak.philia.utils.mapper.UserMapper;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository repo;
    private final OtpService otpService;
    private final ApplicationEventPublisher eventPublisher;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final FriendRequestMetaDataRepository friendRequestMetaDataRepo;

    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = repo.findAll().stream().map(UserMapper::mapToUserDto).toList();
        if(users.isEmpty()){
            throw new AppException("No users found", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    public ResponseEntity<UserResponseDto> getUserById(Long id) {
        User user = repo.findById(id).orElseThrow(() -> new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND));
        UserResponseDto userResponseDto = UserMapper.mapToUserResponseDto(user);

        List<FriendRequestDto> sentFriendRequests = getSentFriendRequestDtoFromUser(user);
        List<FriendRequestDto> receivedFriendRequests = getReceivedFriendRequestDtoFromUser(user);

        userResponseDto.setSentFriendRequests(sentFriendRequests);
        userResponseDto.setReceivedFriendRequests(receivedFriendRequests);

        log.info("Executing get user by id for user: {}", id);
        return ResponseEntity.status(HttpStatus.OK).body(userResponseDto);
    }

    public ResponseEntity<byte[]> getUserProfileImageById(Long id) {
        User user = repo.findById(id).orElseThrow(() -> new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND));

        if(user.getProfileImage() == null){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(user.getProfileImageType()))
                .body(user.getProfileImage());
    }

    public ResponseEntity<UserResponseDto> getLoggedInUser() {
        AppUserDetails details =  (AppUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = details.getUsername();
        User user = repo.findByEmail(email).orElseThrow(() -> new AppException("Invalid user email: " + email, HttpStatus.NOT_FOUND));
        UserResponseDto userResponseDto = UserMapper.mapToUserResponseDto(user);
        List<FriendRequestDto> sentFriendRequests = getSentFriendRequestDtoFromUser(user);
        List<FriendRequestDto> receivedFriendRequests = getReceivedFriendRequestDtoFromUser(user);

        userResponseDto.setSentFriendRequests(sentFriendRequests);
        userResponseDto.setReceivedFriendRequests(receivedFriendRequests);

        return ResponseEntity.ok(userResponseDto);
    }

    public ResponseEntity<List<UserDto>> getFriendsByUserId(Long id) {
        User user = repo.findById(id).orElseThrow(() -> new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND));
        List<UserDto> friends = user.getFriends().stream().map(UserMapper::mapToUserDto).toList();
        return ResponseEntity.ok(friends);
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#id, authentication.name)"
    )
    public ResponseEntity<List<FriendSuggestionDto>> getFriendSuggestions(Long id)
    {
        User user = repo.findById(id).orElseThrow(() -> new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND));

        Set<User> friends = user.getFriends();
        Set<User> sentFriendRequests = user.getSentFriendRequests();
        Set<User> receivedFriendRequests = user.getReceivedFriendRequests();

        Map<UserDto, Integer> mutualConnectionsCntMap = new HashMap<>();

        for(User friend: friends){
            for(User friendsFriend: friend.getFriends()){
                if(!friendsFriend.getId().equals(user.getId()) && !friends.contains(friendsFriend) && !sentFriendRequests.contains(friendsFriend) && !receivedFriendRequests.contains(friendsFriend)){

                    UserDto suggestedFriend = UserMapper.mapToUserDto(friendsFriend);
                    int cnt = mutualConnectionsCntMap.getOrDefault(suggestedFriend, 0);
                    mutualConnectionsCntMap.put(suggestedFriend, cnt + 1);
                }
            }
        }

        List<FriendSuggestionDto> friendSuggestions = new ArrayList<>();

        for(UserDto suggestedFriend: mutualConnectionsCntMap.keySet()){
            friendSuggestions.add(new FriendSuggestionDto(suggestedFriend, mutualConnectionsCntMap.get(suggestedFriend)));
        }

        // If no suggestions based on mutual connections, suggest other users
        if(friendSuggestions.isEmpty()){
            List<User> allUsers = repo.findAll();
            // Randomize the list to provide varied suggestions
            Collections.shuffle(allUsers);
            for(User potentialFriend: allUsers) {
                if (!potentialFriend.getId().equals(user.getId()) && !friends.contains(potentialFriend) && !sentFriendRequests.contains(potentialFriend) && !receivedFriendRequests.contains(potentialFriend)) {
                    UserDto suggestedFriendDto = UserMapper.mapToUserDto(potentialFriend);
                    friendSuggestions.add(new FriendSuggestionDto(suggestedFriendDto, 0));
                }
            }
            return ResponseEntity.ok(friendSuggestions.stream().limit(10).toList());
        }

        // Sort the suggestions in descending order based on mutual connections count
        friendSuggestions.sort((suggestion1, suggestion2) -> Integer.compare(suggestion2.getMutualConnectionsCount(), suggestion1.getMutualConnectionsCount()));

        return ResponseEntity.ok(friendSuggestions);
    }

    public List<UserDto> searchUsersByKeyword(String keyword) {
        List<User> searchedUsers = repo.searchUsersByKeyword(keyword);
        return searchedUsers.stream().map(UserMapper::mapToUserDto).toList();
    }

    public ResponseEntity<Void> sendOtpToEmail(String email) {
        if(repo.existsByEmail(email)) {
            log.error("Failed to generate OTP as user already exists with email: {}", email);
            throw new AppException("User already exists with email: " + email, HttpStatus.CONFLICT);
        }
        otpService.sendOtpToEmail(email);

        log.info("OTP generated for user with email: {}", email);
        return ResponseEntity.ok().build();
    }


    public ResponseEntity<LoginResponseDto> loginUser(UserLoginDto loginDto) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

        if(auth == null || !auth.isAuthenticated()) {
            throw new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        User user = repo.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new AppException("User not found with email: " + loginDto.getEmail(), HttpStatus.NOT_FOUND));
        UserResponseDto userResponseDto = UserMapper.mapToUserResponseDto(user);

        List<FriendRequestDto> sentFriendRequests = getSentFriendRequestDtoFromUser(user);
        List<FriendRequestDto> receivedFriendRequests = getReceivedFriendRequestDtoFromUser(user);

        userResponseDto.setSentFriendRequests(sentFriendRequests);
        userResponseDto.setReceivedFriendRequests(receivedFriendRequests);

        LoginResponseDto loginResponseDto = new LoginResponseDto();
        String jwtToken = jwtUtils.generateJWTToken(user.getEmail());

        loginResponseDto.setUser(userResponseDto);
        loginResponseDto.setJwtToken(jwtToken);

        log.info("User logged in with email: {}", loginDto.getEmail());
        return ResponseEntity.ok(loginResponseDto);
    }

    @Transactional
    public ResponseEntity<Void> createUser(UserRegisterDto userRegisterDto, MultipartFile profileImage) {
        if(repo.existsByEmail(userRegisterDto.getEmail())) {
            throw new AppException("User already exists with email: " + userRegisterDto.getEmail(), HttpStatus.CONFLICT);
        }
        // Verify OTP
        if(!otpService.verifyOtpForEmail(userRegisterDto.getEmail(), userRegisterDto.getRegistrationOtp())) {
            throw new AppException("Invalid OTP for email: " + userRegisterDto.getEmail(), HttpStatus.BAD_REQUEST);
        }

        User user = UserMapper.mapToUserFromUserSaveDto(userRegisterDto, profileImage);
        // Before saving, encrypt the password (during security implementation)
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repo.save(user);

        log.info("New user registered with email: {}", user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#userUpdateDto.id, authentication.name)"
    )
    @Transactional
    public ResponseEntity<Void> updateUser(UserUpdateDto userUpdateDto) {
        User user = repo.findById(userUpdateDto.getId())
                .orElseThrow(() -> new AppException("User not found with id: " + userUpdateDto.getId(), HttpStatus.NOT_FOUND));
        User updatedUser = UserMapper.updateUserFromUserUpdateDto(user, userUpdateDto);

        User savedUser = repo.save(updatedUser);

        PhiliaEvent updateProfileEvent = PhiliaEvent.builder()
                .eventType(PhiliaEventType.UPDATE_PROFILE)
                .link("/profile")
                .notifierId(savedUser.getId())
                .recipientId(savedUser.getId())
                .message("Your profile details has been updated successfully.")
                .build();
        eventPublisher.publishEvent(updateProfileEvent);

        log.info("User details updated for the user with email: {}", savedUser.getEmail());
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#id, authentication.name)"
    )
    @Transactional
    public ResponseEntity<String> updateProfileImage(Long id, MultipartFile profileImage) {
        User user = repo.findById(id)
                .orElseThrow(() -> new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND));

        if(profileImage == null || profileImage.isEmpty()){
            user.setProfileImageType(null);
            user.setProfileImage(null);
        }else{
            user.setProfileImageType(profileImage.getContentType());
            try{
                user.setProfileImage(profileImage.getBytes());
            } catch (Exception e){
                throw new AppException("Error while converting profile image to byte array: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        User updatedUser = repo.save(user);

        String profileImageUrl;
        if(updatedUser.getProfileImage() == null){
            profileImageUrl = null;
        } else{
            profileImageUrl = String.format("/users/profile/%d/image", updatedUser.getId());
        }
        PhiliaEvent updateProfileEvent = PhiliaEvent.builder()
                .eventType(PhiliaEventType.UPDATE_PROFILE)
                .link("/profile")
                .notifierId(updatedUser.getId())
                .recipientId(updatedUser.getId())
                .message("Your profile picture has been updated successfully.")
                .build();
        eventPublisher.publishEvent(updateProfileEvent);

        log.info("User profile picture updated for the user with email: {}", updatedUser.getEmail());
        return ResponseEntity.ok().body(profileImageUrl);
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#senderId, authentication.name)"
    )
    @Transactional
    public boolean sendFriendRequest(Long senderId, Long receiverId) {
        if(senderId.equals(receiverId)){
            throw new AppException("Cannot send friend request to oneself", HttpStatus.BAD_REQUEST);
        }

        User sender = repo.findById(senderId).orElseThrow(() -> new AppException("No user (sender) found with id: " + senderId, HttpStatus.NOT_FOUND));
        User receiver = repo.findById(receiverId).orElseThrow(() -> new AppException("No user (receiver) found with id: " + receiverId, HttpStatus.NOT_FOUND));

        sender.sendFriendRequest(receiver);

        repo.save(sender);
        repo.save(receiver);

        FriendRequestMetaData metaData = new FriendRequestMetaData();
        metaData.setSenderId(senderId);
        metaData.setReceiverId(receiverId);

        friendRequestMetaDataRepo.save(metaData);

        PhiliaEvent friendRequestSendEvent = PhiliaEvent.builder()
                .eventType(PhiliaEventType.FRIEND_REQUEST_SEND)
                .link(String.format("/users/%d", sender.getId()))
                .notifierId(sender.getId())
                .recipientId(receiver.getId())
                .message(" has sent you a friend request.")
                .build();
        eventPublisher.publishEvent(friendRequestSendEvent);

        log.info("User id: {} sent friend request to id: {}", senderId, receiverId);
        return true;
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#receiverId, authentication.name)"
    )
    @Transactional
    public boolean acceptFriendRequest(Long receiverId, Long senderId) {
        User sender = repo.findById(senderId).orElseThrow(() -> new AppException("No user (sender) found with id: " + senderId, HttpStatus.NOT_FOUND));
        User receiver = repo.findById(receiverId).orElseThrow(() -> new AppException("No user (receiver) found with id: " + receiverId, HttpStatus.NOT_FOUND));

        receiver.acceptFriendRequest(sender);

        repo.save(sender);
        repo.save(receiver);

        friendRequestMetaDataRepo.deleteBySenderIdAndReceiverId(senderId, receiverId);

        PhiliaEvent friendRequestAcceptEvent = PhiliaEvent.builder()
                .eventType(PhiliaEventType.FRIEND_REQUEST_ACCEPT)
                .link(String.format("/users/%d", receiver.getId()))
                .notifierId(receiver.getId())
                .recipientId(sender.getId())
                .message(" has accepted your friend request.")
                .build();
        eventPublisher.publishEvent(friendRequestAcceptEvent);

        log.info("User id: {} accepted friend request to id: {}", receiverId, senderId);
        return true;
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#receiverId, authentication.name)"
    )
    @Transactional
    public boolean rejectFriendRequest(Long receiverId, Long senderId) {
        User sender = repo.findById(senderId).orElseThrow(() -> new AppException("No user (sender) found with id: " + senderId, HttpStatus.NOT_FOUND));
        User receiver = repo.findById(receiverId).orElseThrow(() -> new AppException("No user (receiver) found with id: " + receiverId, HttpStatus.NOT_FOUND));

        receiver.declineFriendRequest(sender);

        repo.save(sender);
        repo.save(receiver);

        friendRequestMetaDataRepo.deleteBySenderIdAndReceiverId(senderId, receiverId);

        PhiliaEvent friendRequestRejectEvent = PhiliaEvent.builder()
                .eventType(PhiliaEventType.FRIEND_REQUEST_REJECT)
                .link(String.format("/users/%d", receiver.getId()))
                .notifierId(receiver.getId())
                .recipientId(sender.getId())
                .message(" has rejected your friend request.")
                .build();
        eventPublisher.publishEvent(friendRequestRejectEvent);

        log.info("User id: {} rejected friend request of id: {}", receiverId, senderId);
        return true;
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#senderId, authentication.name)"
    )
    @Transactional
    public boolean cancelFriendRequest(Long senderId, Long receiverId) {
        User sender = repo.findById(senderId).orElseThrow(() -> new AppException("No user (sender) found with id: " + senderId, HttpStatus.NOT_FOUND));
        User receiver = repo.findById(receiverId).orElseThrow(() -> new AppException("No user (receiver) found with id: " + receiverId, HttpStatus.NOT_FOUND));

        sender.cancelFriendRequest(receiver);

        repo.save(sender);
        repo.save(receiver);

        friendRequestMetaDataRepo.deleteBySenderIdAndReceiverId(senderId, receiverId);

        log.info("User id: {} cancelled friend request to id: {}", senderId, receiverId);
        return true;
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#userId, authentication.name)"
    )
    @Transactional
    public boolean removeFriend(Long userId, Long friendId) {
        User user = repo.findById(userId).orElseThrow(() -> new AppException("No user found with id: " + userId, HttpStatus.NOT_FOUND));
        User friend = repo.findById(friendId).orElseThrow(() -> new AppException("No user found with id: " + friendId, HttpStatus.NOT_FOUND));

        user.removeFriend(friend);

        repo.save(user);
        repo.save(friend);

        log.info("User id: {} removed friend for id: {}", userId, friendId);
        return true;
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#id, authentication.name)"
    )
    @Transactional
    public ResponseEntity<Void> deleteUserById(Long id) {
        User user = repo.findById(id).orElseThrow(() -> new AppException("No user found with id: " + id, HttpStatus.NOT_FOUND));

        user.getFriends().forEach(friend -> friend.getFriends().remove(user));
        user.getFriends().clear();

        user.getSentFriendRequests().forEach(receiver -> receiver.getReceivedFriendRequests().remove(user));
        user.getSentFriendRequests().clear();

        user.getReceivedFriendRequests().forEach(sender -> sender.getSentFriendRequests().remove(user));
        user.getReceivedFriendRequests().clear();

        user.getLikedPosts().forEach(post -> post.getLikes().remove(user));
        user.getLikedPosts().clear();

        user.getLikedComments().forEach(comment -> comment.getLikes().remove(user));
        user.getLikedComments().clear();

        // Remove associated friend request metadata
        friendRequestMetaDataRepo.deleteBySenderId(id);
        friendRequestMetaDataRepo.deleteByReceiverId(id);

        try{
            notificationService.deleteAllNotificationsByRecipientId(id);
        }catch (Exception e){
            // Log the exception but do not prevent user deletion
            log.warn("Failed to delete notifications for user id: {}, errorMessage: {}", id, e.getMessage());
        }
        repo.delete(user);

        log.info("Delete user by id: {}", id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    public List<FriendRequestDto> getSentFriendRequestDtoFromUser(User user){
        List<FriendRequestMetaData> sentRequestsMetaData = friendRequestMetaDataRepo.findBySenderId(user.getId());
        List<User> sentFriendRequests = new ArrayList<>(user.getSentFriendRequests());

        // Without the map, I had to call the DB everytime (findBySenderIdAndReceiverId(senderId, receiverId))
        Map<Long, LocalDateTime> sentRequestTimeMap = new HashMap<>();
        for(FriendRequestMetaData metaData : sentRequestsMetaData) {
            sentRequestTimeMap.put(metaData.getReceiverId(), metaData.getCreatedAt());
        }

        return sentFriendRequests.stream().map(receiver -> {
            FriendRequestDto dto = new FriendRequestDto();
            UserDto receiverDto = UserMapper.mapToUserDto(receiver);
            dto.setUser(receiverDto);
            dto.setSentAt(sentRequestTimeMap.get(receiver.getId()));
            return dto;
        }).sorted((a, b) -> b.getSentAt().compareTo(a.getSentAt())).toList();
    }

    public List<FriendRequestDto> getReceivedFriendRequestDtoFromUser(User user){
        List<FriendRequestMetaData> receivedRequestsMetaData = friendRequestMetaDataRepo.findByReceiverId(user.getId());

        List<User> receivedFriendRequests = new ArrayList<>(user.getReceivedFriendRequests());
        Map<Long, LocalDateTime> receivedRequestTimeMap = new HashMap<>();
        for(FriendRequestMetaData metaData : receivedRequestsMetaData) {
            receivedRequestTimeMap.put(metaData.getSenderId(), metaData.getCreatedAt());
        }

        return receivedFriendRequests.stream().map(sender -> {
            FriendRequestDto dto = new FriendRequestDto();
            UserDto receiverDto = UserMapper.mapToUserDto(sender);
            dto.setUser(receiverDto);
            dto.setSentAt(receivedRequestTimeMap.get(sender.getId()));
            return dto;
        }).sorted((a, b) -> b.getSentAt().compareTo(a.getSentAt())).toList();
    }


}
