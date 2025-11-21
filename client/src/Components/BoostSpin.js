import React, { useEffect, useRef, useState } from 'react'
import { IoCheckmarkCircleSharp, IoClose } from 'react-icons/io5'
import { useMongoUser } from '../context/mongoContext';
import { PiSpinnerBallDuotone } from 'react-icons/pi';
import { FaPlay } from 'react-icons/fa6';
import axios from 'axios';

const BoostSpin = ({openBoostSpin, setOpenBoostSpin}) => {

    const {user, setUser, watchCountSpin, setWatchCountSpin,  adCooldownSpin, setAdCooldownSpin, remainingTimeSpin, AD_COOLDOWN_DURATION_SPIN} = useMongoUser()

const modalRef = useRef();
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

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
    if (watchCountSpin <= 0 || adCooldownSpin > 0 || isAdLoading) return;
    setIsAdLoading(true);
    
    try {
      // Show the ad
      await window.show_8670814();
  
      const newWatchCount = watchCountSpin - 1;
      
      // Only set the cooldown timer and lastAdWatch when watchCount will become 0
      const shouldSetCooldown = newWatchCount === 0;
      
      // Update database with new watch count and timestamp
      const response = await axios.post(`${SERVER_URL}/api/update-spin-balance-ads`, {
        telegramId: user.telegramId,
        spinLimit: 1,
        watchCountSpin: newWatchCount,
        // Only set lastAdWatch when we've used all watches
        lastAdWatchSpin: shouldSetCooldown ? new Date().toISOString() : user.lastAdWatchSpin
      });
  
      // Update local state with the response from server
      setUser(prevUser => ({
        ...prevUser,
        spinLimit: response.data.data.spinLimit,
        watchCountSpin: response.data.data.watchCountSpin,
        lastAdWatchSpin: response.data.data.lastAdWatchSpin
      }));
  
      // Only set the cooldown when we've used all watches
      if (shouldSetCooldown) {
        setAdCooldownSpin(AD_COOLDOWN_DURATION_SPIN);
      }
      setWatchCountSpin(newWatchCount);
  
      setAdWatched(true);
      setOpenBoostSpin(false);
      
      // Show success alert
      setShowAdAlert(true);
      setTimeout(() => {
        setShowAdAlert(false);
      }, 10000);
    } catch (error) {
      console.error('Error updating freeGuru:', error.response?.data?.message || error.message);
    } finally {
      setIsAdLoading(false);
    }
  };




// Modified modal content to show watch count and cooldown
const renderModalContent = () => (
  <div ref={modalRef} className="w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center">
    <div className="w-full flex taskbg rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-20 pb-10">
      <button
        onClick={() => setOpenBoostSpin(false)}
        className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
      >
        <IoClose size={20} className="text-[#9995a4]"/>
      </button>

      {user.spinLimit <= 0 && (
        <>
          <div className='w-full bg-cards rounded-[16px] py-6 relative px-4 flex flex-col justify-center items-center'>
            <PiSpinnerBallDuotone size={34} className='text-accent animate-spin'/>

                <p className="text-[#e5e5e5] font-medium px-8 text-[14px] w-full text-center">
                  Your next free spin starts in
                </p>
                <span className="text-[34px] font-semibold">
                  {timeRemaining.hours}h : {timeRemaining.minutes}m : {timeRemaining.seconds}s
                </span>
          </div>


          <div className="w-full flex justify-between items-center gap-2 px-4">
            <div className="w-[40%] h-[2px] bg-cards2"></div>
            <span className="text-nowrap">OR</span>
            <div className="w-[40%] h-[2px] bg-cards2"></div>
          </div>

          <div className="w-full flex flex-col justify-center items-center">

            <h3 className="font-semibold text-[24px]">
              Watch Ad
            </h3>
            <p className="text-[14px] font-medium">
              & get one more free spin for more rewards
            </p>

          </div>

          <div className="w-full flex justify-center items-center flex-col space-y-4">

            {adCooldownSpin > 0 ? (
              <button 
              className={`w-full bg-yellow-500 text-[#000] py-[18px] px-2 text-nowrap flex items-center justify-center gap-2 text-center rounded-[12px] font-semibold text-[17px]`}>

Watch ads again in {remainingTimeSpin}
              </button>
              

            ) : (
              <>
                          <button 
              onClick={handleWatchAd}
              disabled={isAdLoading || watchCountSpin <= 0 || adCooldownSpin > 0}
              className={`w-full py-[18px] px-6 text-nowrap flex items-center justify-center gap-2 text-center rounded-[12px] font-semibold text-[17px] ${
                watchCountSpin <= 0 || adCooldownSpin > 0 ? 'bg-[#383838] text-[#9995a4]' : 'bg-btn'
              }`}
            >
              <FaPlay className={isAdLoading ? 'animate-spin' : ''} />
              {isAdLoading ? 'Loading Ad...' : 
               watchCountSpin <= 0 ? 'No watches remaining' :
               `Watch Ad for free spin`}
            </button>
              </>
            )}

          </div>
        </>
      )}
    </div>
  </div>
);
  // Replace the existing modal JSX with the new renderModalContent
  const existingModalJSX = (
    <div className={`${openBoostSpin ? 'flex' : 'hidden'} fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center`}>
      {renderModalContent()}
    </div>
  );


     // Ad Success Alert Component
     const AdAlert = () => (
        <div onClick={handleOverlayClick} className={`fixed w-full bg-[#00000077] top-0 left-0 right-0 bottom-0 flex items-center justify-center transform z-50 transition-opacity duration-300 ${showAdAlert ? 'opacity-100' : 'opacity-0'}`}>
        
          <div className="bg-[#419644] w-[70%] text-white px-6 py-4 rounded-lg shadow-lg flex flex-col items-center justify-center space-y-2">
            <IoCheckmarkCircleSharp size={24} />
            <span className="font-medium text-[15px]">Ad watch successfull!</span>
            <button onClick={() => setShowAdAlert(false)} className='rounded-lg py-2 px-3 bg-white text-black font-medium text-[15px] w-[90%]'>
Continue
            </button>
          </div>
    
    
        </div>
      );
    

  return (
   <>
   {showAdAlert && (

   <AdAlert/>
   )}
      
      {/* Winner modal */}
      {existingModalJSX}
   </>
  )
}

export default BoostSpin