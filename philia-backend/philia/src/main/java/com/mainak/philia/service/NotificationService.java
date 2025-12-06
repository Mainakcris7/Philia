package com.mainak.philia.service;

import com.mainak.philia.dto.notification.PhiliaEvent;
import com.mainak.philia.dto.notification.PhiliaNotificationDto;
import com.mainak.philia.exception.AppException;
import com.mainak.philia.model.Notification;
import com.mainak.philia.model.User;
import com.mainak.philia.repository.NotificationRepository;
import com.mainak.philia.repository.UserRepository;
import com.mainak.philia.utils.mapper.NotificationMapper;
import com.mainak.philia.utils.mapper.UserMapper;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class NotificationService {
    private final NotificationRepository repo;
    private final UserRepository userRepo;

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#recipientId, authentication.name)"
    )
    public List<PhiliaNotificationDto> getAllNotificationsByRecipientId(Long recipientId){
        List<Notification> notifications = repo.findAllByRecipientIdOrderByCreatedAtDesc(recipientId);
        List<PhiliaNotificationDto> notificationDtos = new ArrayList<>();

        for(Notification notification : notifications){
            User notifier = userRepo.findById(notification.getNotifierId()).orElse(null);
            if(notifier != null){
                PhiliaNotificationDto dto = NotificationMapper.mapToNotificationDto(notification, UserMapper.mapToUserDto(notifier));
                notificationDtos.add(dto);
            }
        }

        return notificationDtos;
    }

    @PreAuthorize(
        "@ownerShipSecurity.isSameUser(#recipientId, authentication.name)"
    )
    @Transactional
    public ResponseEntity<Boolean> markNotificationAsRead(Long notificationId, Long recipientId){
        Notification notification = repo.findByIdAndRecipientId(notificationId, recipientId).orElse(null);
        if(notification == null){
            return ResponseEntity.badRequest().body(false);
        }
        notification.setRead(true);
        repo.save(notification);

        log.info("Marking notification as read with id: {}", notificationId);
        return ResponseEntity.ok(true);
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#recipientId, authentication.name)"
    )
    @Transactional
    public boolean markNotificationsAsRead(Long recipientId){
        List<Notification> notifications = repo.findByRecipientIdAndIsReadFalse(recipientId);

        notifications.forEach(notification -> {
            notification.setRead(true);
        });

        repo.saveAll(notifications);

        log.info("Marked all notification as read for user with id: {}", recipientId);
        return true;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void saveNotification(PhiliaEvent event){
        Notification notification = NotificationMapper.mapEventToNotification(event);
        if(!userRepo.existsById(notification.getRecipientId())){
            throw new AppException("Recipient user not found", HttpStatus.NOT_FOUND);
        }
        if(!userRepo.existsById(notification.getNotifierId())){
            throw new AppException("Notifier user not found", HttpStatus.NOT_FOUND);
        }

        log.info("New notification created for user with id: {}", event.getRecipientId());
        repo.save(notification);
    }

    @PreAuthorize(
        "@ownerShipSecurity.isNotificationOwner(#id, authentication.name)"
    )
    @Transactional
    public ResponseEntity<Void> deleteNotificationById(Long userId, Long id){
        Notification notification = repo.findByIdAndRecipientId(id, userId).orElse(null);
        if(notification == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        repo.deleteById(id);

        log.info("Notification deleted with id: {}", id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize(
            "@ownerShipSecurity.isSameUser(#recipientId, authentication.name)"
    )
    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public ResponseEntity<Void> deleteAllNotificationsByRecipientId(Long recipientId){
        repo.deleteAllByRecipientId(recipientId);

        log.info("All notifications deleted for user with id: {}", recipientId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
