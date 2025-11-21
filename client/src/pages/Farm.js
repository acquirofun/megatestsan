import React, { useState, useEffect, useRef } from "react";
import { IoCheckmarkCircleSharp, IoClose, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineTimer } from "react-icons/md";
import Animate from "../Components/Animate";
import { IoVolumeMediumSharp } from "react-icons/io5";
import { IoVolumeMute } from "react-icons/io5";
import BoostFarm from "../Components/BoostFarm";
import { IoIosInformationCircleOutline, IoIosWarning } from "react-icons/io";
import { PiInfo } from "react-icons/pi";
import { useMongoUser } from "../context/mongoContext";
import { useNavigate } from "react-router-dom";
import { images, texts } from "../constants";

const CryptoFarming = () => {
  const {user, setUser, isMuted, fanAudioRef, setIsMuted, openInfoThree, setOpenInfoThree} = useMongoUser();
  // const FARM_DURATION = 10800; // 60 seconds for 1 minute
  const FARM_DURATION = 60; // 60 seconds for 1 minute
  const [timeRemaining, setTimeRemaining] = useState(FARM_DURATION);
  const TRIGGER_TIME = FARM_DURATION - 1;
  const TRIGGER_TIMETWO = FARM_DURATION - 3;
  const TRIGGER_TIMETHREE = FARM_DURATION - 5;
  const TRIGGER_TIMEFOUR = FARM_DURATION - 7;
  const POINTS_TO_EARN = user.miningPower * 5;
  const [isFarming, setIsFarming] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [farmingCompleted, setFarmingCompleted] = useState(false);
  const [spinDuration, setSpinDuration] = useState(0);
  // eslint-disable-next-line
  const [elapsedTimer, setElapsedTimer] = useState(0);
  // eslint-disable-next-line
  const [animatePoints, setAnimatePoints] = useState(false); // To handle points animation
  const [showSettings, setShowSettings] = useState(false);
  const [claimModal, setClaimModal] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const modalRef = useRef(null);

  const [openInfoTwo, setOpenInfoTwo] = useState(false);

  const infoRefThree = useRef(null);
  const infoRefTwo = useRef(null);


  const locations = useNavigate();
  const [backFarm, setBackFarm] = useState(true);


  useEffect(() => {
    const handleBackButton = () => {
      if (showSettings) {
        setShowSettings(false);
      } else if (backFarm) {
        locations('/earn');
        setBackFarm(false);
      }
    };
  
    // Show back button if either condition is true
    if (showSettings || backFarm) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackButton);
    } else {
      window.Telegram.WebApp.BackButton.hide();
    }
  
    // Cleanup
    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButton);
    };
  }, [showSettings, setShowSettings, backFarm, setBackFarm, locations]);

  const handleClickOutside = (event) => {

    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setOpenInfoTwo(false);
    }
    if (infoRefThree.current && !infoRefThree.current.contains(event.target)) {
      setOpenInfoThree(false);
    }
  };

  useEffect(() => {
    if (openInfoTwo || openInfoThree) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line
  }, [openInfoTwo, openInfoThree]);

  

  const closeClaimer = (event) => {

    if (modalRef.current && !modalRef.current.contains(event.target)) {
        setClaimModal(false);
        setPointsEarned(0);

    }

}

  useEffect(() => {
    if (!user.telegramId) {
    if (claimModal) {
      document.addEventListener('mousedown', closeClaimer);
    } else {
      document.removeEventListener('mousedown', closeClaimer);
    }
    
    return () => {
      document.removeEventListener('mousedown', closeClaimer);
    };
  }
    // eslint-disable-next-line 
  }, [claimModal, user.telegramId]);




  useEffect(() => {
    const farmingStart = localStorage.getItem("farmingStart");
    const farmingDone = localStorage.getItem("farmingCompleted");

    const storedElapsedTimer = localStorage.getItem("elapsedTime");

    if (storedElapsedTimer) {
      setElapsedTimer(parseInt(storedElapsedTimer));
    }

    if (farmingDone === "true") {
      setPointsEarned(POINTS_TO_EARN);
      setFarmingCompleted(true);
      setCanClaim(true);
      localStorage.setItem("spinDuration", 0);
      setSpinDuration(0);
    } else if (farmingStart) {
      const elapsedTime = Math.floor((Date.now() - parseInt(farmingStart)) / 1000);
      if (elapsedTime < FARM_DURATION) {
        setTimeRemaining(FARM_DURATION - elapsedTime);
        setIsFarming(true);
        setPointsEarned((elapsedTime / FARM_DURATION) * POINTS_TO_EARN);
      } else {
        completeFarming();
      }
    } 
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let interval;
    if (isFarming && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);

              
        // Animate pointsEarned on update
        setPointsEarned((prevPoints) => {
            const newPoints = ((FARM_DURATION - timeRemaining) / FARM_DURATION) * POINTS_TO_EARN;
            if (newPoints !== prevPoints) {
              setAnimatePoints(true);
              setTimeout(() => setAnimatePoints(false), 500); // Remove animation after 500ms
            }
            return newPoints;
          });

        // Update elapsed time
        setElapsedTimer((prevElapsedTimer) => {
          const newElapsedTimer = prevElapsedTimer + 1;
          localStorage.setItem("elapsedTime", newElapsedTimer);
          return newElapsedTimer;
        });

        if (timeRemaining <= TRIGGER_TIME) {
          setSpinDuration(5);
        }
        if (timeRemaining <= TRIGGER_TIMETWO) {
          setSpinDuration(2);
        }
        if (timeRemaining <= TRIGGER_TIMETHREE) {
          setSpinDuration(1);
        }
        if (timeRemaining <= TRIGGER_TIMEFOUR) {
          setSpinDuration(0.5);
        }
      }, 1000);
    } else if (timeRemaining <= 0) {
      clearInterval(interval);
      completeFarming();
    }
    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, [isFarming, timeRemaining]);

  useEffect(() => {
    if (isFarming) {
      fanAudioRef.current.play(); // Play the sound when farming starts
    } else {
      fanAudioRef.current.pause(); // Pause the sound when farming stops
    }
    if(farmingCompleted) {
      setSpinDuration(50)
    }
    // eslint-disable-next-line
  }, [isFarming]);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    fanAudioRef.current.muted = newMuteState;
    setShowSettings(false);
  
    // Store the mute state in local storage
    localStorage.setItem('isMuted', JSON.stringify(newMuteState));
    console.log('Toggled mute state successfully');
  };
  
  // On component mount, initialize isMuted from local storage
  useEffect(() => {
    const storedMuteState = JSON.parse(localStorage.getItem('isMuted'));
    if (storedMuteState !== null) {
      setIsMuted(storedMuteState);
      fanAudioRef.current.muted = storedMuteState;
    }
    // eslint-disable-next-line
  }, []);
  

  const startFarming = () => {
    setIsFarming(true);
    setCanClaim(false);
    setSpinDuration(20);
    setFarmingCompleted(false);
    setPointsEarned(0);
    setTimeRemaining(FARM_DURATION);
    localStorage.setItem("farmingStart", Date.now());
    localStorage.setItem("farmingCompleted", "false");
  };

  const claimPoints = async () => {
    try {
      const SERVER_URL = process.env.REACT_APP_SERVER_URL;
      const response2 = await fetch(`${SERVER_URL}/api/claim-farming`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: user.telegramId,  // Use the Firestore user ID as the Telegram user ID
          miningTotal: pointsEarned,
          bonusAmount: pointsEarned
        }),
      });
  
      const data = await response2.json();
      // console.log('DATA IS', bonusAward)
      if (!response2.ok) {
        throw new Error(data.message || 'Failed to save ton task');
      }

      setUser(prevUser => ({
        ...prevUser,
        balance: data.data.balance,
        miningTotal: data.data.miningTotal

      }));

      setClaimModal(true);
      setIsFarming(false);
      setTimeRemaining(FARM_DURATION);
      setCanClaim(false);
      setFarmingCompleted(false);
      setCongrats(true);
      setTimeout(() => {
          setCongrats(false);
      }, 3000);
      localStorage.removeItem("farmingStart");
      localStorage.removeItem("farmingCompleted");
      localStorage.setItem("spinDuration", 0);
      setSpinDuration(0);
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

// eslint-disable-next-line
  const resetFarming = () => {
    setIsFarming(false);
    setPointsEarned(0);
    setTimeRemaining(FARM_DURATION);
    setCanClaim(false);
    setFarmingCompleted(false);
    localStorage.removeItem("farmingStart");
    localStorage.removeItem("farmingCompleted");
    localStorage.setItem("spinDuration", 0);
    setSpinDuration(0);
  };

  const completeFarming = () => {
    setIsFarming(false);
    setPointsEarned(POINTS_TO_EARN);
    setCanClaim(true);
    setFarmingCompleted(true);
    localStorage.removeItem("farmingStart");
    localStorage.setItem("farmingCompleted", "true");
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const formatNumberTwo = (num) => {
    if (typeof num !== "number") {
      return "Invalid number";
    }
    if (num < 1 && num.toString().split('.')[1]?.length > 3) {
      return num.toFixed(6).replace(/0+$/, '');
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  };
  const closeClaimerr = (event) => {
        setClaimModal(false);
        setPointsEarned(0);
}

  return (
    <Animate>
    <div className="w-full flex flex-col items-center justify-center px-4">
      <audio ref={fanAudioRef} src="/farming.mp3" loop muted={isMuted}></audio>

      <div id="refer" className="w-full h-screen pt-5 scroller overflow-y-auto pb-[150px] space-y-3">

        <div className="w-full flex justify-center items-center pb-3">
          
          <button className="absolute">
            
          </button>

        <div className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1">
          <img src={images.logo} alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Balance</span> <span> {formatNumber(user.balance)} </span>
        </div>


        <button onClick={() => setShowSettings(true)} className="absolute right-5">
          <IoSettingsOutline size={24} className=""/>
        </button>

        </div>



        <div className='w-full flex justify-center items-center text-center'>
          <div className='w-[150px] h-[150px] fanbg border-[#616161] border-[4px] flex justify-center rounded-full items-center text-center relative'>
            <img src='/fan.webp' alt='dscfd' className='w-[130px] h-[130px] animate-spin' style={{ animationDuration: `${spinDuration}s` }}/>
            <div className='absolute z-10 bg-[#3f2900] border-[1px] border-[#8b8b8b] rounded-full h-[34px] w-[34px] flex justify-center items-center'>
              <img src='/dogs.webp' alt='sdfd' className='w-[14px]'/>
            </div>
          </div>
        </div>

      <div className="w-full px-3 pt-5">
        
        <div className="w-full bg-cards rounded-[12px] px-4 pt-4 pb-2 flex flex-col items-center justify-center mb-3 relative">
        <h2 className="font-medium text-secondary text-[14px]">Mined Tokens</h2>
          <span className="text-[26px] font-semibold">
          {farmingCompleted ? (
            <>
             {formatNumberTwo(pointsEarned)}
            </>
          ) : isFarming ? (
            <>
              {formatNumberTwo(pointsEarned)}
            </>
          ) : (
            <>
           {formatNumberTwo(pointsEarned)}
            </>
          )}
          </span>
          {isFarming && (
          <span className="font-medium text-[13px] text-secondary flex items-center justify-center space-x-[1px]">
        <MdOutlineTimer size={14} className=""/>
          <span>{formatTime(timeRemaining)}</span>
          </span>
          )}

          <span onClick={() => setOpenInfoTwo(true)} className="pt-5 pb-1 font-medium text-[10px] text-[#93792b] flex items-center justify-center space-x-[2px]">
         <img src="/starsorange.svg" alt="dsdsf" className="w-[8px]"/>
            <span>{user.miningPower} tokens profit per hour</span>
            <IoIosInformationCircleOutline size={11} className=""/>
          </span>

          <PiInfo onClick={() => setOpenInfoTwo(true)} size={18} className="absolute top-4 right-4 text-[#888]"/>

        </div>
 

        <div className="w-full flex items-center justify-between space-x-2">

        <button
          onClick={startFarming}
          disabled={isFarming || canClaim}
          className={`w-[48%] px-4 py-3 flex items-center justify-center text-center rounded-[8px] font-semibold text-[14px] ${isFarming || canClaim ? "bg-btn2 text-[#888]" : "bg-btn"}`}
        >
          {isFarming ? "Mining.." : "Start Mining"}
        </button>

        <button
          onClick={claimPoints}
          disabled={!canClaim}
          className={`w-[48%] px-4 py-3 flex items-center justify-center text-center rounded-[8px] font-semibold text-[14px] ${canClaim ? "bg-btn hover:bg-[#f3bf25a4]" : "bg-btn2 text-[#888]"}`}
        >
          {canClaim ? "Claim" : "Claim"}
        </button>
        </div>

        </div>


            <BoostFarm/>
           
      </div>
    </div>


    {showSettings && (
        <div className="fixed left-0 right-0 z-20 top-[-12px] bottom-0 flex justify-center taskbg px-[16px] h-full">

          <div id="refer" className='w-full flex flex-col'>
          <div className="w-full flex pt-6 flex-col space-y-6 overflow-y-auto pb-[100px] scroller">
            <div className="flex items-center space-x-4">
              <div className='w-full'>
                <h1 className='font-semibold text-[24px] text-center pb-4'>
                  Settings
                </h1>

                <div className="w-full flex flex-col pb-[100px]">
  
                <div className='flex w-full flex-col space-y-2'>
             
                    <button 
                      onClick={toggleMute}
                      className={`text-[15px] text-[#d2d2d2] bg-cards3 hover:bg-cards ease-in duration-200 h-[60px] rounded-[14px] px-4 flex justify-between items-center`}
                    >
                        <div className='flex items-center space-x-2 justify-start w-[80%]'>

                     
                      <span className=''>
                        <IoSettingsOutline size={18} className={``} />
                      </span>
                      <div className='flex flex-col text-left'>

                   
                      <h2 className='flex flex-1 font-medium text-[13px]'>
                    {isMuted ? 'Unmute fan sound' : 'Mute fan sound'} 
                      </h2>
                      <div className='text-[12px] font-normal'>

                          </div>
                         </div>
                         </div>
                         {isMuted ? (
                            <IoVolumeMute size={24} className={`text-[#959595]`} />
                         ) : (
                          <IoVolumeMediumSharp size={24} className={`text-[#959595]`} />
                         )}
                      
            
                    </button>
            
                </div>

              </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}


<div className='w-full absolute top-[50px] flex justify-center z-50 pointer-events-none select-none'>
      {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>


<div
        className={`${claimModal === true ? "visible" : "invisible"} fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div ref={modalRef} className={`${claimModal === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"} w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
          
          
        <div className="w-full flex justify-center flex-col items-center space-y-3">
        <IoCheckmarkCircleSharp size={32} className="text-accent" />
        <p className="font-medium text-center">Congratulations!</p>
        <span className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2 flex flex-col justify-center w-full text-center items-center space-x-1">
          
          <span className='flex items-center justify-center space-x-[2px] text-[18px]'>
          <img src='/dogs.webp' alt='dscfd' className='w-[18px]'/>

          <span className="text-accent pr-[6px]">+{formatNumber(pointsEarned)} {texts.projectSymbol} </span> CLAIMED
              </span>
        </span>
        <p className="pb-6 text-[15px] w-full text-center">
          Continue mining to claim more tokens daily! 😎
        </p>
      </div>


        

          <div className="w-full flex justify-center">
            <button
              onClick={closeClaimerr}
              className={`bg-btn4 w-full py-[16px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
             Continue Mining
            </button>
          </div>
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
            <div className='w-[50px] h-[50px] fanbg border-[#616161] border-[2px] flex justify-center rounded-full items-center text-center relative'>
{isFarming ? (
  <img src='/fan.webp' alt='dscfd' className='w-[30px] h-[30px] animate-spin' style={{ animationDuration: '2s' }}/>
) : (
  <img src='/fan.webp' alt='dscfd' className='w-[30px] h-[30px]'/>
)}
<div className='absolute z-10 bg-[#3f2900] border-[1px] border-[#8b8b8b] rounded-full h-[16px] w-[16px] flex justify-center items-center'>
<img src='/dogs.webp' alt='sdfd' className='w-[8px]'/>
</div>


                    </div>
              <p className='font-medium text-[14px]'>mining profit per hour</p>
            </div>
            <h3 className="font-medium text-center text-[20px] text-[#ffffff] pb-2 uppercase">
          {user.miningPower} PPH
            </h3>
            <p className="pb-6 text-[13px] w-full text-center">
          This is the amount of tokens you earn every 1 hour when mining is active, you can boost your mining profit by clicking on the Boost Mining option.
             </p>
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


      <div
        className={`${
          openInfoThree === true ? "visible" : "invisible"
        } fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-end backdrop-blur-[10px]`}
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

    </Animate>
  );
};

export default CryptoFarming;
