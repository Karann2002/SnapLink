import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useUser } from "../../Context/UserContext";

const UserStory = () => {
  const { user } = useUser();
  const [userStory] = useState([
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
  ]);

  // Group stories by username
  const groupedStories = userStory.reduce((acc, story) => {
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
        <div
          className="flex flex-col items-center cursor-pointer relative"
          onClick={() => {
            if (groupedStories[user?.username]) {
              setActiveUser(user?.username);
              setActiveIndex(0);
            }
          }}
        >
          {userStory == 0 ? (
            <div>
              <div className="relative h-16 w-16 rounded-full border-2 border-gray-300 overflow-hidden ">
                <img
                  src={user?.profilePicUrl}
                  alt="Your story"
                  className="h-full w-full object-cover"
                />
                {/* Show + if no story */}
                {!groupedStories[user?.username] && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
                    <Plus size={14} />
                  </div>
                )}
              </div>
              <span className="flex text-xs mt-1 w-20 truncate justify-center items-center">Your Story</span>
            </div>
          ) : (
            <div>
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
                    <div className="flex h-20 w-20 rounded-full border-2 border-pink-500 overflow-hidden justify-center items-center">
                      <img
                        src={user?.profilePicUrl}
                        alt="Your story"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="flex text-xs mt-1 w-20 truncate justify-center items-center">
                      Your Story
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Viewer */}
      {activeUser && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
          <div className="relative w-full h-[100vh] max-w-md">
            <div>
              <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
                {currentStories.map((_, i) => (
                  <div key={i} className="flex-1 bg-gray-500 h-1 ">
                    {i === activeIndex && (
                      <motion.div
                        className="bg-white h-1 "
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="absolute flex gap-2 top-8 justify-center items-center text-white px-2 sm:px-6">
                <img
                  src={user?.profilePicUrl}
                  alt=""
                  className="h-10 w-10 object-cover rounded-full"
                />
                <p className="font-semibold text-sm sm:text-base">
                  {user?.username}
                </p>
              </div>
            </div>

            <img
              src={currentStories[activeIndex].image}
              alt="story"
              className="w-full h-[100vh] object-cover "
            />

            <div className="absolute inset-0 flex">
              <div className="w-1/2 flex items-center" onClick={handlePrev}>
                {/* <ChevronLeft className="text-white" /> */}
              </div>
              <div
                className="w-1/2 flex items-center justify-end"
                onClick={handleNext}
              >
                {/* <ChevronRight className="text-white" /> */}
              </div>
            </div>
          </div>

          {/* Close */}
          {/* <button
            className="absolute top-4 right-4 text-white text-lg"
            onClick={() => setActiveUser(null)}
          >
            ✕
          </button> */}
        </div>
      )}
    </div>
  );
};

export default UserStory;
