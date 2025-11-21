import React, { useEffect, useRef, useState } from 'react'
import { FaPlay } from 'react-icons/fa6'
import { useMongoUser } from '../context/mongoContext'
import { IoCheckmarkCircleSharp, IoClose } from 'react-icons/io5'
import axios from 'axios'
import { texts } from '../constants'

const WatchAdsTask = () => {
    const bonusAmount = 400
    const {user, setUser, watchCountTask, setWatchCountTask,  adCooldownTask, setAdCooldownTask, remainingTimeTask, AD_COOLDOWN_DURATION_TASK} = useMongoUser()
    const [openAdMenu, setOpenAdMenu] = useState(false);
    const [congrats, setCongrats] = useState(false)

    const formatNumber = (num) => {
        if (num < 100000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else if (num < 1000000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else {
          return (num / 1000000).toFixed(3).replace(".", ".") + " M";
        }
      };


      const modalRef = useRef();
      const SERVER_URL = process.env.REACT_APP_SERVER_URL;
      
      // eslint-disable-next-line
      const handleOverlayClick = (e) => {
          if (e.target === e.currentTarget) {
              setShowAdAlert(false);
          }
        };
      
        
        const calculateTimeRemaining = () => {
          const now = new Date();
          const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          const timeDiff = nextDate - now;
        
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
          return { hours, minutes, seconds };
        };
        const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
      
        useEffect(() => {
          const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
          }, 1000);
          
          return () => clearInterval(interval); // Clear interval on component unmount
        }, []);
      
      
        const [isAdLoading, setIsAdLoading] = useState(false);
        // eslint-disable-next-line
        const [adWatched, setAdWatched] = useState(false);
        const [showAdAlert, setShowAdAlert] = useState(false);
      
      
      
      
      
        const handleWatchAd = async () => {
          if (watchCountTask <= 0 || adCooldownTask > 0 || isAdLoading) return;
          setIsAdLoading(true);
          
          try {
            // Show the ad
            await window.show_8670814();
        
            const newWatchCount = watchCountTask - 1;
            
            // Only set the cooldown timer and lastAdWatch when watchCount will become 0
            const shouldSetCooldown = newWatchCount === 0;
            
            // Update database with new watch count and timestamp
            const response = await axios.post(`${SERVER_URL}/api/update-ad-watch`, {
              telegramId: user.telegramId,
              pointsAward: bonusAmount,
              watchCountTask: newWatchCount,
              adTimeStamp: new Date(),
              adLimit: user.adLimit - 1,
              // Only set lastAdWatch when we've used all watches
              lastAdWatchTask: shouldSetCooldown ? new Date().toISOString() : user.lastAdWatchTask
            });
        
            // Update local state with the response from server
            setUser(prevUser => ({
              ...prevUser,
              balance: response.data.data.balance,
              watchCountTask: response.data.data.watchCountTask,
              lastAdWatchTask: response.data.data.lastAdWatchTask,
              adLimit: response.data.data.adLimit
            }));
        
            // Only set the cooldown when we've used all watches
            if (shouldSetCooldown) {
              setAdCooldownTask(AD_COOLDOWN_DURATION_TASK);
            }
            setWatchCountTask(newWatchCount);
        
            setAdWatched(true);
            setOpenAdMenu(false);
            setCongrats(true)
            
            // Show success alert
            setShowAdAlert(true);
            setTimeout(() => {
                setCongrats(false);
            }, 3000);
          } catch (error) {
            console.error('Error updating freeGuru:', error.response?.data?.message || error.message);
          } finally {
            setIsAdLoading(false);
          }
        };
      
      
      
      
      // Modified modal content to show watch count and cooldown
      const renderModalContent = () => (
        <div ref={modalRef} className="w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center">
          <div className="w-full flex taskbg rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-20 pb-24">
            <button
              onClick={() => setOpenAdMenu(false)}
              className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
            >
              <IoClose size={20} className="text-[#9995a4]"/>
            </button>
      

      <div className=''>
        <FaPlay size={50} className='text-accent'/>
      </div>


      
                <div className="w-full flex flex-col justify-center items-center">
      
                  <h3 className="font-semibold text-[24px]">
                    Watch Ads
                  </h3>
                  <p className="text-[14px] font-medium text-center pb-3">
                    Watch Ads & get more rewards every 2 hours, you can perform the watch Ads task only 5 times daily
                  </p>
      
                </div>

                {user.adLimit <= 0 ? (
                    <>
                <div className='w-full bg-cards rounded-[16px] py-6 relative px-4 flex flex-col justify-center items-center'>
      
                <p className="text-[#e5e5e5] font-medium px-8 text-[14px] w-full text-center">
                  Your next free Ad watch starts in
                </p>
                <span className="text-[34px] font-semibold">
                  {timeRemaining.hours}h : {timeRemaining.minutes}m : {timeRemaining.seconds}s
                </span>
          </div>

               
    <div className="w-full flex justify-center items-center flex-col space-y-4 pt-1">
      
        <button onClick={() => setOpenAdMenu(false)}
        className={`w-full bg-btn4 text-[#000] py-[18px] px-2 text-nowrap flex items-center justify-center gap-2 text-center rounded-[12px] font-semibold text-[17px]`}>
  
 Continue
        </button>

        </div>
                    </>
) : (
     
    <div className="w-full flex justify-center items-center flex-col space-y-4">
      
    {adCooldownTask > 0 ? (
      <button 
      className={`w-full bg-yellow-500 text-[#000] py-[18px] px-2 text-nowrap flex items-center justify-center gap-2 text-center rounded-[12px] font-semibold text-[17px]`}>

Watch Ads again in {remainingTimeTask}
      </button>
      

    ) : (
      <>
                  <button 
      onClick={handleWatchAd}
      disabled={isAdLoading || watchCountTask <= 0 || adCooldownTask > 0}
      className={`w-full py-[18px] px-6 text-nowrap flex items-center justify-center gap-2 text-center rounded-[12px] font-semibold text-[17px] ${
        watchCountTask <= 0 || adCooldownTask > 0 ? 'bg-[#383838] text-[#9995a4]' : 'bg-btn'
      }`}
    >
      <FaPlay className={isAdLoading ? 'animate-spin' : ''} />
      {isAdLoading ? 'Loading Ad...' : 
       watchCountTask <= 0 ? 'No watches remaining' :
       `Watch Ad (${user.adLimit} left)`}
    </button>
      </>
    )}

  </div>

)}

 
          </div>
        </div>
      );
        // Replace the existing modal JSX with the new renderModalContent
        const adsModalJSX = (
          <div className={`${openAdMenu ? 'flex' : 'hidden'} fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center`}>
            {renderModalContent()}
          </div>
        );
      
      
           // Ad Success Alert Component
           const AdAlert = () => (
            <>

<div className='w-full absolute top-[50px] flex justify-center z-50 pointer-events-none select-none'>
      {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>



      <div
        className={`${
          showAdAlert === true ? "visible" : "invisible"
        } fixed top-[-12px] claimdiv bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex flex-col justify-center items-center px-4`}
      >
 
        <div className={`${
          showAdAlert=== true ? "opacity-100 mt-0" : "opacity-0 mt-[100px]"
        } w-full bg-modal rounded-[16px] relative flex flex-col ease-in duration-300 transition-all justify-center p-8`}>
      

          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <IoCheckmarkCircleSharp size={32} className='text-accent'/>
              <p className='font-medium'>Let's go!!</p>
            </div>
            <h3 className="font-medium text-[24px] text-[#ffffff] pt-2 pb-2">
              <span className='text-accent'>+{bonusAmount}</span> {texts.projectSymbol}
            </h3>
            <p className="pb-6 text-[#bfbfbf] text-[15px] w-full text-center">
              Keep watching ads daily! something huge is coming! Get more {texts.projectSymbol} now! 
            </p>

            <div className="w-full flex justify-center">
            <button
              onClick={() => setShowAdAlert(false)}
              className="bg-btn text-[#000] w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
              Continue
            </button>
          </div>
          </div>
          </div>

        </div>
        </>
            );
          
      
        return (
         <>
         {showAdAlert && (
      
         <AdAlert/>
         )}
            

              <div className="w-full rounded-[14px] py-3 flex items-center justify-between space-x-1">
              
              <div className='w-fit pr-2'>
                <div className='flex items-center justify-center bg-[#1f2023] h-[45px] w-[45px] rounded-full p-1'>
                  <FaPlay size={20} className='w-[20px] ml-[4px]' />
                </div>
              </div>
                <div className={`flex flex-1 h-full flex-col justify-center relative`}>
                  <div className={`w-full flex flex-col justify-between h-full space-y-1`}>
                    <h1 className={`text-[15px] line-clamp-1 font-medium`}>
                      Watch Ads & earn
                    </h1>
                    <span className='flex text-secondary items-center w-fit text-[15px]'>
                   
                      <span className=''>
                        +{formatNumber(bonusAmount)} {texts.projectSymbol}
                      </span>
                    </span>
                  </div>
                </div>
    
                <div className='w-fit flex items-center space-x-1 justify-end flex-wrap text-[14px] relative'>
    
                          <button
                            onClick={() => setOpenAdMenu(true)}
                            className={`w-[78px] py-[10px] text-center font-semibold rounded-[30px] px-3 bg-[#1f2023] hover:bg-[#36373c]`}
                          >
                            Start
                          </button>
    
                    </div>
              </div>

                          {/* ads modal */}
            {adsModalJSX}

            

    </>
  )
}

export default WatchAdsTask