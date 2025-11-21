import React from 'react'
import { images } from '../constants'

const Spinner = () => {
  return (
    <div className='fixed left-0 right-0 top-0 bottom-0 flex w-full items-center justify-center z-[60]'>
<div className="spinner">
<div className="loaderans">
<img alt="daxy" src={images.logo} className='w-[300px]'/>
</div>
    
</div>
    </div>
  )
}

export default Spinner