import React, { useState, useEffect, useRef } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { IoCheckmarkCircleSharp, IoSettingsOutline, IoVolumeMediumSharp, IoVolumeMute } from 'react-icons/io5';
import { useMongoUser } from '../context/mongoContext';
import axios from 'axios';
import BoostSpin from './BoostSpin';
import { images, texts } from '../constants';
import { useNavigate } from 'react-router-dom';

const SpinGame = () => {
  const {user, setUser, isMuted, setIsMuted, fanAudioRef} = useMongoUser()
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const spinContainerRef = useRef(null);
  const [congrats, setCongrats] = useState(false);
  const [openBoostSpin, setOpenBoostSpin] = useState(false);
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [showSettings, setShowSettings] = useState(false);
  const [backSpin, setBackSpin] = useState(true);
  const locations = useNavigate()

  
  const possibleValues = [
    500, 1000, 3000, 800, 2000, 1000, 5000, 
    8000, 2000, 7000, 900, 10000, 4000, 9000, 6000
  ];
  
  useEffect(() => {
    generateNumbers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleBackButton = () => {
      if (showSettings) {
        setShowSettings(false);
      } else if (backSpin) {
        locations('/earn');
        setBackSpin(false);
      }
    };
  
    // Show back button if either condition is true
    if (showSettings || backSpin) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackButton);
    } else {
      window.Telegram.WebApp.BackButton.hide();
    }
  
    // Cleanup
    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButton);
    };
  }, [showSettings, setShowSettings, backSpin, setBackSpin, locations]);

  
  const generateNumbers = () => {
    // Generate initial set of numbers
    const initialSet = Array(15).fill().map(() => {
      const rand = Math.random();
      if (rand < 0.2) {
        return possibleValues[Math.floor(Math.random() * 6)];
      } else if (rand < 0.8) {
        return possibleValues[Math.floor(Math.random() * 6) + 6];
      } else {
        return possibleValues[Math.floor(Math.random() * 3) + 12];
      }
    });
    
    // Repeat sets for smooth spinning
    setNumbers([...initialSet, ...initialSet, ...initialSet, ...initialSet]);
  };
  
  const spin = async () => {
    if (isSpinning) return;

    if (user.spinLimit <= 0) {
      setOpenBoostSpin(true);
      return;
    }
    
    setIsSpinning(true);
    setShowModal(false);
    
    // Fixed dimensions
    const itemHeight = 40;
    const fullSetHeight = itemHeight * 15;
    
    // Get current position
    const currentTransform = spinContainerRef.current ? 
      -parseInt(getComputedStyle(spinContainerRef.current).transform.split(',')[5]) || 0 : 0;
    
    // Calculate the current base index more precisely
    const currentBaseIndex = Math.round(currentTransform / itemHeight) % 15;
    
    // Select winning number from the second set
    const baseSetIndex = 15;
    const targetIndex = baseSetIndex + Math.floor(Math.random() * 15);
    const targetNumber = numbers[targetIndex];
    
    // Calculate final position
    const spinDistance = fullSetHeight * 2;
    const adjustedPosition = (targetIndex * itemHeight) - (currentBaseIndex * itemHeight);
    const finalPosition = currentTransform + spinDistance + adjustedPosition;
    
    // Set winning number before animation starts
    setWinningNumber(targetNumber);


    
    // Apply spinning animation
    if (spinContainerRef.current) {
      spinContainerRef.current.style.transition = `transform 4s cubic-bezier(0.15, 0.05, 0.15, 0.95)`;
      spinContainerRef.current.style.transform = `translateY(-${finalPosition}px)`;
    }
    
    setTimeout(() => {
      setShowModal(true);
      setCongrats(true);
      setTimeout(() => {
        setCongrats(false);
      },3000)
      setIsSpinning(false);

      
      // Reset position while maintaining alignment
      if (spinContainerRef.current) {
        spinContainerRef.current.style.transition = 'none';
        const resetPosition = finalPosition % fullSetHeight;
        spinContainerRef.current.style.transform = `translateY(-${resetPosition}px)`;

      }
    }, 4000);

    const newSpinLimit = user.spinLimit - 1; 
    if (user.spinLimit > 0) {
      try {

const response = await axios.post(`${SERVER_URL}/api/update-spin-balance`, {
  telegramId: user.telegramId,
  spinLimit: newSpinLimit,
  spinTimeStamp: new Date()
});

// Update local state with the response from server
setUser(prevUser => ({
  ...prevUser,
  spinLimit: response.data.data.spinLimit,
}));
console.log('SPIN DEDUCTED SUCCESSFULLY', user.spinLimit)
      } catch (error) {
        console.error('Error updating freeGuru:', error.response?.data?.message || error.message);
      }
    }
    
  };

  useEffect(() => {
    if (winningNumber !== null) {
      handleClaimReward()
    }
    // eslint-disable-next-line
  }, [winningNumber])

  const handleClaimReward = async () => {
      try {

        const response = await axios.post(`${SERVER_URL}/api/claim-spin-points`, {
          telegramId: user.telegramId,
          pointsAward: winningNumber,
      });

      // Update local state with the response from server
      setUser(prevUser => ({
          ...prevUser,
          balance: response.data.data.balance,
      }));

        console.log('Points claimed successfully');
      } catch (error) {
        console.error('Error updating freeGuru:', error.response?.data?.message || error.message);
      }
  };


  const closeClaim = () => {
    // Reset the spinner position while maintaining filled container
    if (spinContainerRef.current) {
      spinContainerRef.current.style.transition = 'none';
      const initialOffset = -40 * 3; // Start 3 items up from center
      spinContainerRef.current.style.transform = `translateY(${initialOffset}px)`;
    }
    // Generate new random numbers
    generateNumbers();
    // Reset winning number
    setWinningNumber(null);
    setShowModal(false)
  }


  useEffect(() => {
    if (isSpinning) {
      fanAudioRef.current.play(); // Play the sound when farming starts
    } else {
      fanAudioRef.current.pause(); // Pause the sound when farming stops
    }
    // eslint-disable-next-line
  }, [isSpinning]);

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
  


  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  return (
    <>
   
   <audio ref={fanAudioRef} src="/spin.mp3" loop muted={isMuted}></audio>


    <div className="w-full p-4">
      <div className="w-full flex flex-col">

      <div className="w-full pt-1 flex justify-center items-center pb-6">
          
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

        <h1 className="text-[26px] font-bold text-center mb-1">Spin & Earn</h1>
        <p className="text-[15px] font-medium text-center mb-4">Spin to earn {texts.projectName} tokens</p>
        <div className='bg-cards w-full p-4 rounded-xl'>
          {/* Spin wheel container */}
          <div className="relative h-52 mb-8 overflow-hidden rounded-lg bg-cards">
            {/* Top fade gradient */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-cards to-transparent z-10 pointer-events-none" />
            
            {/* Center indicator */}
            <div className="absolute left-0 right-0 top-1/2 m-mt-5">
              <div className="relative h-10 rounded-lg bg-[#45474e66]">
                {/* <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-yellow-400" /> */}
              </div>
            </div>
            
            {/* Bottom fade gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-cards to-transparent z-10 pointer-events-none" />
            
            {/* Numbers container with adjusted initial position */}
            <div 
              ref={spinContainerRef}
              className="absolute w-full transform"
              style={{ 
                top: '50%',
                transform: 'translateY(-120px)', // Initial offset to show numbers above and below
                willChange: 'transform'
              }}
            >
{numbers.map((number, index) => (
                <div 
                  key={index}
                  className={`
                    flex items-center justify-center h-10 text-[18px] 
                    [&:nth-child(n+4):nth-child(-n+4)]:text-white [&:nth-child(n)]:text-gray-500
                  `}
                >
                  <AiFillStar 
                    className={`mr-2 ${
                      number >= 13000 ? 'text-yellow-400' :
                      'text-yellow-700'
                    }`}
                    size={18}
                  />
                  <span className="font-semibold">
                    {number}
                  </span>
           
                </div>
              ))}
            </div>
          </div>
          
          {/* Spin button */}
          <button
            onClick={spin}
            disabled={isSpinning}
            className={`
              w-full py-3 text-[18px] bg-btn hover:bg-yellow-500 
              text-black font-semibold rounded-lg transition-colors
              ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isSpinning ? 'Spinning...' : 'Spin'}
          </button>
        </div>
        
        <p className="text-center mt-6 text-sm font-medium">
          Spin to win prizes. You have a free spin every 24 hours.
          Watch ads to get one more spin every hour.
        </p>
      </div>


{/*  */}


<div className='w-full absolute top-[50px] flex justify-center z-50 pointer-events-none select-none'>
      {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>



      <div
        className={`${
          showModal === true ? "visible" : "invisible"
        } fixed top-[-12px] claimdiv bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex flex-col justify-center items-center px-4`}
      >
 
        <div className={`${
          showModal === true ? "opacity-100 mt-0" : "opacity-0 mt-[100px]"
        } w-full bg-modal rounded-[16px] relative flex flex-col ease-in duration-300 transition-all justify-center p-8`}>
      

          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <IoCheckmarkCircleSharp size={32} className='text-accent'/>
              <p className='font-medium'>Let's go!!</p>
            </div>
            <h3 className="font-medium text-[24px] text-[#ffffff] pt-2 pb-2">
              <span className='text-accent'>+{winningNumber}</span> {texts.projectSymbol}
            </h3>
            <p className="pb-6 text-[#bfbfbf] text-[15px] w-full text-center">
              Keep spinning! something huge is coming! Get more {texts.projectSymbol} now! 
            </p>

            <div className="w-full flex justify-center">
            <button
              onClick={closeClaim}
              className="bg-btn text-[#000] w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
              Continue
            </button>
          </div>
          </div>
          </div>

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


    <BoostSpin openBoostSpin={openBoostSpin} setOpenBoostSpin={setOpenBoostSpin}/>
    </>

  );
};

export default SpinGame;