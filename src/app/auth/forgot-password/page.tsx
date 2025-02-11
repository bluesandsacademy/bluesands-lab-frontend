"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function ForgotPassword() {

    useEffect(() => {
        document.title = "Reset Password | Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences"
    }, [])

    return (
        <>
            <section className="min-h-screen p-3 mb-10">
                <div className='w-full flex justify-center relative z-0'>
                    <img src="/images/bg/cover.png" className="w-full object-contain z-0" alt="" />
                    <div className="absolute text-center text-white max-w-lg md:bottom-36 bottom-5 space-y-3">
                        <h1 className="text-2xl md:text-4xl font-normal">Reset Password</h1>
                        <p className="font-thin md:text-lg text-sm md:max-w-lg max-w-xs">Please enter your details to receive a one-time password (OTP) for resetting your password.</p>
                    </div>
                </div>
                <form className='border max-w-2xl mx-auto flex flex-col gap-y-5 py-5 px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white'>
                    <div className='flex flex-col w-full gap-y-4'>
                        <label htmlFor="emailAddress" className='font-medium text-gray-700 text-md'>Email Address</label>
                        <input type="text" className='rounded-md border px-3 py-3 w-full text-gray-600' id='emailAddress' />
                    </div>
                    <div className="w-full flex flex-col gap-y-3">
                        <button type="button" className={`text-center  rounded-md py-5 bg-bgBlue text-white w-full text-lg`}>Reset Password</button>
                    </div>
                </form >
            </section >

        </>
    )
}