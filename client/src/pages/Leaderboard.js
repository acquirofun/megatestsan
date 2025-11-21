import React, { useEffect, useRef, useState } from 'react'
import Animate from '../Components/Animate';
import { PiInfo } from "react-icons/pi";
import Leaderboards from '../Components/LeaderBoards';
import { useMongoUser } from '../context/mongoContext';



const Leaderboard = () => {
  const {user} = useMongoUser();
    const [openInfoTwo, setOpenInfoTwo] = useState(false);


    const infoRefTwo = useRef(null);
  
    const handleClickOutside = (event) => {
  
      if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
        setOpenInfoTwo(false);
      }
    };
  
    useEffect(() => {
      if (openInfoTwo) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [openInfoTwo]);
              

  return (
    <Animate>
    <div className='w-full flex justify-center flex-col px-4'>

    <div id="refer" className="w-full h-screen pt-5 scroller space-y-4 overflow-y-auto pb-[240px]">

      <div className='w-full flex flex-col space-y-1'>

  
        <h1 className='w-full text-center font-bold text-[32px]'>
            Leaderboard
        </h1>
        <button onClick={() => setOpenInfoTwo(true)} className="w-full pb-1 font-medium text-[12px] text-[#888] flex items-center justify-center space-x-[2px]">
            <span>Ranking info</span>
            <PiInfo size={12} className="mt-[1px]"/>
          </button>
          </div>



        <Leaderboards currentUserTelegramId={user.telegramId}/>



        </div>
        </div>


        <div 
        className={`${
          openInfoTwo=== true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div ref={infoRefTwo} className={`${
          openInfoTwo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal !bottom-0 relative rounded-[16px] flex flex-col justify-center p-8`}>
         
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
          
            <div className='flex justify-center items-center text-center relative'>

  <img src='/gold.svg' alt='dscfd' className='w-[30px] h-[30px]'/>

                    </div>
            </div>
            <h3 className="font-medium text-center text-[18px] text-[#ffffff] pb-2 uppercase">
          Leaderboard Rewards
            </h3>
            <p className="pb-6 text-[13px] w-full text-center">
         The leaderboard is updated once every 24 hours! 
         <br/>The top 5 users on each ranking get special TON allocation bonus and benefits on listing and lauching day! Boost your rank or Keep performing activities to increase your earnings!    </p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={() => setOpenInfoTwo(false)}
              className={`bg-btn4 text-[#000] w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
           Okay, Continue!
            </button>
          </div>
        </div>
      </div>

        </Animate>
  )
}

export default Leaderboard