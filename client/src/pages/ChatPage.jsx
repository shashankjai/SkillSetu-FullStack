import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Navbar from "../components/navbar/Navbar"; // Import Navbar
import MessageInput from "../components/chat/MessageInput"; // Import MessageInput
import { useNavigate, useParams } from "react-router-dom";
import { FiCalendar, FiClock } from "react-icons/fi";
import Footer from "../components/footer/Footer";
import Background from "../components/background/Background";
import VideoCallModal from "../components/video/VideoCallModal";
import "../components/background/Background.css";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
import { IoMdWarning } from "react-icons/io"; // Importing a warning icon for the button

const ChatPage = () => {
  const { sessionId } = useParams(); // Get sessionId from URL parameter
  const [connections, setConnections] = useState([]); // List of connections
  const [selectedConnection, setSelectedConnection] = useState(null); // Selected connection for chat
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); // Feedback Modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false); // Schedule Modal state
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [messages, setMessages] = useState([]); // List of messages in the current chat
  const [socket, setSocket] = useState(null); // Socket connection
  const [notificationSocket, setNotificationSocket] = useState(null); // Notification socket connection
  const [rating, setRating] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [reportSuccess, setReportSuccess] = useState(false); // State for success message
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [incomingCallRequest, setIncomingCallRequest] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeVideoCall = useCallback(() => setIsVideoCallOpen(false), []);

  // Fetch accepted session connections
  useEffect(() => {
    const fetchConnections = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API_URL}/api/sessions/accepted`, {
          headers: { "x-auth-token": token },
        });
        setConnections(response.data);

        // If there is a sessionId in the URL, select that connection automatically
        if (sessionId) {
          const connection = response.data.find(
            (conn) => conn._id === sessionId,
          );
          setSelectedConnection(connection);
        }
      } catch (err) {
        console.error("Error fetching connections:", err);
      }
    };

    fetchConnections();
  }, [sessionId]);

  // Set up Socket.io connection (only once)
  useEffect(() => {
    if (!sessionId) {
      console.error("Session ID is undefined.");
      return;
    }

    const socketIo = io(`${API_URL}/sessions`, {
      transports: ["websocket"],
      query: { sessionId },
    });

    socketIo.on("connect", () => {
      console.log("WebSocket connected:", socketIo.id);
    });

    socketIo.on("receive_message", (data) => {
      console.log("Received message:", data);

      if (data.sender && data.receiver) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...data,
            senderName: data.sender.name,
            receiverName: data.receiver.name,
          },
        ]);
      }
    });

    socketIo.on("video-call-request", (data) => {
      if (!data || !data.senderId || data.senderId === loggedInUser?._id)
        return;
      setIncomingCallRequest(data);
    });

    socketIo.on("video-call-accepted", (data) => {
      if (!data || !data.acceptedBy || data.acceptedBy === loggedInUser?._id)
        return;
      setIncomingCallRequest(null);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [sessionId]);

  useEffect(() => {
    const timeRefresh = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeRefresh);
  }, []);

  // Set up the **Notification Socket.io connection** (separate from the chat socket)
  useEffect(() => {
    const socketIoNotification = io(`${API_URL}/notifications`, {
      transports: ["websocket"],
    });

    socketIoNotification.on("connect", () => {
      console.log("Notification WebSocket connected:", socketIoNotification.id);
    });

    setNotificationSocket(socketIoNotification);

    // Subscribe the user to notifications (you need to pass the userId from localStorage)
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    socketIoNotification.emit("subscribeToNotifications", userId);

    return () => {
      socketIoNotification.disconnect();
    };
  }, []);

  // Fetch messages for the selected connection
  useEffect(() => {
    if (selectedConnection) {
      const fetchMessages = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(
            `${API_URL}/api/sessions/message/${selectedConnection._id}`,
            {
              headers: { "x-auth-token": token },
            },
          );

          const updatedMessages = response.data.map((msg) => ({
            ...msg,
            senderName: msg.senderId?.name || "Unknown",
            receiverName: msg.receiverId?.name || "Unknown",
          }));

          setMessages(updatedMessages);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };

      fetchMessages();
    }
  }, [selectedConnection]);

  // Handle selecting a connection for chat
  const handleSelectConnection = (connection) => {
    setSelectedConnection(connection);
    navigate(`/chat/${connection._id}`); // Navigate to the chat page with selected sessionId
  };

  // Send a message
  const handleSendMessage = (message, file) => {
    if (
      selectedConnection?.status === "completed" ||
      selectedConnection?.status === "canceled"
    ) {
      alert("You cannot send messages for completed or canceled sessions.");
      return;
    }

    console.log("Message to send:", message); // Debugging: log the message
    console.log("File to send:", file); // Debugging: log the file

    if (message.trim() === "" && !file) {
      console.log("No message or file to send"); // Debugging: log when no message or file
      return;
    }

    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    const formData = new FormData();
    formData.append("sessionId", selectedConnection._id); // Ensure sessionId is correctly included
    formData.append("content", message); // Append message content

    if (file) {
      formData.append("file", file); // Append file if available
      console.log("File appended to FormData:", file); // Debugging: log file data
    }

    // Store the message in the backend; Socket.IO chat is already scoped by session room
    // on the backend for receive_message distribution.
    axios
      .post(`${API_URL}/api/sessions/message`, formData, {
        headers: { "x-auth-token": token },
      })
      .then((response) => {
        console.log("Message sent successfully:", response.data);
      })
      .catch((err) => {
        console.error("Error sending message:", err.response || err);
      });
  };

  // Open schedule modal
  const openScheduleModal = () => {
    setIsScheduleModalOpen(true); // Open schedule modal
  };

  // Close schedule modal
  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false); // Close schedule modal
  };

  // Open feedback modal
  const openFeedbackModal = () => {
    setIsFeedbackModalOpen(true); // Open feedback modal
  };

  // Close feedback modal
  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false); // Close feedback modal
  };

  // Schedule session (send API request to backend)
  const handleScheduleSession = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API_URL}/api/sessions/schedule`,
        {
          sessionId,
          newMeetingDate: scheduledDate,
          newMeetingTime: scheduledTime,
        },
        { headers: { "x-auth-token": token } },
      );

      closeScheduleModal();
    } catch (error) {
      console.error("Error scheduling session:", error);
    }
  };

  // Handle marking session as completed or canceled
  const handleMarkSession = async (status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      if (!feedback) {
        alert("Please provide feedback before marking the session.");
        return;
      }

      console.log(`Marking session as ${status}`);

      await axios.post(
        `${API_URL}/api/sessions/mark-session`,
        {
          sessionId,
          status,
          rating,
          feedback,
        },
        {
          headers: {
            "x-auth-token": token, // Ensure the token is being sent correctly
          },
        },
      );
      console.log("Session marked successfully");

      setIsFeedbackModalOpen(false); // Close feedback modal after submission
      // Refresh session data to update the status
      const updatedSession = await axios.get(
        `${API_URL}/api/sessions/accepted`,
        {
          headers: {
            "x-auth-token": token, // Pass token for the session data request as well
          },
        },
      );
      setSelectedConnection(
        updatedSession.data.find((session) => session._id === sessionId),
      );
    } catch (error) {
      console.error("Error marking session:", error);
    }
  };

  // Open/close Report Modal
  const openReportModal = () => {
    setIsReportModalOpen(true);
    setReportSuccess(false); // Reset success state when opening the modal
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  // Handle Report Submit
  const handleReportSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submit behavior

    // Retrieve the logged-in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    // if (!loggedInUser || !loggedInUser._id) {
    //   alert('Invalid user. Please log in again.');
    //   return; // Stop the submission if no valid user is found
    // }

    // Get sessionId from the selected connection
    const sessionId = selectedConnection._id;

    // Determine the targetUser from the session
    const targetUser =
      selectedConnection.userId1._id === loggedInUser._id
        ? selectedConnection.userId2._id
        : selectedConnection.userId1._id;

    if (!targetUser || !sessionId) {
      alert("Invalid session or target user.");
      return; // Stop the submission if target user or session is missing
    }

    const formData = new FormData();
    formData.append("reason", reason);
    formData.append("description", description);
    formData.append("reporter", loggedInUser._id); // Include the logged-in user as the reporter
    formData.append("targetUser", targetUser); // Include the target user
    formData.append("session", sessionId); // Include the session ID

    if (screenshot) {
      formData.append("screenshot", screenshot); // Attach screenshot if available
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(`${API_URL}/api/reports`, formData, {
        headers: { "x-auth-token": token },
      });

      // Success: Reset form and show success message
      alert("Report submitted successfully");
      setReason("");
      setDescription("");
      setScreenshot(null);
      closeReportModal();
    } catch (error) {
      console.error("Error submitting report:", error);
      alert(
        "Error submitting report: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  // Get the logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // Check if the logged-in user is user1 or user2 in the current session
  const isUser1 = selectedConnection?.userId1?._id === loggedInUser?._id;
  const isUser2 = selectedConnection?.userId2?._id === loggedInUser?._id;

  // Check if feedback has been given by the logged-in user
  const isFeedbackGivenByLoggedInUser = isUser1
    ? selectedConnection?.feedbackByUser1 // Assuming these fields contain the feedback for user1
    : isUser2
      ? selectedConnection?.feedbackByUser2 // Assuming these fields contain the feedback for user2
      : false; // If neither, feedback hasn't been provided by the logged-in user

  // Check if both users have provided feedback
  const bothUsersProvidedFeedback =
    selectedConnection?.feedbackByUser1 && selectedConnection?.feedbackByUser2;

  // Check if session is completed or canceled
  const isSessionCompletedOrCanceled =
    selectedConnection?.status === "completed" ||
    selectedConnection?.status === "canceled";

  // Disable interaction if the session is completed or canceled and both users have provided feedback
  const isChatBlocked =
    isSessionCompletedOrCanceled && bothUsersProvidedFeedback;

  // Show the feedback modal if the logged-in user hasn't provided feedback yet
  const shouldShowFeedbackModal =
    !isFeedbackGivenByLoggedInUser && !isChatBlocked;

  // Show "Schedule Next Meeting" only if the session is not completed or canceled and both users haven't provided feedback
  const shouldShowScheduleButton =
    !isSessionCompletedOrCanceled && !bothUsersProvidedFeedback;

  // Left Panel: List of Connections
  const getOtherUserName = (connection) => {
    if (!connection) return "Unknown"; // Check if connection is null or undefined
    const user1Name = connection.userId1?.name || "Unknown"; // Safe access to name
    const user2Name = connection.userId2?.name || "Unknown"; // Safe access to name
    return connection.userId1?._id === loggedInUser._id ? user2Name : user1Name;
  };

  // Right Panel: Chat with Selected Connection
  const getChatUserName = () => {
    if (
      !selectedConnection ||
      !selectedConnection.userId1 ||
      !selectedConnection.userId2
    ) {
      return "Unknown"; // Return a fallback value if selectedConnection or its properties are null
    }

    const user1Name = selectedConnection.userId1?.name || "Unknown"; // Safe access to name
    const user2Name = selectedConnection.userId2?.name || "Unknown"; // Safe access to name
    return selectedConnection.userId1._id === loggedInUser._id
      ? user2Name
      : user1Name;
  };

  // Utility function to format the date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // This will display the date in a format like "MM/DD/YYYY"
  };

  const getSessionStartDateTime = (session) => {
    if (!session) return null;

    const sessionDate = session.newMeetingDate || session.sessionDate;
    const sessionTime = session.newMeetingTime || session.sessionTime;

    if (!sessionDate || !sessionTime) return null;

    const dateOnly = new Date(sessionDate).toISOString().slice(0, 10);
    const sessionDateTime = new Date(`${dateOnly}T${sessionTime}`);
    return Number.isNaN(sessionDateTime.getTime()) ? null : sessionDateTime;
  };

  const canStartVideoCall =
    selectedConnection &&
    selectedConnection.status === "accepted" &&
    getSessionStartDateTime(selectedConnection) &&
    getSessionStartDateTime(selectedConnection) <= currentTime;

  const handleStartVideoCall = () => {
    if (!socket || !selectedConnection?._id || !loggedInUser?._id) return;

    socket.emit("video-call-request", {
      sessionId: selectedConnection._id,
      senderId: loggedInUser._id,
      senderName: loggedInUser.name || "User",
    });

    setIsVideoCallOpen(true);
  };

  const handleAcceptVideoCall = () => {
    if (!socket || !selectedConnection?._id || !loggedInUser?._id) return;

    socket.emit("video-call-accepted", {
      sessionId: selectedConnection._id,
      senderId: incomingCallRequest?.senderId,
      acceptedBy: loggedInUser._id,
    });

    setIncomingCallRequest(null);
    setIsVideoCallOpen(true);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-slate-950 text-white">
      <Background />
      <div className="chat-page flex min-h-screen flex-col overflow-x-hidden bg-slate-950 text-white">
        <Navbar />
        <div className="flex flex-1 flex-col md:flex-row">
          <button
            className="md:hidden fixed top-4 left-4 z-50 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-2 text-white shadow-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
          {/* Left Panel: List of Connections */}
          <div
            className={`left-panel fixed z-40 top-0 bottom-0 left-0 w-3/4 sm:w-2/4 md:w-1/4 min-h-screen border border-white/10 bg-slate-950/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.5)] backdrop-blur-xl transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
          >
            <h2 className="text-2xl font-semibold text-white">Connections</h2>
            <div className="mt-6 max-h-[80vh] space-y-4 overflow-auto">
              {connections.length > 0 ? (
                connections.map((connection) => {
                  const isSelected =
                    selectedConnection &&
                    selectedConnection._id === connection._id;
                  return (
                    <div
                      key={connection._id}
                      className={`cursor-pointer rounded-2xl border p-4 shadow-lg transition duration-300 
          ${
            isSelected
              ? "border-blue-400 bg-gradient-to-r from-blue-600 to-indigo-600"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          }`}
                      onClick={() => handleSelectConnection(connection)}
                    >
                      <p className="font-semibold text-white">
                        {getOtherUserName(connection)}
                      </p>
                      <p className="text-slate-200">
                        Skill: {connection.skill || "Eclipse OCL"}
                      </p>
                      <p className="text-slate-200">
                        {formatDate(connection.sessionDate)} at{" "}
                        {connection.sessionTime}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-300">No connections available.</p>
              )}
            </div>
          </div>
          {/* Right Panel: Chat with Selected Connection */}
          <div className="chat-container min-h-screen w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.35)] backdrop-blur-md md:ml-0 md:flex-1 md:p-6">
            {selectedConnection && (
              <>
                <h2 className="mb-4 text-3xl font-semibold text-white">
                  Chat with {getChatUserName()}
                </h2>
                <p className="text-slate-200">
                  Skill: {selectedConnection.skill || "Eclipse OCL"}
                </p>
                <div className="messages-container mb-6 max-h-[55vh] overflow-auto rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-inner shadow-blue-900/30 md:max-h-[65vh]">
                  {messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className="message mb-4 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 p-4 text-left text-white shadow-lg"
                      >
                        {msg.senderId && msg.senderId._id === loggedInUser._id}

                        <p>
                          <strong>{msg.senderName}: </strong>
                          {/* Render the message content as HTML */}
                          <span
                            dangerouslySetInnerHTML={{ __html: msg.content }}
                          />
                        </p>
                        {msg.mediaType === "image" && (
                          <img
                            src={msg.mediaUrl}
                            alt="file"
                            className="max-w-full sm:max-w-xs mt-2"
                          />
                        )}
                        {msg.mediaType === "audio" && (
                          <audio controls className="w-full sm:w-auto">
                            <source src={msg.mediaUrl} />
                          </audio>
                        )}
                        {msg.mediaType === "video" && (
                          <video controls className="max-w-full sm:max-w-xs">
                            <source src={msg.mediaUrl} />
                          </video>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">No messages yet</p>
                  )}
                </div>

                {/* Feedback Display if session is completed or canceled */}
                {isSessionCompletedOrCanceled && (
                  <div className="feedback-display mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.25)]">
                    <h3 className="font-semibold text-blue-200">
                      Feedback from User 1:
                    </h3>
                    <p className="text-slate-200">
                      {selectedConnection?.feedbackByUser1}
                    </p>

                    <h3 className="mt-4 font-semibold text-blue-200">
                      Feedback from User 2:
                    </h3>
                    <p className="text-slate-200">
                      {selectedConnection?.feedbackByUser2}
                    </p>
                  </div>
                )}

                {/* Prevent sending messages if the session is completed or canceled */}
                {!isChatBlocked && (
                  <MessageInput sendMessage={handleSendMessage} />
                )}

                {incomingCallRequest && (
                  <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                    <p>
                      <strong>
                        {incomingCallRequest.senderName || "Peer"}
                      </strong>{" "}
                      wants to start a video call.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAcceptVideoCall}
                        className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-400"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setIncomingCallRequest(null)}
                        className="rounded-lg border border-white/20 px-4 py-2 font-semibold text-white hover:bg-white/5"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}

                {/* Buttons Row */}
                <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
                  {/* Start Video Call Button */}
                  {selectedConnection && (
                    <button
                      onClick={handleStartVideoCall}
                      disabled={!canStartVideoCall}
                      className={`px-4 py-2 rounded-lg font-semibold text-white shadow-lg transition duration-300 ease-in-out ${
                        canStartVideoCall
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                          : "bg-slate-500/60 cursor-not-allowed"
                      }`}
                    >
                      {canStartVideoCall
                        ? "Start Video Call"
                        : "Video call opens when the session time starts"}
                    </button>
                  )}

                  {/* Schedule Next Meeting Button */}
                  {shouldShowScheduleButton && (
                    <button
                      onClick={openScheduleModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300 ease-in-out"
                    >
                      <FiCalendar /> Schedule Next Meeting
                    </button>
                  )}

                  {/* Mark as Completed */}
                  {!isChatBlocked && !isSessionCompletedOrCanceled && (
                    <>
                      <button
                        onClick={() => handleMarkSession("completed")}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                      >
                        Mark as Completed
                      </button>

                      {/* Mark as Canceled */}
                      <button
                        onClick={() => handleMarkSession("canceled")}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                      >
                        Mark as Canceled
                      </button>
                    </>
                  )}

                  {/* Report User Button */}
                  <button
                    onClick={openReportModal}
                    className="flex items-center gap-2 py-2 px-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-200"
                  >
                    <IoMdWarning className="text-xl" />
                    <span>Report User</span>
                  </button>

                  {/* Feedback Button */}
                  {!isChatBlocked && !bothUsersProvidedFeedback && (
                    <button
                      onClick={openFeedbackModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                    >
                      Provide Feedback
                    </button>
                  )}

                  {isMenuOpen && (
                    <div
                      className="fixed inset-0 z-30 bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 md:hidden"
                      onClick={() => setIsMenuOpen(false)}
                    ></div>
                  )}

                  {/* Close Button */}
                  {/* Feedback Modal (only show if feedback hasn't been given yet) */}
                  {isFeedbackModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
                      <div className="w-[90%] max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-8 text-white shadow-2xl">
                        <button
                          onClick={closeFeedbackModal}
                          className="absolute right-4 top-3 text-2xl text-blue-300 transition hover:text-white"
                        >
                          &times;
                        </button>

                        <h3 className="text-2xl font-bold mb-5 text-center">
                          We’d Love Your Feedback
                        </h3>

                        <select
                          onChange={(e) => setRating(e.target.value)}
                          value={rating}
                          className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[...Array(5)].map((_, index) => (
                            <option key={index} value={index + 1}>
                              {index + 1} Star{index + 1 > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>

                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Write your feedback..."
                          rows="4"
                          className="mt-4 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 font-medium text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                          onClick={closeFeedbackModal}
                          className="mt-6 w-full rounded-lg border border-blue-500 bg-blue-600 px-4 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-blue-500"
                        >
                          Submit Feedback
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Schedule Modal */}
                {isScheduleModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
                    <div className="w-[90%] max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-8 text-white shadow-2xl">
                      <h2 className="text-2xl font-bold mb-5 text-center">
                        Schedule Your Next Meeting
                      </h2>

                      <div className="flex flex-col gap-4">
                        <label className="flex flex-col font-medium">
                          <span className="mb-1">Select Date:</span>
                          <input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="rounded-lg border border-slate-600 bg-slate-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </label>

                        <label className="flex flex-col font-medium">
                          <span className="mb-1"> Select Time:</span>
                          <input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="rounded-lg border border-slate-600 bg-slate-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </label>
                      </div>

                      <button
                        onClick={handleScheduleSession}
                        className="mt-6 w-full rounded-lg border border-blue-500 bg-blue-600 px-4 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-blue-500"
                      >
                        Confirm Schedule
                      </button>

                      <button
                        onClick={closeScheduleModal}
                        className="absolute right-4 top-3 text-2xl text-blue-300 transition hover:text-white"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                )}

                {/* Report Modal */}
                {isReportModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
                    <div className="w-[90%] max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-8 text-white shadow-2xl">
                      <button
                        onClick={closeReportModal}
                        className="absolute right-4 top-3 text-2xl text-blue-300 transition hover:text-white"
                      >
                        &times;
                      </button>
                      <h3 className="text-2xl font-semibold text-white mb-4">
                        Report User
                      </h3>
                      <form onSubmit={handleReportSubmit}>
                        <div className="mb-4">
                          <label className="font-sm text-white">Reason:</label>
                          <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
                          >
                            <option value="">Select Reason</option>
                            <option value="Spam">Spam</option>
                            <option value="Harassment">Harassment</option>
                            <option value="Inappropriate Behavior">
                              Inappropriate Behavior
                            </option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="mb-4">
                          <label className="font-sm text-white">
                            Description:
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue"
                            required
                            className="mt-2 h-32 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="font-sm text-white">
                            Attach Screenshot (Optional):
                          </label>
                          <input
                            type="file"
                            onChange={(e) => setScreenshot(e.target.files[0])}
                            accept="image/*"
                            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
                            placeholder="Upload Screenshot"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="mt-6 w-full rounded-lg border border-blue-500 bg-blue-600 px-4 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-blue-500"
                          >
                            Submit Report
                          </button>
                        </div>
                      </form>
                      {reportSuccess && (
                        <div className="mt-4 text-green-600 text-center">
                          <p>Report submitted successfully!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>

      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={closeVideoCall}
        session={selectedConnection}
        currentUserId={loggedInUser?._id}
      />
    </div>
  );
};

export default ChatPage;
