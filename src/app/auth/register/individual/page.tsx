"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

import { countries, genderOptions } from "@/lib/data"

export default function RegisterIndividualAccount() {

    useEffect(() => {
        document.title = "Create your Account | Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences"
    }, [])

    return (
        <>
            <section className="min-h-screen p-3 mb-10">
                <div className='w-full flex justify-center relative z-0'>
                    <img src="/images/bg/cover.png" className="w-full object-contain z-0" alt="" />
                    <div className="absolute text-center text-white max-w-lg md:bottom-36 bottom-5 space-y-3">
                        <h1 className="text-2xl md:text-4xl font-normal">Create your Account</h1>
                        <p className="font-thin md:text-lg text-sm md:max-w-lg max-w-xs">Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences</p>
                    </div>
                </div>
                <form className='border max-w-2xl mx-auto flex flex-col gap-y-5 py-5 px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white'>
                    <div className='flex flex-col w-full gap-y-4'>
                        <label htmlFor="fullName" className='font-medium text-gray-700 text-md'>Full Name</label>
                        <input type="text" className='rounded-md border px-3 py-3 w-full text-gray-600' id='fullName' />
                    </div>
                    <div className='flex flex-col w-full gap-y-4'>
                        <label htmlFor="emailAddress" className='font-medium text-gray-700 text-md'>Email Address</label>
                        <input type="text" className='rounded-md border px-3 py-3 w-full text-gray-600' id='emailAddress' />
                    </div>
                    <div className='flex flex-col w-full gap-y-4'>
                        <label htmlFor="phoneNumber" className='font-medium text-gray-700 text-md'>Phone Number</label>
                        <input type="text" className='rounded-md border px-3 py-3 w-full text-gray-600' id='phoneNumber' />
                    </div>
                    <div className='flex flex-col w-full gap-y-4'>
                        <label htmlFor="dob" className='font-medium text-gray-700 text-md'>DOB</label>
                        <input type="date" className='rounded-md border px-3 py-3 w-full text-gray-600' id='dob' />
                    </div>
                    <div className='flex flex-col w-full gap-y-4'>
                        <label htmlFor="gender" className='font-medium text-gray-700 text-md'>Gender</label>
                        <select className='rounded-md border px-3 py-3 w-full text-gray-600' id="gender">
                            {genderOptions.map((option, index) => (<option value={option} key={index}>{option}</option>))}
                        </select>
                    </div>
                    <div className='flex flex-col w-full gap-y-4'>
                        <label htmlFor="country" className='font-medium text-gray-700 text-md'>Country</label>
                        <select className='rounded-md border px-3 py-3 w-full text-gray-600' id="country">
                            {countries.map((option, index) => (<option value={option} key={index}>{option}</option>))}
                        </select>
                    </div>
                    <div className='flex flex-col w-full gap-y-4'>
                        <label htmlFor="password" className='font-medium text-gray-700 text-md'>Password</label>
                        <input type="password" className='rounded-md border px-3 py-3 w-full text-gray-600 text-lg' id='password' />
                    </div>
                    <div className="w-full flex gap-x-3 items-center">
                        <input type="checkbox" className="w-5 h-5" id="rememberPassword" />
                        <label htmlFor="rememberPassword" className='font-medium text-gray-700 text-md'>Remember Password</label>
                    </div>
                    <div className="w-full flex flex-col gap-y-3">
                        <button type="button" className={`text-center  rounded-md py-5 bg-bgBlue text-white w-full text-lg`}>Sign Up</button>
                        <p className="text-gray-500 text-center">Already have an account? <Link href="/auth/login" className="text-blue-500 underline font-normal">Sign in</Link></p>
                    </div>
                </form >
            </section >

        </>
    )
}