import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {  CircleAlert, Heart, Image, Mic, Phone, Send, Smile, Video } from "lucide-react";
import { VscSend } from "react-icons/vsc";
import EmojiPicker from "emoji-picker-react";

import { useUser } from "../../Context/UserContext";
import UserStory from "./UserStory";

const StoryViewer = () => {
  const {user} = useUser();
  const [showEmoji, setShowEmoji] = useState(false);
  
  const [userStory] = useState([
    {
      image: './../../../public/logo/download.jpg',
      title: "New task assigned",
      username: "karan___kusheah",
      timestamp: Date.now() - 100000,
    },
  ])
  const [stories] = useState([
    {
      image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=800",
      title: "New task assigned",
      username: "karan___kusheah",
      timestamp: Date.now() - 100000,
    },
    {
      image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=800",
      title: "Another task",
      username: "karan___kusheah",
      timestamp: Date.now() - 200000,
    },
    {
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
      title: "New message from Admin",
      username: "office_updates",
      timestamp: Date.now() - 7200000,
    },
    {
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
      title: "Weekend plan!",
      username: "alice_w",
      timestamp: Date.now() - 5000000,
    },
    {
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
      title: "Design mockups ready",
      username: "ui_designer",
      timestamp: Date.now() - 86400000,
    },
    {
      image: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800",
      title: "Another update",
      username: "office_updates",
      timestamp: Date.now() - 172800000,
    },
  ]);

  // Group stories by username
  const groupedStories = stories.reduce((acc, story) => {
    if (!acc[story.username]) acc[story.username] = [];
    acc[story.username].push(story);
    return acc;
  }, {});

  const userList = Object.keys(groupedStories); // ordered list of users

  const [activeUser, setActiveUser] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentStories = activeUser ? groupedStories[activeUser] : [];

  // Auto progress
  useEffect(() => {
    let interval;
    if (activeUser !== null) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeUser, activeIndex]);

  const handleNext = () => {
    if (activeIndex < currentStories.length - 1) {
      // Next story of same user
      setActiveIndex(activeIndex + 1);
    } else {
      // Go to next user
      const currentUserIndex = userList.indexOf(activeUser);
      if (currentUserIndex < userList.length - 1) {
        setActiveUser(userList[currentUserIndex + 1]);
        setActiveIndex(0);
      } else {
        // No more users → close viewer
        setActiveUser(null);
      }
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      // Go to previous user’s last story
      const currentUserIndex = userList.indexOf(activeUser);
      if (currentUserIndex > 0) {
        const prevUser = userList[currentUserIndex - 1];
        setActiveUser(prevUser);
        setActiveIndex(groupedStories[prevUser].length - 1);
      }
    }
  };

  return (
    <div>
      <div className="flex gap-4 overflow-x-auto">
       <UserStory/>
        {userList.map((username, index) => {
          const firstStory = groupedStories[username][0];
          return (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                setActiveUser(username);
                setActiveIndex(0);
              }}
            >
              
              <div className="h-20 w-20 rounded-full border-2 border-pink-500 overflow-hidden">
                 
                <img
                  src={firstStory.image}
                  alt={firstStory.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xs mt-1 w-20 items-center truncate">{username}</span>
            </div>
          );
        })}
      </div>

      {/* Viewer */}
     {activeUser && (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div className="relative w-full max-w-md h-full sm:h-[90vh] sm:rounded-xl overflow-hidden flex flex-col">
      
      {/* Progress Bar */}
      <div className="absolute top-2 left-0 right-0 flex gap-1 px-3 sm:px-6">
        {currentStories.map((_, i) => (
          <div key={i} className="flex-1 bg-gray-600 h-1 rounded overflow-hidden">
            {i === activeIndex && (
              <motion.div
                className="bg-white h-1"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Header: Profile info */}
      <div className="absolute top-6 left-0 flex items-center gap-2 px-3 sm:px-6 text-white">
        <img
          src={currentStories[activeIndex].image}
          alt="profile"
          className="h-10 w-10 rounded-full object-cover border border-gray-400"
        />
        <p className="font-semibold text-sm sm:text-base">
          {currentStories[activeIndex].username}
        </p>
      </div>

      {/* Story Image */}
      <img
        src={currentStories[activeIndex].image}
        alt="story"
        className="w-full h-full object-contain sm:object-cover"
      />

      {/* Message Input + Reactions */}
      <div className="absolute bottom-3 left-0 w-full px-3 sm:px-6">
        <div className="flex items-center gap-2 bg-opacity-30 border border-gray-600 px-3 py-2 rounded-full">
          
          {/* Emoji Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmoji((prev) => !prev)}
              className="text-gray-300 hover:text-blue-400"
            >
              <Smile size={22} />
            </button>
            {showEmoji && (
              <div className="absolute bottom-12 left-0 z-50">
                <EmojiPicker theme="light" />
              </div>
            )}
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
            // value={message}
            // onChange={(e) => setMessage(e.target.value)}
            // onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          {/* Heart Reaction */}
          <button
            // onClick={() => sendMessage("❤️")}
            className="text-gray-300 hover:scale-110 transition"
          >
            <Heart size={22} />
          </button>

          {/* Send */}
          <button
            // onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
          >
            <VscSend size={16} />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex justify-between items-center">
        <button onClick={handlePrev} className="p-3">
          <ChevronLeft className="text-white w-7 h-7" />
        </button>
        <button onClick={handleNext} className="p-3">
          <ChevronRight className="text-white w-7 h-7" />
        </button>
      </div>

      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={() => setActiveUser(null)}
      >
        ✕
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default StoryViewer;
