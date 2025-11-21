import React, { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { FaCheck } from "react-icons/fa6";
import { useMongoUser } from '../context/mongoContext';
import { TbLoader2 } from "react-icons/tb";

const exchangesList =[
    {
        name: "Binance exchange",
        icon: "/binance.webp",
        id: "binance",
    },
    {
        name: "Bybit exchange",
        icon: "/bybit.webp",
        id: "bybit",
    },
    {
        name: "MEXC exchange",
        icon: "/mexc.webp",
        id: "mexc",
    },
    {
        name: "Kukoin exchange",
        icon: "/kukoin.webp",
        id: "kukoin",
    },
    {
        name: "OKX exchange",
        icon: "/okx.webp",
        id: "okx",
    },
    {
        name: "BingX exchange",
        icon: "/bingx.webp",
        id: "bingx",
    },
    {
        name: "Gateio exchange",
        icon: "/gateio.webp",
        id: "gateio",
    },
    {
        name: "HTX exchange",
        icon: "/htx.webp",
        id: "htx",
    },
    {
        name: "Bitget exchange",
        icon: "/bitget.webp",
        id: "bitget",
    },
]

const Exchanges = ({ showExchange, setShowExchange }) => {
  const { user, setUser } = useMongoUser();
  const [modal, setModal] = useState(false);
  const [exchangeDetails, setExchangeDetails] = useState({});
  const [processingExchangeId, setProcessingExchangeId] = useState(null);

  useEffect(() => {
    const handleBackButtonClick = () => {
      setShowExchange(false);
    };

    if (showExchange) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
    } else {
      window.Telegram.WebApp.BackButton.hide();
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    }

    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    };
  }, [showExchange, setShowExchange]);

  const handleExchangeSelect = async (exchange) => {
   

    if (user.selectedExchange === exchange.name) {
      return;
    }
    setProcessingExchangeId(exchange.id);
      const now = new Date();
      localStorage.setItem('currentTime', now.toISOString());
    try {


      const SERVER_URL = process.env.REACT_APP_SERVER_URL;
      const response2 = await fetch(`${SERVER_URL}/api/select-exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: user.telegramId,  // Use the Firestore user ID as the Telegram user ID
          selectedExchange: { id: exchange.id, name: exchange.name, icon: exchange.icon }
        }),
      });
  
      const data = await response2.json();
      // console.log('DATA IS', bonusAward)
      if (!response2.ok) {
        throw new Error(data.message || 'Failed to save ton task');
      }

      setUser(prevUser => ({
        ...prevUser,
        selectedExchange: data.data.selectedExchange
      }));

      setExchangeDetails(exchange);
      setModal(true);
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setProcessingExchangeId(null);
    }
  };

  useEffect(() => {
    if (user.selectedExchange) {
      const selectedExchangeDetails = exchangesList.find(exchange => exchange.id === user.selectedExchange);
          // eslint-disable-next-line
      setExchangeDetails(selectedExchangeDetails || {});
    }
    // eslint-disable-next-line
  }, [user.selectedExchange]);

  const closeExchange = () => {
    setShowExchange(false);
    setModal(false);
  }

  return (
    <>
      {showExchange && (
        <div className="fixed left-0 right-0 z-20 top-[-12px] bottom-0 flex justify-center taskbg px-[16px] h-full">

          <div id="refer" className='w-full flex flex-col'>
          <div className="w-full flex pt-6 flex-col space-y-6 overflow-y-auto pb-[100px] scroller">
            <div className="flex items-center space-x-4">
              <div className='w-full'>
                <h1 className='font-semibold text-[24px] text-center pb-4'>
                  Choose exchange
                </h1>

                <div className="w-full flex flex-col pb-[100px]">
  
                <div className='flex w-full flex-col space-y-2'>
                  {exchangesList.map((exchange, index) => (
                    <button 
                      key={index}
                      disabled={user.selectedExchange.id === exchange.id || processingExchangeId === exchange.id}
                      onClick={() => handleExchangeSelect(exchange)}
                      className={`text-[15px] text-[#d2d2d2] bg-cards3 hover:bg-cards ease-in duration-200 h-[60px] rounded-[14px] px-4 flex justify-between items-center ${user.selectedExchange.id === exchange.id ? 'bg-cards' : ''}`}
                    >
                      <span className='w-[35px] mr-4'>
                        <img id={exchange.id} src={exchange.icon} alt={exchange.name} className={`w-full`} />
                      </span>
                      <h2 className='flex flex-1 font-semibold text-[16px]'>
                        {exchange.name}
                      </h2>
                      {user.selectedExchange.id === exchange.id ? (
                         <FaCheck size={24} className={`text-[#959595]`} />
                      ) : (
                    <>
                    {processingExchangeId === exchange.id ?  (
                      <TbLoader2 size={30} className='animate-spin text-[#959595]'/>
                    ):(
                      <MdOutlineKeyboardArrowRight size={30} className={`text-[#959595]`} />
                    )}
                  
                    </>
                      )}
                    </button>
                  ))}
                </div>

              </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      <div
        className={`${
          modal ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div className={`${
          modal ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <button
              onClick={closeExchange}
              className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]"
            >
              <IoClose size={24} className="text-[#9a96a6]"/>
            </button>
            <div className="w-full items-center justify-center flex flex-col pt-[20px]">
                <span className='w-[90px] h-[90px] bg-[#a5a5a526] rounded-full flex items-center justify-center p-2'>

            <img id={user.selectedExchange.id} src={user.selectedExchange.icon} alt={user.selectedExchange.name} className={`w-[60px]`}/>
                </span>
            </div>
            <h3 className="font-medium text-[18px] px-2 pt-2 !mt-[2px] text-center">
              You have signed a contract with <span className='text-accent'>{user.selectedExchange.name}</span>
            </h3>
            <span className="w-full text-center flex items-center space-x-1 !mt-[4px] pb-1">
              <span className='font-medium text-[16px]'>Listing and Airdrop coming soon!</span>
            </span>
            <div className="w-full flex justify-center">
              <button
                onClick={closeExchange}
                className={`bg-btn4 w-full text-[#000] py-[14px] px-6 flex items-center justify-center text-center rounded-[12px] font-semibold text-[16px]`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      {exchangeDetails && (
        <>
        </>
      )}
    </>
  );
};

export default Exchanges;
