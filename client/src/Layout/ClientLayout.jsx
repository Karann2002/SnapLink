import React from 'react'
import { Outlet,useLocation } from 'react-router-dom';
import ClientSideBar from '../Components/SideBar/ClientSideBar';
import { useState ,useEffect} from 'react';
import MessageShortCut from '../Pages/MessageShortCut'
import HeroLoading from '../Components/Loading/HeroLoading';




const ClientLayout = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true); 
  const hideShortCut = location.pathname === '/message';

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <HeroLoading/>
    );
  }

  return (
    <div className="relative">
      <div className=''>
       {!hideShortCut && ( 
        
            <MessageShortCut />
      
       )}
       </div>
      {/* <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)}/> */}
      <div className="flex flex-1 bg-white z-50 h-screen">
      <ClientSideBar  />
      <main className='md:ml-40 md:pl-30  w-full '>
      <Outlet/>
      
      </main>
   
    </div>
    </div>
  
  )
}

export default ClientLayout
