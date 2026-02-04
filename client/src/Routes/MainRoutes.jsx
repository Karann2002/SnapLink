import React from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import Home from '../Pages/Home'
import ClientLayout from '../Layout/ClientLayout'
import DashBoard from '../Pages/DashBoard'
import Search from '../Pages/SearchBar'
import AlsoFromMeta from '../Pages/AlsoFromMeta'
import Notification from '../Pages/Notification'
import Message from '../Pages/Message'
import More from '../Pages/More'
import Create from '../Pages/Create'
import Reels from '../Pages/Reels'
import Explore from '../Pages/Explore'
import Profile from '../Components/Profile/Profile'
import Login from '../Auth/Login/Login'
import SignUp from '../Auth/SignUp/SignUp'
import ProtectedRoute from './ProtectedRoutes'
import ExplorePage from '../Components/ExplorePage/ExplorePage'
import CreatePost from '../Components/Post/CreatePost'
import UserProfile from '../Components/Profile/UserProfile'
import SettingLayout from '../Components/Setting/Layout/SettingLayout'
import EditProfile from '../Components/Profile/EditProfile'
import HeroLoading from '../Components/Loading/HeroLoading'

const MainRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("token")

return (
    <>
     
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<SignUp/>}/>
     
      <Route path='/' element={isAuthenticated ? <ProtectedRoute><ClientLayout/></ProtectedRoute> : <Login/>}>

      {/* <Route path='/account' element={<ProtectedRoute><ClientLayout/></ProtectedRoute>}> */}
      <Route index element={<Home />} />
      {/* <Route path='home' element={<Home/>}/> */}
      <Route path="dashboard" element={<DashBoard/>}/>
      <Route path=":username" element={<Profile/>}/>
      <Route path="explore" element={<ExplorePage/>}/>
      <Route path="reels" element={<Reels/>}/>
      <Route path="create" element={<Create/>}/>
      <Route path="loading" element={<HeroLoading/>}/>

      <Route path="create/post" element={<CreatePost/>}/>

      <Route path="more" element={<More/>}/>
      <Route path="message" element={<DashBoard/>}/>
      <Route path="notification" element={<Notification/>}/>
      <Route path="meta" element={<AlsoFromMeta/>}/>
      <Route path="search" element={<Search/>}/>
       <Route path="search/:username" element={<UserProfile />} />
<Route path='setting' element={<ProtectedRoute><SettingLayout/></ProtectedRoute>}>
      <Route index element={<Navigate to="/setting/edit" replace />} />

      <Route path="edit" element={<EditProfile/>}/>
      
      </Route>

      
      </Route>
      

      

    </Routes>
    </>
  )
}

export default MainRoutes