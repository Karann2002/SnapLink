import React, { useEffect, useRef,useState } from "react";
import { Link } from "react-router-dom";
import { VscSend } from "react-icons/vsc";
import axios from "axios";
import { io } from "socket.io-client";
import { useUser } from "../Context/UserContext";
import {  CircleAlert, Heart, Image, Mic, Phone, Send, Smile, Video } from "lucide-react";
import EmojiPicker from "emoji-picker-react";



const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const Message = () => {
  const { user } = useUser();
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("feed");
const [showEmoji, setShowEmoji] = useState(false);
const fileInputRef = useRef(null);
const chatEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
const [conversations, setConversations] = useState([]);
const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const tabs = [
    { id: "feed", label: "Primary" },
    { id: "reels", label: "General" },
    { id: "saved", label: "Request" },
    
  ];

useEffect(() => {
  if (chatEndRef.current) {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [chat]);

const onEmojiClick = (emojiData) => {
  setMessage((prev) => prev + emojiData.emoji);
  setShowEmoji(false);
};

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
  const fetchSearch = async () => {
    if (!query) return setResults([]);
    const res = await fetch(`http://localhost:5000/api/search?q=${query}`);
    const data = await res.json();
    setResults(data); 
    
    // This now contains { users, posts, tags }
   
  };
  fetchSearch();
}, [query]);
  // 🚀 fetch messages between users
useEffect(() => {
  const fetchMessages = async () => {
    if (!selectedUser || !selectedUser._id) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/${user._id}/${selectedUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChat(res.data);
    } catch (err) {
      console.error("Message fetch error:", err.response?.data || err.message);
    }
  };

  fetchMessages();
}, [selectedUser, user._id, token]);



  // 🚀 fetch users once
  useEffect(() => {
    fetchConversations();
  }, []);

  // 🚀 join socket room
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  // 🚀 listen to incoming message
useEffect(() => {
  socket.on("receiveMessage", (data) => {
    // 1. Update active chat window
    if (
      data.sender === selectedUser?._id ||
      data.receiver === selectedUser?._id
    ) {
      setChat((prev) => [...prev, data]);
    }

    // 2. Update conversations sidebar
    setConversations((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex((c) =>
        c.participants.some((p) => p._id === data.sender || p._id === data.receiver)
      );

      if (idx !== -1) {
        // move conversation to top & update lastMessage
        const conv = { ...updated[idx] };
        conv.lastMessage = data;

        // increase unread count if I'm not the sender
        if (data.sender !== user._id) {
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }

        updated.splice(idx, 1); // remove old
        return [conv, ...updated]; // put updated on top
      } else {
        // new conversation
        const otherUser =
          data.sender === user._id ? data.receiverObj : data.senderObj;

        return [
          {
            _id: Date.now(), // temporary until backend sends real id
            participants: [user, otherUser],
            lastMessage: data,
            unreadCount: data.sender !== user._id ? 1 : 0,
          },
          ...updated,
        ];
      }
    });
  });

  // return () => socket.off("receiveMessage");
}, [selectedUser, user]);


  // 🚀 send message
const sendMessage = (quickMsg) => {
  const textToSend = typeof quickMsg === "string" ? quickMsg : message;

  if (textToSend && textToSend.trim() && selectedUser) {
    const msgData = {
      sender: user._id,
      receiver: selectedUser._id,
      text: textToSend.trim(),
      createdAt: new Date(),
      senderProfilePic: user?.profilePicUrl,
      receiverProfilePic: selectedUser.profilePicUrl,
    };

    socket.emit("privateMessage", msgData);
    setMessage(""); // clear input

    setTimeout(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, 100);
  }
};


  const renderTabContent = () => {
      switch (activeTab) {
        case "feed":
          return (
            <div>
<div className='px-3 py-3 '>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-gray-100 p-2  rounded-md w-full outline-none "
      />
      <div>
                      
                      <div className="p-2">
        
          <div>
           
              <>
                {/* USERS */}
                {results.users?.length > 0 && (
                  <div className="absolute bg-white w-[355px]">
                    {results.users.map((user, idx) => (
                      
                      <div key={idx} className="flex  items-center hover:bg-slate-100 p-2 gap-3 mb-3"
                      onClick={() => {
  setSelectedUser(user);
  socket.emit("join", user._id);

  // reset unread count locally
  setConversations((prev) =>
    prev.map((c) =>
      c.participants.some((p) => p._id === user._id)
        ? { ...c, unreadCount: 0 }
        : c
    )
  );
}}>
                        <img
                          src={user?.profilePicUrl} 
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <h1 className="font-semibold text-sm">{user.username}</h1>
                        </div>
                      </div>
                      
                    ))}
                  </div>
                )}
      
              </>
            
          </div>
        
      </div>
      
                    </div>
      </div>
    {conversations.map((conv, idx) => {
  const sUser = conv.participants.find(p => p._id !== user._id);
  

  const lastMsg = conv.lastMessage?.text || "No messages yet";
  const time = conv.lastMessage?.createdAt
    ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
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
        <p className="text-sm text-gray-500 truncate w-40">{lastMsg}</p>
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
          );
        case "reels":
          return <div className="p-4">📁 General updates here</div>;
        case "saved":
          return <div className="p-4">📨 New requests here</div>;
        case "tag":
          return <div className="p-4">📨 New requests here</div>;
        default:
          return null;
      }
    };

  return (
    <div className="relative flex -ml-50 h-screen">
      {/* Sidebar */}
      <div className="w-[390px] border-r border-gray-300">
        <h1 className=" pt-10 p-4 font-bold text-xl">{user?.username}</h1>
        <div className=" space-y-2">
          <div className="w-full  mx-auto">
        {/* Tabs Header */}
        <div className="flex  items-center w-full border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 text-sm flex justify-center w-full font-medium capitalize ${
                activeTab === tab.id
                  ? "border-b-2 border-black-500 text-black-600"
                  : "text-gray-600 hover:text-black-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="w-full h-full">{renderTabContent()}</div>
      </div>
          
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
  {selectedUser ? (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full flex justify-between items-center border-b border-slate-200 p-3">
        <div className="flex items-center gap-3">
          <img
            src={selectedUser.profilePicUrl || "/default.png"}
            alt="profile"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="font-bold">{selectedUser.fullName}</p>
            <p className="text-sm text-gray-500">@{selectedUser.username}</p>
          </div>
        </div>

        {/* Icons */}
        <div className="flex gap-4 text-xl text-gray-600">
          <Phone className="cursor-pointer hover:text-blue-500" />
          <Video className="cursor-pointer hover:text-blue-500" />
          <CircleAlert className="cursor-pointer hover:text-blue-500" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((msg, i) => {
          const isMe = msg.sender === user._id;

          // Format time
          const formattedTime = new Date(msg.createdAt).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          );

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end gap-2 ${
                  isMe ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <img
                  src={isMe ? user.profilePicUrl : selectedUser.profilePicUrl}
                  alt="profile"
                  className="h-8 w-8 rounded-full object-cover"
                />

                {/* Bubble */}
                <div className="flex flex-col max-w-xs">
                  <div
                    className={`px-3 py-2 rounded-2xl shadow text-sm ${
                      isMe
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs text-gray-400 mt-1 self-end">
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
     {/* Input */}
     <div className="px-5 py-2">
<div className="relative flex items-center gap-2 p-3 bg-white px-3 py-2 mb-1  rounded-full outline-none border border-slate-200 text-sm">
  {/* Emoji button */}
  <div className="relative">
    <button
      onClick={() => setShowEmoji((prev) => !prev)}
      className=" hover:text-blue-500"
    >
      <Smile size={25} />
    </button>
    {showEmoji && (
      <div className="absolute bottom-12 left-0 z-50">
        <EmojiPicker onEmojiClick={onEmojiClick} theme="light" />
      </div>
    )}
  </div>

  {/* Input */}
  <input
    type="text"
    placeholder="Type a message..."
    className="flex-grow px-3 py-2 rounded-full outline-none justify-center items-center text-sm"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
  />

  {/* Attachments */}
  <div className="flex items-center gap-2">
    {/* Mic */}
    <button className=" hover:text-blue-500">
      <Mic size={25} />
    </button>

    {/* Image upload */}
    <button
      onClick={() => fileInputRef.current.click()}
      className=" hover:text-blue-500"
    >
      <Image size={25} />
    </button>
    <input
      type="file"
      ref={fileInputRef}
      // onChange={handleFileChange}
      className="hidden"
      accept="image/*"
    />

    {/* Heart reaction */}
    <button
      onClick={() => sendMessage("❤️")}
      className=" hover:scale-110 transition"
    >
      <Heart size={25} />
    </button>
  </div>

  {/* Send */}
  <button
    onClick={sendMessage}
    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
  >
    <VscSend size={18} />
  </button>
</div>
</div>
{/* Auto-scroll anchor */}
<div ref={chatEndRef} />

    </>
  ) : (
    // Empty State
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Send
            size={100}
            className="rounded-full border-2 p-5 text-gray-400"
          />
        </div>
        <div>
          <p className="text-2xl font-light">Your Messages</p>
          <p className="text-gray-500 text-sm">
            Send a message to start a chat.
          </p>
        </div>
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-2xl shadow">
          Send Message
        </button>
      </div>
    </div>
  )}
</div>

    </div>
  );
};

export default Message;
