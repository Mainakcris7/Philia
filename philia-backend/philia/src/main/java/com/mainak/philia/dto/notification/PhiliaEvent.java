package com.mainak.philia.dto.notification;

import com.mainak.philia.enums.PhiliaEventType;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PhiliaEvent {
    private PhiliaEventType eventType;
    private Long notifierId;
    private Long recipientId;
    private String message;
    private String link;
}
