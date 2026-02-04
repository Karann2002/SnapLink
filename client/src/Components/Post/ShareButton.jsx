import { Check, Send, X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import axios from "axios";
import { useUser } from "../../Context/UserContext";
import { io } from "socket.io-client";

const ShareButton = () => {
  const [sharePopup, setSharePopup] = useState(false);
  const socket = io("http://localhost:5000", {
    transports: ["websocket"],
  });
  const { user } = useUser();
  const token = localStorage.getItem("token");

  const [conversations, setConversations] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

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
    fetchConversations();
  }, []);

  const toggleUserSelection = (sUser) => {
    setSelectedUsers((prev) => {
      if (prev.find((u) => u._id === sUser._id)) {
        // Already selected → remove
        return prev.filter((u) => u._id !== sUser._id);
      } else {
        // Not selected → add
        return [...prev, sUser];
      }
    });
  };

  const handleSend = () => {
    if (selectedUsers.length === 0) return;
    socket.emit("share", {
      from: user._id,
      to: selectedUsers.map((u) => u._id),
      content: "Shared post/reel", // replace with your actual content
    });
    setSharePopup(false);
    setSelectedUsers([]);
  };

  return (
    <div>
      <button onClick={() => setSharePopup(true)}>
        <Send className="cursor-pointer hover:text-purple-500" />
      </button>

      {sharePopup && (
        <Dialog
          open={sharePopup}
          onClose={setSharePopup}
          className="relative z-50"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-lg rounded-lg bg-white shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Share</h2>
                <button onClick={() => setSharePopup(false)}>
                  <X size={28} />
                </button>
              </div>

              {/* Search bar */}
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-md bg-gray-100 px-3 py-2 outline-none"
                />
              </div>

              {/* User list */}
              <div className="flex max-h-72 overflow-y-auto px-4 pb-4 space-y-3">
                {conversations.map((conv, idx) => {
                  const sUser = conv.participants.find(
                    (p) => p._id !== user._id
                  );
                  const isSelected = selectedUsers.some(
                    (u) => u._id === sUser._id
                  );

                  return (
                    <div>
                    <div
                      key={sUser._id || idx}
                      onClick={() => toggleUserSelection(sUser)}
                      className={`flex flex-col items-center rounded-md  p-2 cursor-pointer hover:bg-gray-100 transition `}
                    >
                      <div className="relative">
                        <img
                          src={sUser.profilePicUrl || "/default.png"}
                          alt=""
                          className="h-20 w-20 rounded-full object-cover"
                        />
                        {isSelected && (
                          <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                            <Check size={14} />
                          </span>
                        )}
                      </div>
                      <p className="font-medium">{sUser.username}</p>
                      
                    </div>
                    <div className="flex  gap-3 border-t p-4">
                {isSelected ? (
 <input
                  type="text"
                  placeholder="Write message here....."
                  className="w-full rounded-md  px-3 py-2 outline-none"
                />
                ) : ""}
               
                <button
                  onClick={() => setSharePopup(false)}
                  className="rounded-md border px-4 py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={selectedUsers.length === 0}
                  className={`rounded-md px-4 py-2 text-white ${
                    selectedUsers.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  <Send/>
                </button>
              </div>
              </div>    
                  );
                })}
              </div>

              {/* Footer */}
              
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ShareButton;
