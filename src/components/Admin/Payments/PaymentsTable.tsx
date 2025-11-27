import { SlOptionsVertical } from "react-icons/sl";

const PaymentTable = () => {
  return (
    <div className="flex flex-col overflow-x-scroll">
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">ID</td>
            <td className="p-2">User</td>
            <td className="p-2">Plan</td>
            <td className="p-2">Amount</td>
            <td className="p-2">Gateway</td>
            <td className="p-2">Next Payment</td>
            <td className="p-2">Status</td>
            <td className="p-2">Action</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">TXNXXX</td>
            <td className="p-2">User's Name</td>
            <td className="p-2">Basic</td>
            <td className="p-2 text-sm">₦0.00</td>
            <td className="p-2">Paystack</td>
            <td className="p-2">DD-MM-YYYY</td>
            <td className="p-2">
              <p className="p-1 px-1.5 rounded-3xl bg-green-100 text-green-600 flex w-max">
                Success
              </p>
            </td>
            <td className="p-2">
              <button className=" flex gap-1 items-center">
                <SlOptionsVertical />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
