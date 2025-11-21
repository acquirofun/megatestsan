import React from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const linksTo = [
    {
        link: '/dashboardAdx/stats',
        title: 'Dashboard',
    },
    {
        link: '/dashboardAdx/managetasks',
        title: 'Project TG Tasks',
    },
    {
        link: '/dashboardAdx/externaltasks',
        title: 'Other Tasks',
    },
    {
        link: '/dashboardAdx/youtube',
        title: 'Youtube Tasks',
    },
    {
        link: '/dashboardAdx/promo',
        title: 'Adverts/Promo Tasks',
    },
    {
        link: '/dashboardAdx/search',
        title: 'Users & Airdrop list',
    },
    {
        link: '/dashboardAdx/broadcast',
        title: 'Send Broadcast',
    },
    {
        link: '/dashboardAdx/settings',
        title: 'Settings',
    },
] 



const AdminPage = ({showMenu, setShowMenu, infoRefTwo}) => {
    const pageRoute = useLocation();
    const { user, logout } = useAuth();

    
    const handleLogout = async () => {
        const success = await logout();
        if (success) {
          window.location.href = '/dashboardlogin';
        }
      };


  return (
    <div className={`${showMenu === true ? 'visible opacity-100 pointer-events-auto left-0 right-0 bottom-0' : 'invisible opacity-0 sm:opacity-100 sm:visible pointer-events-none sm:pointer-events-auto left-[-100%] sm:left-0'} backdrop-blur-[1px] w-full ease-in duration-200 bg-[#2424243f] z-20 sm:w-[18%] flex flex-col top-0 fixed sm:relative`}>


    <div ref={infoRefTwo} className={`w-[70%] sm:w-full bg-[#282828] h-screen absolute left-0 top-0 flex flex-col space-y-5 p-4`}>

    <div className='flex items-center flex-row sm:flex-col w-full gap-2'>

        <img src='/loader.svg' alt='not' className='w-[18px] sm:w-[24px]'/>
        <span className='text-[13px]'>
        {user && (user.email)}
        </span>

    </div>

    <div className='flex flex-col space-y-3 w-full pt-8'>

        {linksTo.map((menu, index) => (
            <NavLink to={menu.link} onClick={() => setShowMenu(false)} key={index} className={`${pageRoute.pathname === `${menu.link}` ? 'bg-[#424242]' : ''} px-2 py-3 flex rounded-[6px] items-center space-x-1 font-medium`}>
                <span className=''>

                </span>
               <span className=''>
                 {menu.title}
                 </span>
            </NavLink>
        ))}

<span onClick={handleLogout} className={`px-2 py-3 flex rounded-[6px] cursor-pointer items-center space-x-1 font-medium`}>
    
    <span>Logout</span>
    </span>

    </div>
    </div>
    </div>
  )
}

export default AdminPage