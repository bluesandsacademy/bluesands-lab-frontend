"use client"
import SchoolBillingHistory from '@/components/School/Dashboard/Payments/BillingHistory';
import SchoolPaymentOverview from '@/components/School/Dashboard/Payments/Overview';
import SchoolStudentPayment from '@/components/School/Dashboard/Payments/StudentPayment';
import SchoolFilterButton from '@/components/School/Dashboard/SchoolFilterButton';
import React, { useState } from 'react'

const SchoolPaymentsAndSubPage = () => {

  const filters = ["Overview","Student Payment","Billing History","Plans and Pricing"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  return (
    <div className='mt-4 p-2 lg:p-4'>
      <SchoolFilterButton filters={filters} onFilterChange={setActiveFilter} activeFilter={activeFilter}/>
      {
        activeFilter === "Overview" ?
        <SchoolPaymentOverview/> :
        activeFilter === "Student Payment" ?
        <SchoolStudentPayment/> : 
        activeFilter === "Billing History" ?
        <SchoolBillingHistory/> : ""
      }
    </div>
  )
}

export default SchoolPaymentsAndSubPage