import React from 'react'
import ReportTypeCard from './ReportTypeCard'
import { title } from 'process'

const SchoolReportExports = () => {

  const reportTypeDetails = [
    {title: "Class Performance Reports", description: "Detailed Analytics for all classes", availability: "Available in PDF, Excel format"},
    {title: "School Summary Report", description: "Overall school performance metrics", availability: "Available formats: PDF, Exce"},
    {title: "Teacher Evaluation Report", description: "Teacher Performance comparison", availability: "Available formats: PDF, Exce"},
    {title: "Student Progress Report", description: "Individual student analytics", availability: "Available formats: PDF, Exce"},
    {title: "Attendance Summary", description: "Overall school performance metrics", availability: "Available formats: PDF, Exce"}
  ]

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-[#263238] text-sm lg:text-base font-semibold'>Generate Reports</p>
      <div className='flex flex-wrap gap-4'>
        {reportTypeDetails.map((item,index)=>(
          <ReportTypeCard key={index} title={item.title} description={item.description} availability={item.availability}/>
        ))}
      </div>
    </div>
  )
}

export default SchoolReportExports