"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

import { countries, workPositions } from "@/lib/data"

export default function RegisterSchoolAccount() {

    useEffect(() => {
        document.title = "Create your Account | Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences"
    }, [])

    return (
        <>
            <section className="min-h-screen p-3 mb-10">
                <div className='w-full flex justify-center relative z-0'>
                    <img src="/images/bg/cover.png" className="w-full object-contain z-0" alt="" />
                    <div className="absolute flex flex-col items-center justify-center  top-1 md:top-0 text-center text-white max-w-lg md:bottom-36 bottom-5 space-y-1 lg:space-y-3">
                        <h1 className="text-xl md:text-2xl lg:text-4xl font-normal">Create your Account</h1>
                        <p className="font-thin text-xs md:text-sm lg:text-lg md:max-w-lg max-w-xs">Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences</p>
                    </div>
                </div>
                <form className='border max-w-2xl mx-auto flex flex-col gap-y-5 py-5 px-3 md:px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white'>
                    <div className='flex flex-col w-full gap-y-1 md:gap-y-4'>
                        <label htmlFor="fullName" className='font-medium text-gray-700 text-sm md:text-md'>Full Name</label>
                        <input type="text" className='rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base' id='fullName' />
                    </div>
                    <div className='flex flex-col w-full gap-y-1 md:gap-y-4'>
                        <label htmlFor="emailAddress" className='font-medium text-gray-700 text-sm md:text-md'>School Email Address</label>
                        <input type="text" className='rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base' id='emailAddress' />
                    </div>
                    <div className='flex flex-col w-full gap-y-1 md:gap-y-4'>
                        <label htmlFor="phoneNumber" className='font-medium text-gray-700 text-sm md:text-md'>Phone Number</label>
                        <input type="text" className='rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base' id='phoneNumber' />
                    </div>
                    <div className='flex flex-col w-full gap-y-1 md:gap-y-4'>
                        <label htmlFor="dob" className='font-medium text-gray-700 text-sm md:text-md'>DOB</label>
                        <input type="date" className='rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base' id='dob' />
                    </div>
                    <div className='flex flex-col w-full gap-y-1 md:gap-y-4'>
                        <label htmlFor="position" className='font-medium text-gray-700 text-sm md:text-md'>Position</label>
                        <select className='rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base' id="position">
                            {workPositions.map((option, index) => (<option value={option} key={index}>{option}</option>))}
                        </select>
                    </div>
                    <div className='flex flex-col w-full gap-y-1 md:gap-y-4'>
                        <label htmlFor="totalNoOfStudents" className='font-medium text-gray-700 text-sm md:text-md'>Total Number of Students</label>
                        <input type="number" placeholder="Number of Students" className='rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base' id='totalNoOfStudents' min={0} />
                    </div>
                    <div className='flex flex-col w-full gap-y-1 md:gap-y-4'>
                        <label htmlFor="country" className='font-medium text-gray-700 text-sm md:text-md'>Country</label>
                        <select className='rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base' id="country">
                            {countries.map((option, index) => (<option value={option} key={index}>{option}</option>))}
                        </select>
                    </div>
                    <div className='flex flex-col w-full gap-y-1 md:gap-y-4'>
                        <label htmlFor="password" className='font-medium text-gray-700 text-sm md:text-md'>Password</label>
                        <input type="password" className='rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base lg:text-lg' id='password' />
                    </div>
                    <div className="w-full flex gap-x-3 items-center">
                        <input type="checkbox" className="w-4 h-4 md:w-5 md:h-5" id="rememberPassword" />
                        <label htmlFor="rememberPassword" className='font-medium text-gray-700 text-sm md:text-md'>Remember Password</label>
                    </div>
                    <div className="w-full flex flex-col gap-y-1 md:gap-y-3">
                        <button type="button" className={`text-center text-sm md:text-base rounded-md py-2 md:py-3 lg:py-5 bg-bgBlue text-white w-full lg:text-lg`}>Sign Up</button>
                        <p className="text-gray-500 text-center text-sm md:text-base">Already have an account? <Link href="/auth/login" className="text-blue-500 underline font-normal">Sign in</Link></p>
                    </div>
                </form >
            </section >

        </>
    )
}