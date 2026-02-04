import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Clapperboard,
  Compass,
  Heart,
  House,
  Search,
  Send,
  SquarePlus,
  ChartNoAxesCombined,
  SlidersHorizontal,
  Shapes,
  Settings,
  SquareActivity,
  Bookmark,
  Sun,
  MessageSquareWarning,
  Images,
  Radio,
  TrendingUp,
  Boxes,
  X,
  Instagram,
} from "lucide-react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import SearchBar from "../../Pages/SearchBar";
import CreatePost from "../Post/CreatePost";
import { useUser } from "../../Context/UserContext";
import Notification from "../../Pages/Notification";
import SwitchLogin from "../../Auth/Login/SwitchLogin";
import Message from "../../Pages/Message";

const ClientSideBar = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const [showNotifyPanel, setShowNotifyPanel] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [showSwitchLogin, setShowSwitchLogin] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const moreRef = useRef(null);
  const searchPanelRef = useRef(null);
  const notifyPanelRef = useRef(null);
  const messagePanelRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Close panels on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target)) {
        setShowSearchPanel(false);
      }
      if (notifyPanelRef.current && !notifyPanelRef.current.contains(e.target)) {
        setShowNotifyPanel(false);
      }
      if (messagePanelRef.current && !messagePanelRef.current.contains(e.target)) {
      setShowMessagePanel(false);
    }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  // Auto-collapse when search or notify open
 useEffect(() => {
  
  // collapsed only when none of the panels are open
  setIsCollapsed((showSearchPanel || showNotifyPanel || showMessagePanel));
}, [showSearchPanel, showNotifyPanel, showMessagePanel]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed flex-col p-4 bg-white h-screen border-r border-gray-200 transition-all duration-300 ease-in-out z-20
          ${isCollapsed ? "w-20" : "w-62"}`}
      >
        {/* Logo */}
        <div className="flex gap-2 m-2 pt-5 pb-5 items-center">
          <Instagram />
          {!isCollapsed && (
            <Link to="/">
              <h1 className="text-2xl font-bold">SnapLink</h1>
            </Link>
          )}
        </div>

        {/* Menu Items */}
        <ul className="space-y-2">
          {/* Home */}
          <li
            className={`hover:bg-slate-100 rounded-sm ${
              location.pathname === "/" ? "bg-slate-100 font-bold" : ""
            }`}
            
          >
            <Link to="/" className="flex gap-4 items-center p-3">
              <House />
              {!isCollapsed && <p>Home</p>}
            </Link>
          </li>

          {/* Search */}
          <div ref={searchPanelRef}
          >
            
            <li
              className="hover:bg-slate-100 rounded-sm cursor-pointer"
              onClick={() => {setShowSearchPanel(true)
                isCollapsed(true)}
              }
            >
              <div className="flex gap-4 items-center p-3">
                <Search />
                {!isCollapsed && <p>Search</p>}
              </div>
            </li>
            
            {showSearchPanel && (
              <div className="fixed top-0 left-20 h-full w-[400px] bg-white rounded-r-2xl border-r border-gray-300 z-50">
                <SearchBar />
              </div>
            )}
          </div>

          {/* Explore */}
          <li
            className={`hover:bg-slate-100 rounded-sm ${
              location.pathname === "/explore" ? "bg-slate-100 font-bold" : ""
            }`}
          >
            <Link to="/explore" className="flex gap-4 items-center p-3">
              <Compass /> {!isCollapsed && <p>Explore</p>}
            </Link>
          </li>

          {/* Reels */}
          <li
            className={`hover:bg-slate-100 rounded-sm ${
              location.pathname === "/reels" ? "bg-slate-100 font-bold" : ""
            }`}
          >
            <Link to="/reels" className="flex gap-4 items-center p-3">
              <Clapperboard /> {!isCollapsed && <p>Reels</p>}
            </Link>
          </li>

          {/* Messages */}
          <div 
          ref={messagePanelRef}
          >
           <li
  className={`hover:bg-slate-100 rounded-sm ${
    location.pathname === "/message" ? `bg-slate-100 font-bold $` : ""
  }`}
  onClick={() => {
    setShowMessagePanel(true);
    isCollapsed(true); 
  }}
>
  <Link  className="flex gap-4 items-center p-3">
    <Send /> {!isCollapsed && <p>Message</p>}
  </Link>
</li>
{showMessagePanel && (
              <div className="fixed top-0 left-70 h-full md:w-314 bg-white rounded-r-2xl border-r border-gray-300 ">
                <Message/>
              </div>
            )}
            
          </div>

          {/* Notifications */}
          <div ref={notifyPanelRef}>
            <li
              className="hover:bg-slate-100 rounded-sm cursor-pointer"
              onClick={() => setShowNotifyPanel(true)}
            >
              <div className="flex gap-4 items-center p-3">
                <Heart />
                {!isCollapsed && <p>Notifications</p>}
              </div>
            </li>
            {showNotifyPanel && (
              <div className="fixed top-0 left-20 h-full w-[400px] bg-white rounded-r-2xl border-r border-gray-300 z-50">
                <div className="border-b p-5">
                  <h1 className="font-bold text-2xl">Notifications</h1>
                </div>
                <Notification />
              </div>
            )}
          </div>

          {/* Create */}
          <li
            className="hover:bg-slate-100 rounded-sm cursor-pointer"
            onClick={() => setShowCreate(true)}
          >
            <div className="flex gap-4 items-center p-3">
              <SquarePlus />
              {!isCollapsed && <p>Create</p>}
            </div>
          </li>

          {/* Dashboard */}
          <li>
            <Link to="/dashboard" className="flex gap-4 items-center p-3">
              <ChartNoAxesCombined /> {!isCollapsed && <p>Dashboard</p>}
            </Link>
          </li>

          {/* Profile */}
          <li>
            <Link to={`/${user.username}`} className="flex gap-4 items-center p-3">
              <img
                src={user?.profilePicUrl}
                alt="profile"
                className="rounded-full h-7 w-7 object-cover"
              />
              {!isCollapsed && <p>Profile</p>}
            </Link>
          </li>

          {/* More Dropdown */}
          <div ref={moreRef} className="relative">
            <li
              className="hover:bg-slate-100 rounded-sm cursor-pointer"
              onClick={() => setMoreOpen(!moreOpen)}
            >
              <div className="flex gap-4 items-center p-3">
                <SlidersHorizontal />
                {!isCollapsed && <p>More</p>}
              </div>
            </li>

            {moreOpen && (
              <div className="absolute -top-87 left-2 mt-2 w-64 bg-white  rounded-lg shadow-xl z-50">
                <ul className="">
                  <li className="hover:bg-slate-100 p-3">
                    <Link to="/setting" className="flex gap-3">
                      <Settings size={18} /> Settings
                    </Link>
                  </li>
                  <li className="hover:bg-slate-100 p-3">
                    <Link to="/activity" className="flex gap-3">
                      <SquareActivity size={18} /> Your Activity
                    </Link>
                  </li>
                  <li className="hover:bg-slate-100 p-3">
                    <Link to="/profile" className="flex gap-3">
                      <Bookmark size={18} /> Saved
                    </Link>
                  </li>
                  <li className="hover:bg-slate-100 p-3 flex gap-3">
                    <Sun size={18} /> Switch Appearance
                  </li>
                  <li className="hover:bg-slate-100 p-3 flex gap-3">
                    <MessageSquareWarning size={18} /> Report a Problem
                  </li>
                  <li
                    className="hover:bg-slate-100 p-3 flex gap-3 cursor-pointer"
                    onClick={() => setShowSwitchLogin(true)}
                  >
                    Switch Accounts
                  </li>
                  <li
                    className="hover:bg-slate-100 p-3 flex gap-3 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Meta */}
          <li>
            <Link to="/meta" className="flex gap-4 items-center p-3">
              <Shapes /> {!isCollapsed && <p>Also From Meta</p>}
            </Link>
          </li>
        </ul>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">
        <Link to="/"><House size={24} /></Link>
        <Link to="/search"><Search size={24} /></Link>
        <Link to="/create"><SquarePlus size={24} /></Link>
        <Link to="/reels"><Clapperboard size={24} /></Link>
        <Link to="/profile">
          <img
            src={user?.profilePicUrl}
            alt="profile"
            className="rounded-full h-7 w-7 object-cover"
          />
        </Link>
      </div>

      {/* Create Post Modal */}
      <Dialog open={showCreate} onClose={setShowCreate} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg rounded-2xl bg-white shadow-lg">
            <DialogTitle className="flex justify-between p-4 border-b">
              <p className="font-semibold">New Post</p>
              <button onClick={() => setShowCreate(false)}><X /></button>
            </DialogTitle>
            <CreatePost />
          </DialogPanel>
        </div>
      </Dialog>

      {/* Switch Login Modal */}
      <Dialog open={showSwitchLogin} onClose={setShowSwitchLogin} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm rounded-2xl bg-white shadow-lg">
            <SwitchLogin />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default ClientSideBar;
