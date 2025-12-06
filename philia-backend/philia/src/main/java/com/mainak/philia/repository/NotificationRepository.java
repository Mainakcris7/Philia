package com.mainak.philia.repository;

import com.mainak.philia.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    public void deleteAllByRecipientId(Long recipientId);
    public List<Notification> findAllByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    public Optional<Notification> findByIdAndRecipientId(Long id, Long recipientId);
    public List<Notification> findByRecipientIdAndIsReadFalse(Long recipientId);
}
