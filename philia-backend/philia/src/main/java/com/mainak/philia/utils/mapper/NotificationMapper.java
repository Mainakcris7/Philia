package com.mainak.philia.utils.mapper;

import com.mainak.philia.dto.notification.PhiliaEvent;
import com.mainak.philia.dto.notification.PhiliaNotificationDto;
import com.mainak.philia.dto.user.UserDto;
import com.mainak.philia.model.Notification;

public class NotificationMapper {
    public static Notification mapEventToNotification(PhiliaEvent event){
        Notification notification = new Notification();
        notification.setRecipientId(event.getRecipientId());
        notification.setEventType(event.getEventType());
        notification.setNotifierId(event.getNotifierId());
        notification.setLink(event.getLink());
        notification.setMessage(event.getMessage());

        return notification;
    }

    public static PhiliaNotificationDto mapToNotificationDto(Notification notification, UserDto notifier){
        PhiliaNotificationDto dto = new PhiliaNotificationDto();
        dto.setId(notification.getId());
        dto.setLink(notification.getLink());
        dto.setRecipientId(notification.getRecipientId());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setNotifier(notifier);
        dto.setEventType(notification.getEventType());
        dto.setMessage(notification.getMessage());
        return dto;
    }
}
