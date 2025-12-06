package com.mainak.philia.dto.notification;

import com.mainak.philia.enums.PhiliaEventType;
import com.mainak.philia.dto.user.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhiliaNotificationDto {
    private Long id;

    private Long recipientId;

    private UserDto notifier;

    private PhiliaEventType eventType;

    private boolean isRead;

    private String message;

    private String link;

    private LocalDateTime createdAt;
}
