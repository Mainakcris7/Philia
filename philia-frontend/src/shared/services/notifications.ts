import { axiosAuthInstance } from "../config/axiosconfig";
import type { Notification } from "../types/notification/Notification";

const NOTIFICATION_BASE_URL = `/users`;

/**
 * Fetches all notifications for a specific user.
 * Corresponds to: @GetMapping("/{id}/notifications")
 */
export const getAllNotificationsForUser = async (userId: number) => {
  const response = await axiosAuthInstance.get<Notification[]>(
    `${NOTIFICATION_BASE_URL}/${userId}/notifications`
  );
  return response.data;
};

/**
 * Marks all notifications for a specific user as read.
 * Corresponds to: @PostMapping("/{userId}/notifications/read/all")
 */
export const readAllNotificationsForUser = async (userId: number) => {
  const response = await axiosAuthInstance.post<boolean>(
    `${NOTIFICATION_BASE_URL}/${userId}/notifications/read/all`
  );
  return response.data;
};

/**
 * Marks a specific notification as read for a user.
 * Corresponds to: @PostMapping("/{userId}/notifications/read/{notificationId}")
 */
export const readNotificationById = async (
  userId: number,
  notificationId: number
) => {
  const response = await axiosAuthInstance.post<boolean>(
    `${NOTIFICATION_BASE_URL}/${userId}/notifications/read/${notificationId}`
  );
  return response.data;
};

/**
 * Deletes a specific notification by its ID.
 * Corresponds to: @DeleteMapping("/{userId}/notifications/delete/{notificationId}")
 */
export const deleteNotificationById = async (
  userId: number,
  notificationId: number
) => {
  await axiosAuthInstance.delete<void>(
    `${NOTIFICATION_BASE_URL}/${userId}/notifications/delete/${notificationId}`
  );
  return true;
};

/**
 * Clears (deletes) all notifications for a specific user.
 * Corresponds to: @DeleteMapping("/{userId}/notifications/delete/all")
 */
export const clearAllNotificationsOfUser = async (userId: number) => {
  await axiosAuthInstance.delete<void>(
    `${NOTIFICATION_BASE_URL}/${userId}/notifications/delete/all`
  );
  return true;
};
