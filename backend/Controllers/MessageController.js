const { Conversation, Message, User, Alumni, sequelize } = require("../Models/db");
const { getReceiverSocketId } = require("../socket/socket");
const { Op } = require("sequelize");

// Helper to determine role strings
const getOtherRole = (role) => role === 'alumni' ? 'student' : 'alumni';

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // ID of the other person
    const sender = req.user;
    const senderId = sender.id;

    if (!senderId) {
      return res.status(401).json({ error: "Unauthorized access. SenderId missing." });
    }

    const senderRole = sender.role; // 'alumni' or 'student'
    
    // Set strictly who is student and who is alumni
    const studentId = senderRole === 'student' ? senderId : receiverId;
    const alumniId = senderRole === 'alumni' ? senderId : receiverId;

    let conversation = await Conversation.findOne({
      where: {
        studentId: studentId,
        alumniId: alumniId
      }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        studentId: studentId,
        alumniId: alumniId
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      senderRole,
      message,
      conversationId: conversation.id
    });

    // Emitting real-time message to socket
    const receiverSocketKey = `${getOtherRole(senderRole)}_${receiverId}`;
    const socketModule = require('../socket/socket');
    const receiverSocketId = socketModule.getReceiverSocketId(receiverSocketKey);
    
    if (receiverSocketId) {
      socketModule.getIo().to(receiverSocketId).emit("receiveMessage", newMessage);
      console.log(`Socket message emitted to ${receiverSocketKey} (${receiverSocketId})`);
    } else {
      console.log(`Receiver ${receiverSocketKey} is offline or io not initialized.`);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};


const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const sender = req.user;
    const senderId = sender.id;
    const senderRole = sender.role;

    const studentId = senderRole === 'student' ? senderId : userToChatId;
    const alumniId = senderRole === 'alumni' ? senderId : userToChatId;

    const conversation = await Conversation.findOne({
      where: {
        studentId: studentId,
        alumniId: alumniId
      }
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = await Message.findAll({
      where: { conversationId: conversation.id },
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendMessage, getMessages };
