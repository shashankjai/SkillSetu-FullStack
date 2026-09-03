// src/routes/notificationRoutes.js

const express = require("express");
const {
  sendNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  sendNewMeetingScheduledNotification,
  sendReminderNotification,
} = require("../controllers/notificationController");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

// Send a new notification
router.post("/send", verifyToken, sendNotification);

// Get all notifications for a user
router.get("/:userId", verifyToken, getNotifications);

// Mark a notification as read
router.patch("/:notificationId/read", verifyToken, markAsRead);

// Mark all notifications as read
router.patch("/:userId/read-all", verifyToken, markAllAsRead);

// Send a new meeting scheduled notification
router.post(
  "/send-new-meeting-scheduled",
  verifyToken,
  sendNewMeetingScheduledNotification,
);

// Send a reminder notification for a session
router.post("/send-reminder", verifyToken, sendReminderNotification);

module.exports = router;
