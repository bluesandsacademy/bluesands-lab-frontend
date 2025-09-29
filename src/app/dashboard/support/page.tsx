import React from "react";
import { BsChatFill } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const DashboardSupportPage = () => {
  return (
    <>
      <div className="p-1 md:p-3 lg:p-4 gap-6 flex flex-col">
        <div className="border border-gray-200 rounded-md flex flex-col gap-2 md:gap-3 p-2 md:p-3 lg:p-4">
          <p className="text-sm lg:text-base font-semibold">
            How can we help you today?
          </p>
          <div className="border border-gray-200 rounded-md flex flex-col gap-2 md:gap-3 p-2 md:p-3 lg:p-4">
            <div className="flex gap-4">
              <BsChatFill className="text-bgBlue text-xl lg:text-2xl" />
              <p className="text-sm lg:text-base font-semibold">Live Chat</p>
            </div>
            <p className="text-xs text-gray-600">
              Get Instant help from our support team
            </p>
            <p className="text-xs text-red-400">Unavailable</p>
          </div>
          <div className="border border-gray-200 rounded-md flex flex-col gap-2 md:gap-3 p-2 md:p-3 lg:p-4">
            <div className="flex gap-4">
              <FaPhoneAlt className="text-bgBlue text-xl lg:text-2xl" />
              <p className="text-sm lg:text-base font-semibold">
                Phone Support
              </p>
            </div>
            <p className="text-xs text-gray-600">Call us at ---</p>
            <p className="text-xs text-green-400">Available now</p>
          </div>
          <div className="border border-gray-200 rounded-md flex flex-col gap-2 md:gap-3 p-2 md:p-3 lg:p-4">
            <div className="flex gap-4">
              <MdEmail className="text-bgBlue text-xl lg:text-2xl" />
              <p className="text-sm lg:text-base font-semibold">
                Email Support
              </p>
            </div>
            <p className="text-xs text-gray-600">
              Send us your questions anytime
            </p>
            <p className="text-xs text-green-400">Available now</p>
          </div>
        </div>

        <form action="submit" className="bg-white rounded-md gap-2 md:gap-3 p-2 md:p-3 lg:p-4">
          <p className="text-sm lg:text-base font-semibold">
            Submit a Support Request
          </p>
          <div className="mt-3 md:mt-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-semibold">Name</label>
              <input type="text" className="border border-gray-300 rounded-md p-2 text-sm" id="name" placeholder="Your Full Name"/>
            </div>
          </div>

          <div className="mt-3 md:mt-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold">Email</label>
              <input type="email" className="border border-gray-300 rounded-md p-2 text-sm" id="email" placeholder="your.email@example.com"/>
            </div>
          </div>

          <div className="mt-3 md:mt-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-xs font-semibold">Subject</label>
              <input type="text" className="border border-gray-300 rounded-md p-2 text-sm" id="subject" placeholder="Subject of issue"/>
            </div>
          </div>

          <div className="mt-3 md:mt-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-semibold">Message</label>
              <textarea name="comments" rows={4} className="border border-gray-300 rounded-md p-2 text-sm" id="message" placeholder="Please describe your issue or question in detail... "/>
            </div>
          </div>

          <button type="submit" disabled className="mt-3 md:mt-6 bg-bgBlue text-white w-full p-2 text-sm lg:text-base rounded">Submit</button>
        </form>
      </div>
    </>
  );
};

export default DashboardSupportPage;
