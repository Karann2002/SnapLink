import { Ellipsis, Maximize, Send, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { useUser } from "../Context/UserContext";

const MessageShortCut = () => {
  const socket = io("http://localhost:5000", {
    transports: ["websocket"],
  });
  const { user } = useUser();
  const token = localStorage.getItem("token");
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef();
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/conversations/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversations(res.data);
    } catch (err) {
      console.error("Conversation fetch error:", err.response || err.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // For dropdown
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="hidden fixed bottom-7 right-30 z-40 md:flex items-center gap-3 p-3 bg-white rounded-full shadow-xl hover:bg-slate-100 transition-all w-[300px]">
      {/* Toggle Area */}
      <div className="relative" ref={moreRef}>
        <div
          className="w-full flex items-center justify-between gap-10"
          onClick={() => setMoreOpen(!moreOpen)}
        >
          {/* Toggle Button */}
          <button className="flex items-center gap-2 p-2 rounded-full transition">
            <Send className="text-blue-600" />
            <p className="font-semibold text-sm text-gray-800">Messages</p>
          </button>

          {/* Avatar Stack (outside button) */}
          <div className="w-full flex items-center ">
            {conversations.map((conv, idx) => {
              const sUser = conv.participants.find((p) => p._id !== user._id);

              return (
                <div
                  key={sUser._id || idx}
                  className={`flex items-center gap-3 hover:bg-gray-100 cursor-pointer `}
                  onClick={() => {
                    setSelectedUser(sUser);
                    socket.emit("join", user._id);
                  }}
                >
                  <img
                    src={sUser.profilePicUrl || "/default.png"}
                    alt=""
                    className="h-10 w-10  rounded-full object-cover"
                  />
                </div>
              );
            })}

            <button className="h-8 w-8 flex items-center justify-center bg-white border-2 border-white -ml-3 z-10 rounded-full hover:bg-gray-100 transition">
              <Ellipsis size={16} />
            </button>
          </div>
        </div>

        {/* Dropdown Panel */}
        {moreOpen && (
          <div className="absolute overflow-ellipsis z-50 -bottom-5 -right-25 w-[365px] h-[520px] bg-white rounded-2xl shadow-xl border border-gray-200">
            {/* Fixed Header */}
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-3 border-b border-gray-100">
              <h2 className="font-medium text-lg text-gray-700">Messages</h2>
              <div className="flex gap-2">
                <button
                  className="hover:text-gray-600"
                  onClick={() => setMoreOpen(!moreOpen)}
                >
                  <Link to={"/message"}>
                    <Maximize size={18} />
                  </Link>
                </button>
                <button
                  className="hover:text-gray-600"
                  onClick={() => setMoreOpen(!moreOpen)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className=" overflow-y-auto h-[460px]">
              <div className="">
                {conversations.map((conv, idx) => {
                  const sUser = conv.participants.find(
                    (p) => p._id !== user._id
                  );

                  const lastMsg = conv.lastMessage?.text || "No messages yet";
                  const time = conv.lastMessage?.createdAt
                    ? new Date(conv.lastMessage.createdAt).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "";

                  return (
                    <div
                      key={sUser._id || idx}
                      className={`flex items-center gap-3 px-5 py-3 hover:bg-gray-100 cursor-pointer ${
                        selectedUser?._id === sUser._id ? "bg-gray-200" : ""
                      }`}
                      onClick={() => {
                        setSelectedUser(sUser);
                        socket.emit("join", user._id);

                        // reset unread count locally
                        setConversations((prev) =>
                          prev.map((c) =>
                            c.participants.some((p) => p._id === sUser._id)
                              ? { ...c, unreadCount: 0 }
                              : c
                          )
                        );
                      }}
                    >
                      <img
                        src={sUser.profilePicUrl || "/default.png"}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{sUser.username}</p>
                        <p className="text-sm text-gray-500 truncate w-40">
                          {lastMsg}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{time}</p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageShortCut;
