import React from 'react'
import SpinGame from '../Components/SpinGame'
import Animate from '../Components/Animate'

const SpinEarn = () => {



  return (
    <Animate>
    <div className='w-full'>
    <div id="refer" className="w-full h-screen scroller overflow-y-auto pb-[150px] space-y-3">

        <SpinGame/>
    </div>
    </div>
    </Animate>
  )
}

export default SpinEarn