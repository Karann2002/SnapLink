import React, { useState, useEffect } from "react";
import {
  Bookmark,
  BookMarked,
  EllipsisVertical,
  Heart,
  MessageCircle,
  Save,
  Send,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import axios from "axios";
import PostSkeleton from "../Components/Loading/PostSkeleton";
import LikeButton from "../Components/Post/LikeButton";
import { useUser } from "../Context/UserContext";
import socket from "../../socket";
import FollowButton from "../Components/followUnfollow/FollowButton";
import { Link } from "react-router-dom";
import StoryViewer from "../Components/Stories/story";
import SwitchLogin from "../Auth/Login/SwitchLogin";
import ShareButton from "../Components/Post/ShareButton";

const Home = ({ profileUser }) => {
  const token = localStorage.getItem("token");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loginPopup, setLoginPopup] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({});
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchFeed = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(res.data.filter((post) => post.author._id !== user._id));

      res.data.forEach((post) => {
        fetchCommentsForPost(post._id);
      });
    } catch (err) {
      console.error("Fetch error:", err.response || err.message || err);
      alert("Failed to fetch posts. Check token or server.");
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data.filter((u) => u._id !== user._id));
    } catch (err) {
      console.error("Fetch error:", err.response || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsForPost = async (postId) => {
    try {
      // socket.emit("CommentPost", { postId, userId: user.id });
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/comments`
      );
      setComments((prev) => ({
        ...prev,
        [postId]: res.data || [],
      }));
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/posts/comment/${postId}`,
        {
          text, // ✅ send the actual comment string
          userCommentProfilePicUrl: user?.profilePicUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));

      fetchCommentsForPost(postId);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      socket.emit("addUser", user._id); // join personal room
    }
  }, [user]);

  useEffect(() => {
    const handlePostCommented = ({ postId: commentedPostId }) => {
      fetchCommentsForPost(commentedPostId);
    };

    socket.on("postCommented", handlePostCommented);

    return () => {
      socket.off("postCommented", handlePostCommented);
    };
  }, []);
  useEffect(() => {
    fetchFeed();
    fetchUsers();
  }, []);
  return (
    <div className=" md:px-30 ">
      <div className="md:hidden flex justify-between px-4 py-4 items-center">
        <h1 className=" text-2xl  items-center  font-bold">SnapLink </h1>
        <div className="flex gap-5 items-center">
          <Heart />

          <Link to="/message">
            <Send size={24} />
          </Link>
        </div>
      </div>

      <div>
        {loading ? (
          Array.from({ length: 1 }).map((_, idx) => <PostSkeleton key={idx} />)
        ) : (
          <div className="flex md:flex-row flex-col">
            {/* FEED SECTION */}
            <div className="w-full flex flex-col items-center min-h-screen md:pr-20">
              {/* STORIES */}
              <div className="w-full max-w-2xl overflow-x-auto px-2 flex gap-4 py-4  border-gray-300">
                <StoryViewer />
              </div>

              {/* FEED POSTS */}
              <div className="w-full max-w-xl mt-3 md:mt-3 space-y-6">
                {posts.map((post) => (
                  <div key={post._id} className="bg-white md:px-5 ">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center px-2 gap-3 mb-3">
                        <Link to={`/profile/${post.author?.username}`}>
                          {
                            <img
                              src={post.authorProfilePicUrl}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          }
                        </Link>

                        <div>
                          <Link to={`/profile/${post.author?.username}`}>
                            <h1 className="font-semibold text-sm">
                              {post.author?.username || "N/A"}
                            </h1>
                          </Link>
                          <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <EllipsisVertical size={20} />
                      </div>
                    </div>
                    <div
                      className="rounded-sm "
                      onClick={() => {
                        setShowPopup(true);
                        setSelectedPost(post);
                      }}
                    >
                      {post.mediaType === "video" ? (
                        <video
                          src={post.imageUrl}
                          controls={false}
                          loop
                          playsInline
                          autoPlay
                          preload="auto"
                          disablePictureInPicture
                          className="w-full object-contain max-h-[400px]"
                        />
                      ) : (
                        <img
                          src={post.imageUrl}
                          alt="Post"
                          className="w-full object-contain max-h-[400px]"
                        />
                      )}
                      {showPopup && (
                        <Dialog
                          open={showPopup}
                          onClose={setShowPopup}
                          className="relative z-50 hidden md:flex"
                        >
                          <DialogBackdrop className="fixed inset-0 bg-black/50 opacity-20" />

                          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <DialogPanel className="w-full h-full mx-60 my-10 rounded-lg bg-white ">
                              <div className="bg-white flex  bg-opacity-100 h-full w-full relative ">
                                <div className="flex justify-center">
                                  {selectedPost.mediaType === "video" ? (
                        <video
                          src={selectedPost.imageUrl}
                          controls={false}
                          loop
                          playsInline
                          autoPlay
                          preload="auto"
                          disablePictureInPicture
                          className="max-w-130  object-contain "
                        />
                      ) : (
                        <img
                          src={selectedPost.imageUrl}
                          alt="Post"
                          className="max-w-130 object-contain h-full"
                        />
                      )}
                                </div>
                                <div className="flex flex-col w-full justify-between ">
                                  <div>
                                    <div key={post.id} className="bg-white ">
                                      <div className="flex items-center pl-5 gap-3 py-3 border-b border-gray-200">
                                        <img
                                          src={selectedPost.authorProfilePicUrl}
                                          alt=""
                                          className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div className="">
                                          <h1 className="font-semibold text-sm">
                                            {selectedPost.author?.username ||
                                              "N/A"}
                                          </h1>
                                          <p className="text-xs text-gray-500">
                                            {new Date(
                                              selectedPost.createdAt
                                            ).toLocaleTimeString()}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="mt-1 text-sm py-3 pl-5">
                                        <div className="flex items-center gap-3 mb-3">
                                          <img
                                            src={
                                              selectedPost?.authorProfilePicUrl
                                            }
                                            alt=""
                                            className="h-10 w-10 rounded-full object-cover"
                                          />
                                          <div className="flex gap-2">
                                            <h1 className="font-semibold text-sm">
                                              {selectedPost.author?.username ||
                                                "N/A"}
                                            </h1>
                                            <span className="text-gray-700">
                                              {selectedPost.caption}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="py-2 pl-5">
                                        <p className="text-sm font-normal">
                                          all comments
                                        </p>
                                        <div className="space-y-1 h-80 py-2 overflow-y-auto">
                                          {(
                                            comments[selectedPost._id] || []
                                          ).map((c, i) => (
                                            <div className="py-2">
                                              <p
                                                key={i}
                                                className="flex gap-2 text-sm"
                                              >
                                                <img
                                                  src={
                                                    c.userCommentProfilePicUrl
                                                  }
                                                  alt="profile pic"
                                                  className="h-7 w-7 rounded-full object-cover"
                                                />
                                                <span className="font-semibold">
                                                  {c.userId?.username || "User"}
                                                  :
                                                </span>{" "}
                                                {c.text}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="py-2 px-5 ">
                                      <LikeButton
                                        postId={selectedPost._id}
                                        initialLikes={selectedPost.likes}
                                        initialComments={selectedPost.comments}
                                        currentUserId={user._id}
                                      />
                                      {/* <CommentButton
                                        postId={selectedPost._id}
                                        initialComments={selectedPost.comments}
                                        currentUserId={user._id}
                                      />  */}
                                      <p className="pt-2  text-xs text-gray-500">
                                        {new Date(
                                          selectedPost.createdAt
                                        ).toLocaleTimeString()}
                                      </p>
                                    </div>

                                    <div className="my-2 flex border-t border-gray-200 ">
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault(); // prevent page reload
                                          handleComment(selectedPost._id);
                                        }}
                                        className="flex justify-between w-full"
                                      >
                                        <input
                                          type="text"
                                          value={commentText}
                                          onChange={(e) =>
                                            setCommentText(e.target.value)
                                          }
                                          placeholder="Add a comment..."
                                          className="flex-grow w-full px-3 py-2 text-sm outline-none"
                                        />
                                        <button
                                          type="submit"
                                          className="py-2 px-4 text-blue-600 font-semibold text-sm"
                                        >
                                          Post
                                        </button>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogPanel>
                          </div>
                        </Dialog>
                      )}
                    </div>

                    {/* Like & Caption */}
                    <div className="mt-2 px-2">
                      <LikeButton
                        postId={post._id}
                        initialLikes={post.likes}
                        initialComments={post.comments}
                        currentUserId={user._id}
                      />
                      <ShareButton/>
                      <div className="mt-1 text-sm">
                        <span className="font-semibold">
                          {post.author?.username}
                        </span>{" "}
                        <span className="text-gray-700">{post.caption}</span>
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="py-2 px-2">
                      <p className="text-sm font-normal mb-1">
                        View all comments
                      </p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {(comments[post._id] || []).map((c, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Link to={`/profile/${c.userId?.username}`}>
                              <img
                                src={c.userCommentProfilePicUrl}
                                alt="profile pic"
                                className="h-6 w-6 rounded-full object-cover"
                              />
                            </Link>
                            <p>
                              <span className="font-semibold">
                                <Link to={`/profile/${c.userId?.username}`}>
                                  {c.userId?.username || "User"}
                                </Link>
                                :
                              </span>{" "}
                              {c.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center mt-2 px-2">
                        <input
                          type="text"
                          value={commentText[post._id] || ""}
                          onChange={(e) =>
                            setCommentText((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                          placeholder="Add a comment..."
                          className="flex-grow text-sm rounded px-3 py-1 outline-none "
                        />
                        <button
                          onClick={() => handleComment(post._id)}
                          className="ml-2 text-blue-600 font-semibold text-sm"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTIONS - HIDDEN ON MOBILE */}
            <div className="hidden md:block w-full max-w-sm p-5">
              <div className="flex justify-between items-center">
                <Link to={"/profile"}>
                  <div className="flex gap-3 items-center">
                    <img
                      src={user?.profilePicUrl}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm">{user?.username}</p>
                      <p className="font-light text-xs">{user?.fullName}</p>
                    </div>
                  </div>
                </Link>
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => {
                    setLoginPopup(true);
                  }}
                >
                  Switch
                </button>
                {loginPopup && (
                  <Dialog
                    open={loginPopup}
                    onClose={setLoginPopup}
                    className="relative z-50 hidden md:flex"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-black/50 opacity-20" />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <DialogPanel className=" mx-60 my-10 rounded-lg bg-white ">
                        <SwitchLogin />
                      </DialogPanel>
                    </div>
                  </Dialog>
                )}
              </div>

              <div className="flex justify-between mt-5">
                <p className="text-sm">Suggested for you</p>
                <button className="text-sm">See All</button>
              </div>

              <div className="flex flex-col py-2 space-y-2">
                {users.map((sUser) => (
                  <div
                    key={sUser._id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <Link to={`/profile/${sUser?.username}`}>
                        <img
                          src={sUser?.profilePicUrl}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </Link>
                      <div>
                        <Link to={`/profile/${sUser?.username}`}>
                          <p className="font-bold text-sm">{sUser?.username}</p>
                        </Link>
                        <p className="text-xs">{sUser?.fullName}</p>
                      </div>
                    </div>
                    <FollowButton profileUserId={sUser._id} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
