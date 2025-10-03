import React from 'react'
import { SlOptionsVertical } from 'react-icons/sl'

const SchoolClassTable = () => {
  return (
     <table className='bg-white rounded-md'>
                      <tr className="border-b border-b-gray-200 text-xs text-gray-500">
                        <td className="p-2">Class Name</td>
                        <td className="p-2">Teacher</td>
                        <td className="p-2">No of Students</td>
                        <td className="p-2">Subject</td>
                        <td className="p-2">Action</td>
                      </tr>
                    <tbody>
                      <tr className="text-xs border-b border-b-gray-200">
                        <td className="p-2">Class Name</td>
                        <td className="p-2">Teacher name</td>
                        <td className="p-2">00</td>
                        <td className="p-2">Subject</td>
                        <td className="p-2"><button className=" flex gap-1 items-center"><SlOptionsVertical /></button></td>
                      </tr>
                    </tbody>
                  </table>
  )
}

export default SchoolClassTable