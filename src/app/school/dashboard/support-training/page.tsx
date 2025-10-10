import React from 'react'
import { IoStar } from 'react-icons/io5'
import { LuClock5 } from 'react-icons/lu'

const SchoolSupportAndTrainingPage = () => {
  return (
    <div className='flex flex-col gap-4 p-2 md:p-4'>
      {/* flex div */}
      <div className='flex gap-4 flex-wrap justify-center md:justify-start'>
        {/* training Cards (exported?)*/}
        <div className='flex flex-col gap-2 rounded overflow-hidden bg-white w-52 h-64'>
          <div className='h-[45%] w-full bg-slate-400 flex items-center justify-center'>
              <p>Image here</p>
          </div>
          <div className='p-2 flex flex-col text-xs gap-2'>
            <div className='flex justify-between'>
              <p className='bg-green-200 text-green-700 rounded-md p-0.5 px-1'>BEGINNER</p>
              <p className='flex items-center gap-2 text-gray-500'><LuClock5 /> 60 Min</p>
            </div>
            <p className='text-xs'>Get started with Digital Teaching. To help improve your classes</p>
            <div className='flex justify-between'>
              <p className='flex items-center gap-2'>
                <IoStar className='text-yellow-500'/> 5.0
              </p>
              <p>255.6K Teachers</p>
            </div>
            <button className='flex justify-center items-center p-1.5 bg-blue-950 text-xs rounded-md text-white'>Start</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchoolSupportAndTrainingPage