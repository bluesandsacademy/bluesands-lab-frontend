import Link from "next/link";
import React from "react";

const Subscriptions = () => {
  return (
    <>
      <div className="m-3 flex flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-12 rounded-md">
        <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">
          Billing Information
        </p>

        <div className="flex flex-col gap-2">
          <p className="font-bold">Payment Method</p>
          <p className="text-sm">method goes here</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold">Billing Email</p>
          <p className="text-sm">user@email.here</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold">Next Payment</p>
          <p className="text-sm">Renews on DD Month, YYYY</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold">Subscription Since</p>
          <p className="text-sm">Renews on DD Month, YYYY</p>
        </div>
      </div>
      <div className="m-3 flex flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-12 rounded-md">
        <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">
          Payment History
        </p>

        <div className="flex flex-col gap-1">
          <p className="font-bold">Payment Method</p>
          <p className="text-sm">
            View and download your billing history and invoice
          </p>
        </div>
        <div className="flex justify-between p-2 md:px-4 bg-slate-100 rounded-md text-xs lg:text-sm">
          <p>2 Sept, 2025 - $19.00</p>
          <Link href={"#"} className="text-bgBlue underline">Download</Link>
        </div>
      </div>

      <div className="flex ">
        <div className="m-3 flex flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-6 rounded-md">
          <div>icon</div>
          <div className="flex flex-col gap-1">
            <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">
              Change Plan
            </p>
            <p className="text-sm">
              Upgrade or downgrade your Subscription tier
            </p>
          </div>
        </div>
        <div className="m-3 flex flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-6 rounded-md">
          <div>icon</div>
          <div className="flex flex-col gap-1">
            <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">
              Update Payment Method
            </p>
            <p className="text-sm">
              Change your payment method or billing address
            </p>
          </div>
        </div>
        <div className="m-3 flex flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-6 rounded-md">
          <div>icon</div>
          <div className="flex flex-col gap-1">
            <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">
              Cancel Subscription
            </p>
            <p className="text-sm">Cancel your subscriptions</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
