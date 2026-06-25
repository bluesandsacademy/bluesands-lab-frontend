"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { GoHome } from 'react-icons/go'

const NotFoundPage = () => {
  const router = useRouter() 
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className="flex flex-col justify-center items-center p-2 md:p-4 lg:p-6 gap-4">
        <img src="/images/logo/blue_sands_blue.png" alt="logo" className="w-40" />
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl lg:text-3xl font-semibold">
            Oops, Page not found
          </p>
          <p className="text-center text-text-muted text-sm w-full md:w-[60%]">
            Something went wrong. It looks like your requested page could not be found.
          </p>
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <button 
              className='flex items-center gap-2 bg-white border-2 border-bgBlue rounded-md p-2 text-bgBlue' 
              onClick={() => router.back()}
            >
              <FaArrowLeft /> GO BACK
            </button>
            <Link href={"/"}>
              <button className='flex items-center gap-2 bg-bgBlue rounded-md p-2 text-white'>
                <GoHome /> GO TO HOME
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
