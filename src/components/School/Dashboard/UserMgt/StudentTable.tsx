import React from 'react'
import { SlOptionsVertical } from 'react-icons/sl'

const SchoolStudentTable = () => {
  return (
    <table className='bg-white rounded-md'>
                  <tr className="border-b border-b-gray-200 text-xs text-gray-500">
                    <td className="p-2">Name</td>
                    <td className="p-2">Student ID</td>
                    <td className="p-2">Email</td>
                    <td className="p-2">Class</td>
                    <td className="p-2">Last Login</td>
                    <td className="p-2">Status</td>
                    <td className="p-2">Action</td>
                  </tr>
                <tbody>
                  <tr className="text-xs border-b border-b-gray-200">
                    <td className="p-2">Firstname Lastname</td>
                    <td className="p-2">StudentID</td>
                    <td className="p-2">student@email</td>
                    <td className="p-2">Class</td>
                    <td className="p-2">T hours ago</td>
                    <td className="p-2"><p className="flex w-max p-0.5 px-2 bg-green-200 text-green-600 items-center justify-center rounded-md"> Paid</p></td>
                    <td className="p-2"><button className=" flex gap-1 items-center"><SlOptionsVertical /></button></td>
                  </tr>
                </tbody>
              </table>
  )
}

export default SchoolStudentTable