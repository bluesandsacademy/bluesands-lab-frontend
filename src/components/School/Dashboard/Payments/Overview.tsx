import Link from "next/link";
import React from "react";
import { BsBagPlusFill, BsCreditCardFill } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDoNotDisturb } from "react-icons/md";

interface OverviewProps {
  currentSub: string | undefined;
  daysRemaining: number | undefined;
  seats: number | undefined;
  isActive: boolean | undefined
}

const SchoolPaymentOverview = ({
  isActive,
  currentSub,
  daysRemaining,
  seats,
}: OverviewProps) => {
  return (
    <div className="flex flex-col gap-4 lg:gap-6 mt-3 lg:mt-5">
      <div className="flex flex-col p-2 bg-white rounded-lg gap-4 lg:gap-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="flex flex-col gap-4 lg:gap-6">
            <strong className="lg:text-lg">Current Subscription</strong>
            {/* <p className="text-sm">Professional Plan <strong className="text-blue-950">$229</strong>/month</p> */}
            <p className="text-sm">{currentSub ? currentSub : ""}</p>
          </div>
          <div>
            {isActive && (
              <p className="text-emerald-500 font-semibold flex gap-1 items-center">
                <IoMdCheckmarkCircleOutline /> Active
              </p>
            )}
            <p className="lg:text-lg font-semibold">Next Billing</p>
            <p className="text-sm">
              {daysRemaining ? daysRemaining : "0"} Day(s) remaining
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="bg-gray-200 p-2 lg:p-3 w-full md:w-[48%] rounded-md">
            <p className="text-sm lg:text-base font-semibold">
              {seats ? seats : "0"}
            </p>
            <p className="text-xs lg:text-sm">Student Limit</p>
          </div>

          <div className="bg-gray-200 p-2 lg:p-3 w-full md:w-[48%] rounded-md">
            <p className="text-sm lg:text-base font-semibold">0%</p>
            <p className="text-xs lg:text-sm">Usage this month</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm lg:text-base font-semibold">
            Included Features
          </p>
          {isActive && (
            <div>
              <p className="text-emerald-500 text-xs md:text-sm flex gap-1 items-center">
                {" "}
                <IoMdCheckmarkCircleOutline /> Unlimited Classes
              </p>
              <p className="text-emerald-500 text-xs md:text-sm flex gap-1 items-center">
                {" "}
                <IoMdCheckmarkCircleOutline /> Parent portal
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 items-center">
          <button className="bg-blue-950 text-white p-2 textxs md:text-sm rounded-md w-full">
            Manage Plan
          </button>
          <Link href={"#"} className="text-xs text-blue-950">
            Update Payment Method
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="m-3 flex flex-[1_1_30%] flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-6 rounded-md">
          <div className="p-3 bg-sky-200 w-max rounded-2xl">
            <BsBagPlusFill className="text-sky-600 text-xl lg:text-3xl" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">
              Change Plan
            </p>
            <p className="text-sm">
              Upgrade or downgrade your Subscription tier
            </p>
          </div>
        </div>
        <div className="m-3 flex flex-[1_1_30%] flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-6 rounded-md">
          <div className="p-3 bg-lime-200 w-max rounded-2xl">
            <BsCreditCardFill className="text-lime-800 text-xl lg:text-3xl" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">
              Update Payment Method
            </p>
            <p className="text-sm">
              Change your payment method or billing address
            </p>
          </div>
        </div>
        <div className="m-3 flex flex-[1_1_30%] flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-6 rounded-md">
          <div className="p-3 bg-red-200 w-max rounded-2xl">
            <MdDoNotDisturb className="text-pink-600 text-xl lg:text-3xl" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">
              Cancel Subscription
            </p>
            <p className="text-sm">Cancel your subscriptions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolPaymentOverview;
