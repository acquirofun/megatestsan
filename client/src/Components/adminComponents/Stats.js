import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiDollarSign, 
  FiClock, 
  FiActivity 
} from 'react-icons/fi';
import { PiArrowRight } from 'react-icons/pi';
import { NavLink } from 'react-router-dom';

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
        link: '/dashboardAdx/promo',
        title: 'Adverts/Promo Tasks',
    },
    {
      link: '/dashboardAdx/youtube',
      title: 'Youtube Tasks',
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


const StatisticCard = ({ title, value, icon: Icon, description }) => (
  <div className={`bg-cards p-4 rounded-[10px] w-[47%] sm:w-[32%] h-[120px] flex flex-col justify-center space-y-3`}>
       
       <h2 className="text-[16px] sm:text-[18px] font-semibold text-[#bdbdbd]">
                {title}
                </h2>
              <span className='text-[20px] sm:text-[24px] text-[#fff] font-bold'>
                {value}
                
                </span>
  </div>
);

const StatisticsDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const SERVER_URL = process.env.REACT_APP_SERVER_URL;
        const response = await fetch(`${SERVER_URL}/api/statistics`);
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStatistics(data.statistics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStatistics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-1 text-sm text-red-700">
              Failed to load statistics: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatBalance = (num) => {
    if (typeof num !== "number") {
      return "Invalid number";
    }
    
    // If the number is less than 1 and has more than 3 decimal places
    if (num < 1 && num.toString().split('.')[1]?.length > 3) {
      return num.toFixed(6).replace(/0+$/, ''); // Trims trailing zeroes
    }
    
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <>

<div className="w-full flex flex-col space-y-4 h-[100vh] scroller pt-4 overflow-y-auto pb-[150px]">
    <div className="w-full flex justify-start items-start flex-wrap gap-4">

<StatisticCard
            title="Total Users"
            value={formatNumber(statistics.totalUsers)}
            icon={FiUsers}
          />
          
          <StatisticCard
            title="Total Balance"
            value={formatBalance(statistics.totalBalance)}
            icon={FiDollarSign}
          />
          
          <StatisticCard
            title="Active Users"
            value={formatNumber(statistics.onlineLast24Hours)}
            icon={FiClock}
          />
          
          <StatisticCard
            title="Online Users"
            value={formatNumber(statistics.currentlyOnline)}
            icon={FiActivity}
          />


    </div>
    <h2 className='font-semibold text-[17px] pt-3'>
        Admin Control Items
    </h2>

    <div className='flex flex-col space-y-4 w-full'>

{linksTo.map((menu, index) => (
    <NavLink to={menu.link} key={index} className={`bg-cards px-4 py-4 flex rounded-[6px] justify-between items-center space-x-1 font-medium`}>

       <span className=''>
         {menu.title}
         </span>
         <span className=''>
    <PiArrowRight size={16} className=''/>
</span>
    </NavLink>
))}
    </div>
    </div>


    {/* <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Platform Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard
            title="Total Users"
            value={formatNumber(statistics.totalUsers)}
            icon={FiUsers}
            description="Total Users"
          />
          
          <StatisticCard
            title="Total Balance"
            value={formatBalance(statistics.totalBalance)}
            icon={FiDollarSign}
            description="Total Balances"
          />
          
          <StatisticCard
            title="24h Active Users"
            value={formatNumber(statistics.onlineLast24Hours)}
            icon={FiClock}
            description="Active Users(24hrs)"
          />
          
          <StatisticCard
            title="Currently Online"
            value={formatNumber(statistics.currentlyOnline)}
            icon={FiActivity}
            description="Online Now"
          />
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Last updated: {new Date(statistics.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div> */}
    
    
    </>
  );
};

export default StatisticsDashboard;