import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

// Create a context to hold the socket
const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
    const { user } = useContext(AuthContext);


  const connectSocket = () => {
    if (!socket) {
      const socketInstance = io("http://localhost:5000");

    


      setSocket(socketInstance);
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null); 
  
    }
  };
  const joinRoom=({session_id})=>{
    console.log("iddddddddddd",session_id)
    if(socket){
        socket.emit('join_session',{session_id})}
  }

  useEffect(() => {
    if(user && !socket){
        connectSocket();

    }
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, connectSocket, disconnectSocket,joinRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider };
export default SocketContext