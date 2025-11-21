import React from 'react'
import { useMongoUser } from '../context/mongoContext'
import { NavLink } from 'react-router-dom'
import Partners from '../Components/Partners'
import { MdLocationPin } from 'react-icons/md'
import { texts } from '../constants'

const Earns = () => {
    const {user} = useMongoUser()

  return (
    <div className="w-full pt-4 justify-center flex-col space-y-3 px-5">
          <div id="refer" className="w-full h-screen scroller overflow-y-auto pb-[150px] space-y-3">

    <div className="w-full flex justify-center">
      <h1 className="font-semibold text-[28px] text-[#ffffffe0] pb-1 text-center">
        Play games to <br/>earn more {texts.projectSymbol}
      </h1>
    </div>

    <h3 className='font-medium text-[18px] pt-5 pl-2'>
        Games
          </h3>
    
    <div
className="w-full bg-cards rounded-[16px] px-3 py-3 flex items-center justify-between space-x-1">
              
            
                <div className='flex items-center justify-center bg-[#1f2023] h-[50px] w-[50px mr-1 rounded-full p-1'>
                <div className='w-[40px] h-[40px] fanbg border-[#616161] border-[2px] flex justify-center rounded-full items-center text-center relative'>
<img src='/fan.webp' alt='dscfd' className='w-[25px] h-[25px]'/>
<div className='absolute z-10 bg-[#3f2900] border-[1px] border-[#8b8b8b] rounded-full h-[24px] w-[24px] flex justify-center items-center'>
<img src='/dogs.webp' alt='sdfd' className='w-[10px]'/>
</div>


                    </div>
                </div>
            
                <div className="flex h-full flex-1 flex-col justify-center relative">
                  <div className='flex w-full flex-col justify-between h-full space-y-0.5'>
                    <h1 className="text-[16px] text-nowrap line-clamp-1 font-semibold">
                    Farm to earn
                    </h1>
                    <span className='flex text-secondary items-center w-fit text-[15px]'>
                   
                      <span className='text-[13px]'>
                        {user?.miningPower} profit per hour
                      </span>
                    </span>
                  </div>
                </div>
                <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative'>

                            <NavLink to='/farm'
                            className={`bg-[#36373c] text-[#fff] w-fit py-[10px] rounded-[30px] px-3 font-semibold ease-in duration-200`}
                          >
                           Farm now
                          </NavLink>
        
                </div>
              </div>


    <div
className="w-full bg-cards rounded-[16px] px-3 py-3 flex items-center justify-between space-x-1">
              
            
                <div className='flex items-center justify-center w-[50px] mr-1 p-1'>
                <div className='w-[40px] flex justify-center rounded-full items-center text-center relative'>
<img src='/spin.svg' alt='dscfd' className='w-[45px]'/>



                    </div>
                </div>
            
                <div className="flex h-full flex-1 flex-col justify-center relative">
                  <div className='flex w-full flex-col justify-between h-full space-y-0.5'>
                    <h1 className="text-[16px] text-nowrap line-clamp-1 font-semibold">
                  Spin & earn
                    </h1>
                    <span className='flex text-secondary items-center w-fit text-[15px]'>
                   
                      <span className='text-[13px]'>
                        min 500 {texts.projectSymbol}
                      </span>
                    </span>
                  </div>
                </div>
                <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative'>

                            <NavLink to='/spinearn'
                            className={`bg-[#36373c] text-[#fff] w-fit py-[10px] rounded-[30px] px-3 font-semibold ease-in duration-200`}
                          >
                          Play now
                          </NavLink>
        
                </div>
              </div>



              <h3 className='font-medium text-[18px] pt-5 pl-2'>
       Special Tasks
          </h3>
        
          <div
className="w-full bg-cards rounded-[16px] px-3 py-3 flex items-center justify-between space-x-1">
              
            
                <div className='flex items-center justify-center w-[40px]'>
                <div className='w-[40px] flex justify-center rounded-full items-center text-center relative'>
<MdLocationPin size={45} className='w-[45px] text-accent'/>



                    </div>
                </div>
            
                <div className="flex h-full flex-1 flex-col justify-center relative">
                  <div className='flex w-full flex-col justify-between h-full space-y-0.5'>
                    <h1 className="text-[15px] text-nowrap line-clamp-1 font-medium">
                  Daily Checkin
                    </h1>
                    <span className='flex text-secondary items-center w-fit text-[15px]'>
                   
                      <span className='text-[13px]'>
                        earn more daily
                      </span>
                    </span>
                  </div>
                </div>
                <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative'>

                            <NavLink to='/checkin'
                            className={`bg-[#36373c] text-[#fff] w-fit py-[10px] rounded-[30px] px-3 font-semibold ease-in duration-200`}
                          >
                          Claim now
                          </NavLink>
        
                </div>
              </div>

          <Partners/>


    </div>

    </div>
  )
}

export default Earns