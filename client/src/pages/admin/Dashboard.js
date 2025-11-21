import React, { useState, useEffect, useRef  } from 'react'
import { AuthProvider } from '../../context/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import { IoCloseCircle, IoClose } from 'react-icons/io5';
import { HiMenuAlt1 } from "react-icons/hi";
import {  IoIosWarning } from "react-icons/io";
import AdminPage from '../../Components/adminComponents/AdminPage';




const Dashboard = () => {
    const [openInfoThree, setOpenInfoThree] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const pageRoute = useLocation();
    const [pageTitle, setPageTitle] = useState('')

    const infoRefTwo = useRef(null);
    const infoRefThree = useRef(null);

    const handleClickOutside = (event) => {

        if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
            setShowMenu(false);
          }
        if (infoRefThree.current && !infoRefThree.current.contains(event.target)) {
          setOpenInfoThree(false);
        }
      };
    
      useEffect(() => {
        if (openInfoThree) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line
      }, [openInfoThree]);



useEffect(() => {
    if (pageRoute.pathname === '/dashboardAdx/stats') {
        setPageTitle('Admin Dashboard')
    } else if (pageRoute.pathname === '/dashboardAdx/managetasks') {
        setPageTitle('Manage Telegram Tasks')
    } else if (pageRoute.pathname === '/dashboardAdx/externaltasks') {
        setPageTitle('Manage External Tasks')
    }  else if (pageRoute.pathname === '/dashboardAdx/promo') {
        setPageTitle('Adverts/Promo Tasks')
    }  else if (pageRoute.pathname === '/dashboardAdx/broadcast') {
      setPageTitle('Send Broadcast Message')
  }     else if (pageRoute.pathname === '/dashboardAdx/youtube') {
        setPageTitle('Youtube Tasks')
    }  else if (pageRoute.pathname === '/dashboardAdx/airdroplist') {
        setPageTitle('Airdrop List')
    }  else if (pageRoute.pathname === '/dashboardAdx/settings') {
        setPageTitle('Settings')
    }  else {
        setPageTitle('Users list')
        
    }
}, [pageRoute.pathname])

          
      useEffect(() => {
        if (showMenu) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [showMenu]);
    
      // if (loading) {
      //   return <Spinner/>;
      // }
    
      // if (!user) {
      //   return null;
      // }
  

    



      
  return (

     
    <AuthProvider>
        <div className="w-full flex justify-center">
          <div className="flex flex-col pt-5 space-y-3 w-full">

       
       


            <div className='w-full flex justify-center flex-col -mt-5'>



<div className='w-full flex justify-between gap-2 items-center bg-[#3e3e3e] p-4 fixed top-0 left-0 right-0'>

    <div className='flex sm:w-[18%] items-center'>
<NavLink to='/dashboardAdx/stats' className=''>
<img src='/loader.svg' alt='not' className='w-[20px]'/>
</NavLink>


    </div>

    <div className='sm:w-[82%] flex flex-1 justify-between items-center sm:px-4'>
    <h1 className='text-[16px] sm:text-[18px] font-bold text-nowrap'>
        {pageTitle}
    </h1>
    

    <div className='relative flex justify-end w-[60%]'>
        
        {showMenu ? (
    <button onClick={() => setShowMenu(false)}
    className='h-[35px] w-[35px] rounded-full bg-[#606060] flex items-center justify-center text-[#fff]'>
        <IoCloseCircle size={18} className=''/>
    </button>
        ) : (
            <button onClick={() => setShowMenu(true)}
            className='h-[35px] w-[35px] rounded-full bg-[#606060] flex items-center justify-center text-[#fff]'>
                <HiMenuAlt1 size={18} className=''/>
            </button>
        )}

    </div>
    </div>


</div>


{/*  */}


<div className='w-full flex justify-between'>



<AdminPage showMenu={showMenu} setShowMenu={setShowMenu} infoRefTwo={infoRefTwo}/>




<div className='w-full sm:w-[82%] flex px-4 sm:px-6 flex-col pt-[70px]'>


<Outlet />

<div
        className={`${
          openInfoThree === true ? "visible" : "invisible"
        } fixed bottom-0 left-0 z-[80] right-0 h-[100vh] bg-[#00000042] flex justify-center items-end backdrop-blur-[10px]`}
      >
        <div
          ref={infoRefThree}
          className={`w-full bg-divider rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center`}
        >
          <div className="w-full flex bg-[#202020] rounded-tl-[40px] rounded-tr-[40px] mt-[2px] h-[85vh] justify-start relative flex-col items-center space-y-3 p-4 pb-24">
            <div className="w-full flex flex-col text-center space-y-5 justify-center items-center py-8 relative">
              <div className="w-full flex flex-col justify-between py-8 px-3">
                <button
                  onClick={() => setOpenInfoThree(false)}
                  className="flex items-center justify-center absolute right-6 top-6 text-center rounded-[12px] font-medium text-[16px]"
                >
                  <IoClose size={24} className="text-[#9a96a6]" />
                </button>

                <div className="w-full flex justify-center flex-col items-center">
                  <div className="w-[70px] h-[70px] rounded-[15px] bg-cards3 flex items-center justify-center">
                    <IoIosWarning size={50} className="text-[#d03a2c]" />
                  </div>
                  <h3 className="font-semibold text-[24px] py-4">Hy 😎!</h3>
                  <p className="pb-6 text-[#c3bfd2] text-[14px] text-center">
                    My name is Samuel and I developed this bot app. If you need
                    to purchase the source code for this project or you want to
                    create similar projects like this, you can message me
                    directly on telegram via{" "}
                    <a
                      href="https://t.me/conceptdevelopers"
                      className="text-[#ffba4c]"
                    >
                      t.me/conceptdevelopers
                    </a>
                  </p>
                </div>

                <div className="w-full flex justify-center">
                  <button
                    onClick={() => setOpenInfoThree(false)}
                    className={`bg-btn4 text-[#000] w-full py-4 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[18px]`}
                  >
                    Okay, Continue 🤙
                  </button>
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>

</div>

</div>








           
         
       </div>


           </div>
           </div>





           </AuthProvider>

  )
}

export default Dashboard