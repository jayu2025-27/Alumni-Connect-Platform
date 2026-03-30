import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { SendHorizontal } from 'lucide-react';
import useListenMessages from '../hooks/useListenMessages';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Messages = ({ initialSelectedUser }) => {
  const { socket, userId, userRole } = useContext(SocketContext);
  const [selectedUser, setSelectedUser] = useState(initialSelectedUser || null);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  // Check if initialSelectedUser changes
  useEffect(() => {
    if (initialSelectedUser) {
      setSelectedUser(initialSelectedUser);
    }
  }, [initialSelectedUser]);

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    if (socket && userId && userRole) {
      socket.emit('registerUser', { id: userId, role: userRole });  // Send userId and userRole
      console.log('User registered with socket:', userId, userRole);
    }
  }, [socket, userId, userRole]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch messages for the selected user
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/messages/${selectedUser.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  // Listen for real-time messages
  useListenMessages({
    onMessageReceived: (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    },
  });

  // Send a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      message: newMessage,
      senderId: userId,
      receiverId: selectedUser.id,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/messages/send/${selectedUser.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch(e) {}
        throw new Error(errorData.error || 'Failed to send message from backend');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, data]);

      // Clear the message input field
      setNewMessage('');
      
      // Show success toast
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message: " + error.message);
    }
  };


  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 border-r overflow-y-auto">
        <h2 className="text-lg font-semibold p-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            >
              <div className="flex items-center">
                <img src={user.profilePhoto || '/default-profile.png'} alt={user.fullName} className="w-8 h-8 rounded-full mr-2" />
                <span>{user.fullName}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Chat Area */}
      <div className="w-3/4 flex flex-col">
        <div className="p-4 bg-gray-200">
          <h2 className="text-xl font-semibold">{selectedUser ? selectedUser.fullName : 'Select a user to chat'}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 mb-4 flex flex-col gap-2">
          {messages.map((msg, index) => {
            const isMe = msg.senderId === parseInt(userId) && msg.senderRole === userRole;
            return (
            <div
              key={index}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`p-2 rounded-lg inline-block max-w-xs ${isMe
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-black'
                  }`}
              >
                {msg.message}
              </div>
            </div>
            );
          })}
        </div>
        {selectedUser && (
          <div className="p-4 flex items-center border-t bg-white">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg p-2 mr-2"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <SendHorizontal />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Messages;
