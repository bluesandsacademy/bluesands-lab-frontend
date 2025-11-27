import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";

const SchoolBillingHistory = () => {
  return (
    <div className="flex flex-col gap-2 lg:gap-3 bg-white rounded-md p-2 mt-3 lg:mt-5">
      <p className="lg:text-lg font-semibold text-blue-950">Billing History</p>

      <table>
        <thead className="text-xs text-gray-500">
          <tr className="border-b border-b-gray-200">
            <td className="p-2">Date</td>
            <td className="p-2">Invoice</td>
            <td className="p-2">Amount</td>
            <td className="p-2">Status</td>
            <td className="p-2">Actions</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">DD-MM-YYYY</td>
            <td className="p-2">Invoice-Number</td>
            <td className="p-2">Amount</td>
            <td className="p-2"><p className="text-emerald-500 flex gap-1 items-center"><IoMdCheckmarkCircleOutline className="text-base" /> Paid</p></td>
            <td className="p-2"><button className="text-blue-700 flex gap-1 items-center"><MdOutlineFileDownload className="text-lg"/> Download</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SchoolBillingHistory;
//nothing