import { useContext, useEffect, useState, useRef } from "react";
import { axiosInstance } from "../lib/axios";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SocketContext from "../context/SocketContext";
import { Video } from "lucide-react";

export default function Room() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { id, toId } = useParams();
  const { user } = useContext(AuthContext);
  const { socket, joinRoom } = useContext(SocketContext);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const { data } = await axiosInstance.get(`/sessions/${id}/messages`);
        setMessages(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchMessage();

    if (socket) {
      joinRoom({ session_id: id });

      const messageHandler = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.on("receiveMessage", messageHandler);

      return () => socket.off("receiveMessage", messageHandler);
    }
  }, [socket, id, joinRoom]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const { data } = await axiosInstance.post(`/sessions/${id}/messages`, {
        content: message,
        sender_id: user._id,
        receiver_id: toId,
      });

      socket.emit("sendMessage", {
        content: message,
        sender: user._id,
        session_id: id,
      });

      setMessages((prevMessages) => [...prevMessages, data]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};

    messages.forEach((msg) => {
      const date = new Date(msg.createdAt || Date.now());
      const dateKey = date.toLocaleDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(msg);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#868ddb] to-[#252644]">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg flex flex-col h-[85vh] border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 justify-between flex items-center bg-white rounded-t-lg">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold mr-3">
            {toId?.charAt(0)?.toUpperCase() || "C"}
          </div>{" "}
          <div>
            <h2 className="font-semibold text-gray-800">Chat Session</h2>
            <p className="text-xs text-gray-500">ID: {id}</p>
          </div>
          <div>
            <Link to={`/video-call/${id}`}>
              {" "}
              <Video />
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date} className="space-y-3">
              <div className="flex justify-center">
                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>

              {msgs.map((msg) => {
                const isSender = msg.sender_id === user._id;

                return (
                  <div
                    key={msg._id}
                    className={`flex ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-[75%] ${
                        isSender
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          isSender ? "text-blue-200" : "text-gray-500"
                        }`}
                      >
                        {new Date(
                          msg.createdAt || Date.now()
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 flex items-center gap-3 border-t border-gray-200 bg-white rounded-b-lg">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className={`px-5 py-3 rounded-lg transition-colors flex items-center justify-center ${
              message.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
