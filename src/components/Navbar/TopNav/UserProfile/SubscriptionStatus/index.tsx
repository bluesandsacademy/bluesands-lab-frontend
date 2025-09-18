import Link from 'next/link'
import React from 'react'

const SubscriptionStatus = () => {
  return (
    <div className="m-3 flex flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-12 rounded-md">
        <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">Subscription Status</p>
        <div className="flex flex-row w-full justify-between items-center">
        <div className='flex flex-col gap-2'>
          <p className="font-bold">Active Plan: Premium</p>
          <p className="text-sm">Renews on DD Month, YYYY</p>
        </div>
        <div>
            <Link href={"/dashboard/profile/subscriptions"}>
            <button  className="bg-slate-200 p-2 rounded-md text-sm">Manage</button>
            </Link>
            
        </div>
      </div>
    </div>
  )
}

export default SubscriptionStatus