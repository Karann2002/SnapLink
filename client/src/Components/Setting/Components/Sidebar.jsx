import { Bell, ChartNoAxesColumn, ChartNoAxesCombined, CircleUser, Store } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside
      className={`bg-white  ml-30 overflow-y-auto h-[98vh] w-110 border-gray-100 transition-all duration-300 ease-in-out
        `}
    >
      
        <div className='font-bold text-xl px-8 py-5'>
          
          Settings
        </div>
        <div className='rounded-2xl shadow-2xl mx-5 mb-5 px-5 py-3'>
         <p>Meta</p>
         <div className='py-2'>
         <h1 className='font-bold'>Account Center</h1>
         <div className='space-y-3 gap-5 text-xs text-gray-800'>
         <p >Manage your connected experiences and account settings  across Meta Technologies.</p>
         <p>Personal Details</p>
         <p>Password and Security</p>
         <p>Ad Preferences</p>
         <button className='text-blue-700'>See more in Account Center</button>
         </div>
</div>
        </div>
      

      <ul className="space-y-2 px-7 text-sm">

        <p className='text-xs font-semibold text-gray-600 px-2'>How to use SnapLink</p>
        <li className="hover:bg-slate-100 rounded-sm ">
          <Link
            className="flex font-normal gap-4 items-center p-2 pt-3 pb-3"
            to="/setting/edit"
          >
           <CircleUser/>
           <p>Edit Profile</p>
           
          </Link>
        </li>
        
        
        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <Bell/>
            <p>Notifications</p>
          </Link>
        </li>
        <p className='text-xs font-semibold text-gray-600 px-2'>For Professionals</p>

        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <Store/>
            <p>Professional account</p>
          </Link>
        </li>
        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Creator Tools and Controls</p>
          </Link>
        </li>
        <p className='text-xs font-semibold text-gray-600 px-2'>Who can see your content</p>

        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Account Privacy</p>
          </Link>
        </li>
        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Close Friend</p>
          </Link>
        </li>
        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Blocked</p>
          </Link>
        </li>
        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Hide Story and Live</p>
          </Link>
        </li>
        <p className='text-xs font-semibold text-gray-600 px-2'>How others can interact with you</p>

       <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Messages and Story Replies</p>
          </Link>
        </li><li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Tags and mentions</p>
          </Link>
        </li><li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Comments</p>
          </Link>
        </li><li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Sharing and Reuse</p>
          </Link>
        </li><li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Restricted Accounts</p>
          </Link>
        </li><li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Hidden Words</p>

          </Link>
        </li>
        <p className='text-xs font-semibold text-gray-600 px-2'>What you see</p>
        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/explore">
            <ChartNoAxesCombined />
            <p>Muted Accounts</p>
          </Link>
        </li><li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/account/explore">
            <ChartNoAxesCombined />
            <p>Content Preferences</p>
          </Link>
        </li>
        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/account/explore">
            <ChartNoAxesCombined />
            <p>Likes and Share counts </p>
          </Link>
        </li><li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/account/explore">
            <ChartNoAxesCombined />
            <p>Subscriptions</p>
          </Link>
        </li>
        <p className='text-xs font-semibold text-gray-600 px-2'>Your app and media</p>
        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/account/explore">
            <ChartNoAxesCombined />
            <p>Archiving and Downloading</p>
          </Link>
        </li><li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/account/explore">
            <ChartNoAxesCombined />
            <p>Accessibility</p>
          </Link>
        </li>
        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/account/explore">
            <ChartNoAxesCombined />
            <p>Language</p>
          </Link>
        </li><li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/account/explore">
            <ChartNoAxesCombined />
            <p>Website Permissions</p>
          </Link>
        </li>
        <p className='text-xs font-semibold text-gray-600 px-2'>For families</p>

        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/account/explore">
            <ChartNoAxesCombined />
            <p>Family Center</p>
          </Link>
        </li>
        <p className='text-xs font-semibold text-gray-600 px-2'>More info and support</p>
        
        <li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/account/explore">
            <ChartNoAxesCombined />
            <p>Help</p>
          </Link>
        </li><li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/account/explore">
            <ChartNoAxesCombined />
            <p>Privacy Center</p>
          </Link>
        </li><li className="hover:bg-slate-100 p-2 pt-3 pb-3 rounded-sm ">
          <Link className="flex gap-4" to="/account/explore">
            <ChartNoAxesCombined />
            <p>Account Status</p>
          </Link>
        </li>
       
        
      </ul>
    </aside>
  )
}

export default Sidebar