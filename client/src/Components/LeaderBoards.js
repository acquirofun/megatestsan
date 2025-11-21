import React, { useEffect, useState } from 'react';
import BoostRank from './BoostRank';
import { useMongoUser } from '../context/mongoContext';


const METRICS = {
  BALANCE: { key: 'balance', label: 'Balance' },
  MINING: { key: 'miningTotal', label: 'Mining Total' }
};

const CACHE_KEYS = {
  leaderboard: (metric) => `leaderboard_data_${metric}`,
  userPosition: (telegramId, metric) => `user_position_${telegramId}_${metric}`,
  lastUpdate: (metric) => `leaderboard_last_update_${metric}`
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
  const getInitials = (username) => {
    // Check if username is defined and is a string
    if (!username || typeof username !== 'string') {
      return ''; // or return some default value
    }
  
    const nameParts = username.split(' ');
    
    // Check if there's at least one name part
    if (nameParts.length === 0) {
      return '';
    }
  
    // Get the first two letters of the first name
    const firstPart = nameParts[0];
    if (firstPart.length >= 2) {
      return firstPart.charAt(0).toUpperCase() + firstPart.charAt(1).toUpperCase();
    }
    
    // If name is only one character
    return firstPart.charAt(0).toUpperCase();
  };
  const getRandomColor = () => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Custom images for top 5 users
  const rankImages = [
    '/1st.webp', // 1st place image
    '/2nd.webp', // 2nd place image
    '/3rd.webp', // 3rd place image
    '/4th.webp', // 4th place image
    '/5th.webp', // 5th place image
    '/6th.webp', // 5th place image
    '/7th.webp', // 5th place image
    '/8th.webp', // 5th place image
    '/9th.webp', // 5th place image
    '/10th.webp', // 5th place image
  ];

    // Define rewards for the top 5 users
    const rewards = [
      { rank: 1, amount: '500 TON' },  // 1st place reward
      { rank: 2, amount: '350 TON' },   // 2nd place reward
      { rank: 3, amount: '250 TON' },   // 3rd place reward
      { rank: 4, amount: '150 TON' },   // 4th place reward
      { rank: 5, amount: '50 TON' },    // 5th place reward
    ];



  const shortenName = (name) => {
    // Check if the name is longer than 16 characters
    if (name.length > 16) {
      return name.substring(0, 16) + '...'; // Return the first 16 characters followed by '...'
    }
    return name; // Return the original name if it's less than or equal to 16 characters
  };


  const shortenNameTwo = (name) => {
    // Check if the name is longer than 16 characters
    if (name.length > 10) {
      return name.substring(0, 10) + '...'; // Return the first 16 characters followed by '...'
    }
    return name; // Return the original name if it's less than or equal to 16 characters
  };

// Cache management functions
const cacheManager = {
  isNewDay: (lastUpdate) => {
    if (!lastUpdate) return true;
    
    const lastUpdateDate = new Date(lastUpdate);
    const currentDate = new Date();
    
    return (
      lastUpdateDate.getDate() !== currentDate.getDate() ||
      lastUpdateDate.getMonth() !== currentDate.getMonth() ||
      lastUpdateDate.getFullYear() !== currentDate.getFullYear()
    );
  },

  getCachedData: (key) => {
    try {
      const cacheData = localStorage.getItem(key);
      if (!cacheData) return null;

      const { data, timestamp } = JSON.parse(cacheData);
      
      if (cacheManager.isNewDay(timestamp)) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  },

  setCachedData: (key, data) => {
    try {
      const cacheData = {
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache setting error:', error);
    }
  },

  clearCache: (metric) => {
    try {
      localStorage.removeItem(CACHE_KEYS.leaderboard(metric));
      localStorage.removeItem(CACHE_KEYS.lastUpdate(metric));
    } catch (error) {
      console.error('Cache clearing error:', error);
    }
  }
};

const MetricTab = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-[6px] text-[#c6c6c6] py-[10px] text-nowrap barTitle px-3 w-[45%] flex space-x-2 justify-center text-center text-[14px] font-semibold items-center
      ${active 
        ? 'bg-btn text-[#ebebeb]' 
        : ''}`}
  >
    {label}
  </button>
);

const Leaderboards = ({ currentUserTelegramId }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(METRICS.BALANCE.key);
  const [lastUpdate, setLastUpdate] = useState(null);
  const {user} = useMongoUser();

  const fetchLeaderboardData = async (metric, forceFetch = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first if not forcing a fetch
      if (!forceFetch) {
        const cachedLeaderboard = cacheManager.getCachedData(CACHE_KEYS.leaderboard(metric));
        const cachedPosition = cacheManager.getCachedData(CACHE_KEYS.userPosition(currentUserTelegramId, metric));
        const cachedLastUpdate = cacheManager.getCachedData(CACHE_KEYS.lastUpdate(metric));

        if (cachedLeaderboard && cachedPosition && cachedLastUpdate) {
          setLeaderboardData(cachedLeaderboard);
          setUserPosition(cachedPosition);
          setLastUpdate(cachedLastUpdate);
          setLoading(false);
          return;
        }
      }



      const SERVER_URL = process.env.REACT_APP_SERVER_URL;
      // Fetch fresh data
      const [leaderboardResponse, positionResponse] = await Promise.all([
        fetch(`${SERVER_URL}/api/leaderboard/${metric}`),
        fetch(`${SERVER_URL}/api/leaderboard/position/${currentUserTelegramId}/${metric}`)
      ]);

      if (!leaderboardResponse.ok || !positionResponse.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const [leaderboardJson, positionJson] = await Promise.all([
        leaderboardResponse.json(),
        positionResponse.json()
      ]);

      setLeaderboardData(leaderboardJson.leaderboard);
      setUserPosition(positionJson);
      const currentTime = new Date().toISOString();
      setLastUpdate(currentTime);

      // Cache the fresh data
      cacheManager.setCachedData(CACHE_KEYS.leaderboard(metric), leaderboardJson.leaderboard);
      cacheManager.setCachedData(CACHE_KEYS.userPosition(currentUserTelegramId, metric), positionJson);
      cacheManager.setCachedData(CACHE_KEYS.lastUpdate(metric), currentTime);

    } catch (err) {
      setError('Failed to load leaderboard data');
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(selectedMetric);
    // eslint-disable-next-line
  }, [selectedMetric, currentUserTelegramId]);

  useEffect(() => {
    const checkDayChange = () => {
      if (lastUpdate && cacheManager.isNewDay(lastUpdate)) {
        cacheManager.clearCache(selectedMetric);
        fetchLeaderboardData(selectedMetric, true);
      }
    };

    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [lastUpdate, selectedMetric]);

  const getDisplayValue = (user) => {
    return selectedMetric === METRICS.MINING.key ? user.miningTotal : user.balance;
  };

  const handleRefresh = async () => {
    await fetchLeaderboardData(selectedMetric, true);
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-full">
        <div className="w-[50px] h-[50px] border-[6px] border-[#6c6c6c] mt-[-20%] border-dashed rounded-full animate-spin marco"></div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex justify-center flex-col items-center h-full">
           <span className='text-[13px] pb-2'>
           Failed to display leaderBoard
            </span> 
<br/>
            <button onClick={handleRefresh} className='font-bold text-[15px] cursor-pointer text-yellow-500'>
                Try again
            </button>
      </div>
    );
  }

  return (
    <>


<div className='w-full flex justify-between bg-[#17181A] rounded-[12px] relative z-10'>
          {Object.values(METRICS).map((metric) => (
            <MetricTab
              key={metric.key}
              active={selectedMetric === metric.key}
              label={metric.label}
              onClick={() => setSelectedMetric(metric.key)}
            />
          ))}

      </div>





      <div className={`w-full flex-col spacey-1 pt-6 relative !mt-0`}>

      {selectedMetric === METRICS.BALANCE.key && (  
      <div className='w-full flex flex-col pt-24 space-y-3 justify-center items-center relative'>
        
        <img src='/circle.svg' alt='dfc' className='w-full absolute top-[-40px] hidden'/>


        <div className='w-full flex items-center justify-center gap-4 relative'>

            {leaderboardData.slice(0, 3).map((leader, index) => (

                <div key={index} className="flex flex-col items-center justify-center first:absolute first:mt-[-100px] even:absolute even:left-8 even:mt-[-50px] last:absolute last:right-6 last:mt-[-4px]">
                    

                    {index === 0 && (

<img src='/medal2.svg' alt='ffdv' className='absolute mt-[-90px] w-[24px]'/>
    )}


                    <img src={rankImages[index]} alt={leader.firstName || 'users'} className='w-[40px]'/>
                  

                    <h2 className='font-medium text-[11px] pt-3 pb-1'>
                        {shortenNameTwo(leader.firstName + leader.lastName)}
                    </h2>
                    <div className='flex items-center space-x-1 text-[11px] font-semibold'>
                        <img src='/stars2.svg' alt='dfc' className='w-[12px]'/>
                       <span> {formatNumber(getDisplayValue(leader))}</span>
                    </div>

                </div>

            ))}


        </div>


                    <div className='flex flex-col w-[85%] items-center justify-center !mb-[-60px]'>


                        <img src='/ranks.svg' alt='' className=''/>
                        
                    </div>

                    <div className='w-full relative bg-[#090600] rounded-[8px] leadershadow flex flex-col space-y-2'>


              
<BoostRank/>
 {/* Display the active user's rank */}


 {userPosition && (
     <div className='bg-[#202124] py-2 px-3 flex flex-col font-medium w-full rounded-[8px]'>
              
              <h2 className="text-[13px] text-secondary font-semibold">Your Rank</h2>
              <div 
                className="w-full rounded-[16px] py-2 flex items-center justify-between space-x-3">
            
                <div className='w-fit'>
                  <div className={`flex items-center justify-center h-[38px] w-[38px] rounded-full p-1 ${getRandomColor()}`}>
                  <span className='font-semibold text-[14px]'>{getInitials(userPosition.nearbyUsers.find(u => u.isCurrentUser)?.username || 'You')}</span>
                  </div>
                </div>
                  <div className="flex h-full flex-1 flex-col justify-center relative">
                    <div className='flex w-full flex-col justify-between h-full space-y-[2px]'>
                      <h1 className="text-[14px] text-nowrap line-clamp-1 font-medium">
                      {userPosition.nearbyUsers.find(u => u.isCurrentUser)?.username  || 'You'}
                      </h1>
                      <span className='flex items-center gap-1 flex-1 text-[12px]'>
        
                        <img src='/stars2.svg' alt='dvf' className='w-[10px]'/>
                     
                        <span className='text-[12px] text-nowrap font-medium'>
                          {formatNumber(user.balance)} 
                    
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative px-1'>
                 
                    <button
                    className={`font-semibold ease-in duration-200`}
                  >
                    #{userPosition.userRank}
           
    
    
                  </button>
                  
    
        
                  </div>
                </div>
            </div>
            
    
        )}



            </div>



        </div>
      )}


{selectedMetric === METRICS.MINING.key && (  
    <>

{userPosition && (
     <div className='bg-[#202124] py-2 px-3 flex flex-col font-medium w-full rounded-[8px]'>
              
              <h2 className="text-[13px] text-secondary font-semibold">Your Rank</h2>
              <div 
                className="w-full rounded-[16px] py-2 flex items-center justify-between space-x-3">
            
                <div className='w-fit'>
                  <div className={`flex items-center justify-center h-[38px] w-[38px] rounded-full p-1 ${getRandomColor()}`}>
                  <span className='font-semibold text-[14px]'>{getInitials(userPosition.nearbyUsers.find(u => u.isCurrentUser)?.username || 'You')}</span>
                  </div>
                </div>
                  <div className="flex h-full flex-1 flex-col justify-center relative">
                    <div className='flex w-full flex-col justify-between h-full space-y-[2px]'>
                      <h1 className="text-[14px] text-nowrap line-clamp-1 font-medium">
                      {userPosition.nearbyUsers.find(u => u.isCurrentUser)?.username || 'You'}
                      </h1>
                      <span className='flex items-center gap-1 flex-1 text-[12px]'>
        
                        <img src='/stars2.svg' alt='dvf' className='w-[10px]'/>
                     
                        <span className='text-[12px] text-nowrap font-medium'>
                          {formatNumber(user.balance)} 
                    
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative px-1'>
                 
                    <button
                    className={`font-semibold ease-in duration-200`}
                  >
                    #{userPosition.userRank}
           
    
    
                  </button>
                  
    
        
                  </div>
                </div>
            </div>
            
    
        )}
            </>
    )}


<div className="w-full flex flex-col space-y-3 pt-3">
{leaderboardData.map((user, index) => (
  
                   <div 
            key={user.rank} 
            className="w-full rounded-[16px] py-3 flex items-center justify-between space-x-3">
        
            <div className='w-fit'>
              <div className={`flex items-center justify-center h-[42px] w-[42px] rounded-full p-1 ${getRandomColor()}`}>

                <span className='font-semibold text-[14px]'>{getInitials(user.firstName + user.lastName)}</span>
         
              </div>
            </div>
              <div className="flex h-full flex-1 flex-col justify-center relative">
                <div className='flex w-full flex-col justify-between h-full space-y-[2px]'>
                  <h1 className="text-[14px] text-nowrap line-clamp-1 font-medium">
                  {shortenName(user.firstName + user.lastName)}
                  </h1>
                  <span className='flex items-center gap-1 flex-1 text-[12px]'>
    
                    <img src='/stars2.svg' alt='dvf' className='w-[10px]'/>
                 
                    <span className='text-[12px] text-nowrap font-medium'>
                    {formatNumber(getDisplayValue(user))}
                    </span>
                    {selectedMetric === METRICS.BALANCE.key && (
                        <>

{index < 5 && (
                           <span className="text-green-500 text-[10px] font-medium">
                              + {rewards[index].amount} reward
                           </span>
                        )}
                        </>


                    )}


                  </span>
                </div>
              </div>
              <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative px-4'>
             
             
              {index < 10 ? (
                <img
                  src={rankImages[index]} // Display the custom image for the user rank
                  alt={`Rank ${user.rank}`}
                  className="w-[24px] h-auto"
                />
              ) : (
                <button
                className={`font-semibold ease-in duration-200`}
              >
              #{user.rank}
              </button>
              )}

    
              </div>
            </div>

            
      
        ))}
             </div>
   
   </div>

    
    </>
  );
};

export default Leaderboards;