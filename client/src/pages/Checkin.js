import React, { useEffect, useState } from 'react';
import { PiLockKeyFill } from 'react-icons/pi';
import { FaCalendarAlt } from 'react-icons/fa';
import { IoCheckmarkCircleSharp, IoClose, IoWarningOutline } from 'react-icons/io5';
import Animate from '../Components/Animate';
import { useNavigate } from 'react-router-dom';
import { useMongoUser } from '../context/mongoContext';
import { texts } from '../constants';
  
const DailyCheckIn = () => {
  const { user, setUser, showStartOverModal, setShowStartOverModal, setError, error, showClaimModal, setShowClaimModal } = useMongoUser();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const locations = useNavigate();
  const [backLos, setBackLos] = useState(true)
 
  const [streak, setStreak] = useState(false);


  const bonusPoints = [500, 1000, 2500, 5000, 15000, 25000, 100000, 500000, 1000000, 5000000, 10000000, 15000000, 20000000, 25000000, 35000000];



  useEffect(() => {

      // Attach a click event listener to handle the back navigation
      const handleBackButtonClick = () => {
          locations('/'); // Navigate to /home without refreshing the page
          setBackLos(false);
            }
  
        
      if (backLos) {
        window.Telegram.WebApp.BackButton.show();
        window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
      } else {
        window.Telegram.WebApp.BackButton.hide();
        window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
      }
    
      // Cleanup handler when component unmounts
      return () => {
        window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
  
      };
    }, [backLos, setBackLos, locations]);



    const handleDailyCheckIn = async () => {
      setClaiming(true);
      setError(null);
      setShowSuccessModal(false);
      setShowClaimModal(false);
    
      try {
        const now = new Date();
    
        // Handle the lastCheckIn date whether it's a Firestore Timestamp or MongoDB Date
        let lastCheckInDate;
        if (user.lastCheckIn) {
          // Check if lastCheckIn is a Firestore Timestamp (has toDate method)
          if (typeof user.lastCheckIn.toDate === 'function') {
            lastCheckInDate = user.lastCheckIn.toDate();
          } 
          // Check if lastCheckIn is already a Date object
          else if (user.lastCheckIn instanceof Date) {
            lastCheckInDate = user.lastCheckIn;
          }
          // If it's a string (ISO format), convert to Date
          else if (typeof user.lastCheckIn === 'string') {
            lastCheckInDate = new Date(user.lastCheckIn);
          }
        }
    
        const currentDayIndex = user.checkInDays.length;
    
        if (lastCheckInDate) {
          // Ensure we have a valid date object
          if (isNaN(lastCheckInDate.getTime())) {
            console.error('Invalid date object:', lastCheckInDate);
            throw new Error('Invalid last check-in date');
          }
    
          const lastCheckInMidnight = new Date(lastCheckInDate);
          lastCheckInMidnight.setHours(0, 0, 0, 0);
    
          const todayMidnight = new Date(now);
          todayMidnight.setHours(0, 0, 0, 0);
    
          const daysSinceLastCheckIn = Math.floor(
            (todayMidnight - lastCheckInMidnight) / (1000 * 60 * 60 * 24)
          );
    
          if (daysSinceLastCheckIn === 0) {
            throw new Error('Next checkIn is tomorrow!');
          } else if (daysSinceLastCheckIn > 1) {
            setShowStartOverModal(true);
            return;
          }
        }
    
        const currentBonus = bonusPoints[currentDayIndex];
        const checkInDate = new Date();
    
        if (currentDayIndex >= bonusPoints.length - 1) {
          const SERVER_URL = process.env.REACT_APP_SERVER_URL;
          const response2 = await fetch(`${SERVER_URL}/api/claim-last-daily-checkin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              telegramId: user.telegramId,
              lastCheckIn: checkInDate.toISOString(),
              balance: currentBonus,
              checkInDays: [1],
            }),
          });
      
          const data = await response2.json();
          if (!response2.ok) {
            throw new Error(data.message || 'Failed to save ton task');
          }
    
          setUser(prevUser => ({
            ...prevUser,
            checkInDays: [1],
            lastCheckIn: checkInDate,
            balance: prevUser.balance + currentBonus
          }));
          setStreak(true);
        } else {
          const SERVER_URL = process.env.REACT_APP_SERVER_URL;
          const response2 = await fetch(`${SERVER_URL}/api/claim-daily-checkin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              telegramId: user.telegramId,
              lastCheckIn: checkInDate.toISOString(),
              balance: currentBonus,
              checkInDays: [...user.checkInDays, currentDayIndex + 1],
              checkinRewards: currentBonus,
            }),
          });
      
          const data = await response2.json();
          if (!response2.ok) {
            throw new Error(data.message || 'Failed to save ton task');
          }
    
          setUser(prevUser => ({
            ...prevUser,
            balance: data.data.balance,
            lastCheckIn: new Date(data.data.lastCheckIn),
            checkInDays: data.data.checkInDays,
            checkinRewards: data.data.checkinRewards
          }));
        }
    
        setShowSuccessModal(true);
        setCongrats(true);
        setTimeout(() => {
          setCongrats(false);
        }, 4000);
    
      } catch (err) {
        console.error('Error during daily check-in:', err);
        setError(err.message);
      } finally {
        setClaiming(false);
      }
    };

    const handleStartOver = async () => {
      if (!user.telegramId) return;
      setClaiming(true);
      setError(null);
      setShowStartOverModal(false);
    
      try {
        const checkInDate = new Date();
        const currentBonus = bonusPoints[0];
    
        const SERVER_URL = process.env.REACT_APP_SERVER_URL;
        const response2 = await fetch(`${SERVER_URL}/api/claim-daily-checkin-startover`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telegramId: user.telegramId,
            lastCheckIn: checkInDate.toISOString(), // Send as ISO string instead of Timestamp
            balance: currentBonus,
            checkInDays: [1],
            checkinRewards: currentBonus,
          }),
        });
    
        const data = await response2.json();
        if (!response2.ok) {
          throw new Error(data.message || 'Failed to save ton task');
        }
    
        setUser(prevUser => ({
          ...prevUser,
          balance: data.data.balance,
          lastCheckIn: new Date(data.data.lastCheckIn), // Convert the received date string to Date object
          checkInDays: data.data.checkInDays,
          checkinRewards: data.data.checkinRewards
        }));
    
        setShowSuccessModal(true);
        setCongrats(true);
        setTimeout(() => {
          setCongrats(false);
        }, 4000);
    
      } catch (err) {
        console.error('Error during start over:', err);
        setError(err.message);
      } finally {
        setClaiming(false);
      }
    };

  const formatNumberCliam = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(2).replace(".", ".") + " M";
    }
  };
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  },[error, setError])

  const renderCheckInBoxes = () => {
    return bonusPoints.map((points, index) => {
      const isCurrentDay = index === user.checkInDays.length;
      const isCheckedIn = user.checkInDays.includes(index + 1);
      const isLocked = index > user.checkInDays.length;

      return (
        <button
          key={index}
          disabled={isCheckedIn || isLocked}
          className={`w-[23%] space-y-1 flex flex-col items-center justify-center relative h-[80px] rounded-[8px] cursor-pointer select-none 
            ${isCurrentDay && !isCheckedIn ? 'bg-blue-700 border-blue-500' : ''}
            ${isCheckedIn ? 'bg-green-600 border-green-100 cursor-not-allowed' : ''}
            ${isLocked ? 'bg-[#343434] border-red-500 cursor-not-allowed' : ''}
            ${!isCurrentDay && !isLocked ? 'bg-cards' : ''}
          `}
          onClick={() => isCurrentDay && !isCheckedIn && handleDailyCheckIn()}
        >
          <h2 className='text-[10px]'>
            {isLocked ? <PiLockKeyFill size={10} className='text-[#C7C7C7]' /> : `Day ${index + 1}`}
          </h2>
          <img src="/coin.webp" alt='coin' className='w-[16px]' />
          <span className='text-[13px] font-bold'>{formatNumberCliam(points)}</span>
          <span className={`${isCurrentDay ? 'absolute' : 'hidden'} w-[6px] top-1 right-2 h-[6px] bg-white rounded-full ${!isCheckedIn ? 'animate-pulse' : ''}`}></span>
          <span className={`${claiming && isCurrentDay ? 'flex' : 'hidden'} absolute left-0 right-0 top-0 bottom-0 !mt-0 items-center justify-center text-[10px] rounded-[8px] bg-[#414040]`}>
            <em className='animate-pulse not-italic'>Claiming...</em>
          </span>
        </button>
      );
    });
  };

  return (
<>
<Animate>
<div className='w-full flex justify-center flex-col'>


<div id="refer" className='w-full flex flex-col scroller h-[100vh] overflow-y-auto pb-[180px] pt-3 px-4'>

<div className={`w-full flex-col pb-4 flex items-center justify-center text-center pt-4`}>

    <span className='bg-cards h-[70px] w-[70px] rounded-full flex items-center justify-center'>

    <FaCalendarAlt size={40} className='text-accent'/>
    </span>
            <h1 className='text-center font-bold text-[24px] pt-2'>
              Daily checkin rewards
            </h1>
            <p className='text-[14px] leading-[24px]'>
             Accrue {texts.projectName} tokens for logging into the game daily and maintain consistency for reward streaks!
            </p>
          </div>
  
          <div className="w-full flex justify-center gap-2 flex-wrap">
            
            {renderCheckInBoxes()}

            <button className='w-[23%] space-y-1 bg-cards flex flex-col items-center justify-center relative h-[80px] rounded-[8px] cursor-pointer select-none'>
                <h2 className='text-[10px]'>
                   <PiLockKeyFill size={10} className='text-[#C7C7C7]'/>
                   </h2>                  

                    <img src="/coin.webp" alt='fsd' className='w-[16px]'/>

                </button>
            
            </div>


    </div>
    </div>

    <div className='w-full absolute top-[50px] flex justify-center z-50 pointer-events-none select-none'>
            {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]" />) : (<></>)}
          </div>

          <div
            className={`${
              showSuccessModal ? "visible" : "invisible"
            } fixed top-[-12px] claimdiv bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex flex-col justify-center items-center px-4`}
          >
            <div
              className={`${
                showSuccessModal ? "opacity-100 mt-0" : "opacity-0 mt-[100px]"
              } w-full bg-modal rounded-[16px] relative flex flex-col ease-in duration-300 transition-all justify-center p-8`}
            >
              <div className="w-full flex justify-center flex-col items-center space-y-3">
                <div className="w-full items-center justify-center flex flex-col space-y-2">
                  <IoCheckmarkCircleSharp size={32} className='text-accent' />
                  <p className='font-medium'>Check-in bonus claimed</p>
                </div>
                <h3 className="font-medium text-[24px] text-[#ffffff] pb-2">
                  {streak === true ? (
<>
<span className='text-accent'>+{formatNumberCliam(bonusPoints[14])}</span> {texts.projectSymbol}
</>
                  ) : (
<>
<span className='text-accent'>+{formatNumberCliam(bonusPoints[user.checkInDays.length - 1])}</span> {texts.projectSymbol}
</>
         
         )}
                </h3>
                <p className="pb-6 text-primary text-[15px] w-full text-center">
                  Daily check-in bonus claimed! <br /> <br />
                  Come back tomorrow to claim another check-in bonus!
                </p>

                <div className="w-full flex justify-center">
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="bg-btn4 w-full py-[16px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[18px]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div className={`${showClaimModal  ? 'flex' : 'hidden'} fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center`}>


<div className={`w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center`}>


  <div className="w-full flex taskbg rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-20 pb-28">
 
  <button
  onClick={() => setShowClaimModal(false)}
   className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
            >
             <IoClose size={20} className="text-[#9995a4]"/>
            </button>

 <div className='w-full bg-cards rounded-[16px] py-6 relative px-4 flex flex-col justify-center items-center'>

 <FaCalendarAlt size={34} className='text-accent'/>
 <h3 className="font-medium text-[20px] pt-2 !mt-[2px]">
  Claim Your CheckIn Bonus
  </h3>
    <p className="text-[#bfbfbf] font-medium px-4 pt-1 text-[14px] w-full text-center">
    Keep your streak alive by claiming your bonus for today!
    </p>
    </div>

    <div className="w-full flex justify-between items-center gap-2 px-4">

        <div className="w-[40%] h-[2px] bg-gray-500"></div>
        <span className="text-nowrap">Day {user.checkInDays.length + 1}</span>
        <div className="w-[40%] h-[2px] bg-gray-500"></div>

    </div>
    <div className="w-full flex justify-center items-center flex-col space-y-2 pb-7">
    <button 
   onClick={handleDailyCheckIn}
      className="bg-btn4 w-full py-[18px] px-6 text-nowrap flex items-center justify-center text-center rounded-[12px] font-semibold text-[17px]"
    >
  Claim Bonus!
    </button>
  </div>
  </div>
  </div>
</div>

{/*  */}
          <div className={`${showStartOverModal  ? 'flex' : 'hidden'} fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center`}>


<div className={`w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center`}>


<div className="w-full flex taskbg rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-20 pb-28">
 
  <button
onClick={handleStartOver}
   className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
            >
             <IoClose size={20} className="text-[#9995a4]"/>
            </button>

 <div className='w-full bg-cards rounded-[16px] py-6 relative px-4 flex flex-col justify-center items-center'>

 <FaCalendarAlt size={34} className='text-accent'/>
 <h3 className="font-medium text-[20px] pt-2 !mt-[2px]">
  Ops! You missed a day
  </h3>
    <p className="text-[#bfbfbf] font-medium px-4 pt-1 text-[14px] w-full text-center">
    Your progress have been reset and you will start over again! Keep up your streak to earn bigger rewards daily!
    </p>
    </div>


    <div className="w-full flex justify-center items-center flex-col space-y-2 pb-7 pt-4">
    <button 
  onClick={handleStartOver}
      className="bg-btn4 w-full py-[18px] px-6 text-nowrap flex items-center justify-center text-center rounded-[12px] font-semibold text-[17px]"
    >
  Start Over!
    </button>
  </div>
  </div>
  </div>
</div>

<div className={`${error ? 'fixed' : 'hidden'} z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4 bottom-24`}>
                <div className="w-full text-red-500 flex items-center space-x-2 px-4 bg-[#1a202fef] h-[50px] rounded-[8px]">
                  <IoWarningOutline size={16} />
                  <span className="text-[15px]">{error}</span>
                </div>
              </div>
    </Animate>
</>
  );
};

export default DailyCheckIn;
