import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const socket = io(API_BASE_URL);

// Notify server of the logged-in user
const userId = localStorage.getItem("userId"); // Example: User ID stored in localStorage
if (userId) {
  socket.emit("userLoggedIn", userId);
}

// Handle incoming new messages
socket.on("newMessage", (message) => {
  console.log("New message received:", message);
  // Add logic to display the message in the chat window
});

export default socket;
