import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { toast } from "react-toastify";

const useListenMessages = ({ onMessageReceived } = {}) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;
  
    const handleMessage = (message) => {
      if (onMessageReceived) {
        onMessageReceived(message);
        toast.info("New message received!");
      }
    };
  
    socket.on("receiveMessage", handleMessage);
  
    // Cleanup the event listener on unmount
    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [socket, onMessageReceived]);
  
};

export default useListenMessages;
