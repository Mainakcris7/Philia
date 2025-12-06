package com.mainak.philia.model;

import com.mainak.philia.enums.PhiliaEventType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recipientId;

    private Long notifierId;

    @Enumerated(EnumType.STRING)
    private PhiliaEventType eventType;

    private boolean isRead = false;

    private String message;

    private String link;

    private LocalDateTime createdAt = LocalDateTime.now();
}
