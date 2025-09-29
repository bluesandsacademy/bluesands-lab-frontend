"use client"
import ReportTable from "@/components/Dashboard/ReportTable";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import FilterButton from "@/services/FilterButton";
import { useUser } from "@/services/UserContext";
import React, { useState } from "react";

const DashboardLeaderboardPage = () => {
  const {user} = useUser()
   const firstName = user?.fullName?.split(" ")[0];
    
    // Filter options
    const filters = ["Classmates", "Schoolmates", "Nationwide users"];
    const [activeFilter, setActiveFilter] = useState(filters[0]);
  
    // Table configurations
    const tableConfig = {
      "Classmates": {
        headings: ["Name", "Subject", "Simulation", "Percentage"],
        data: [
          // {name: "Alex Chen", subject: "Physics", simulation:"Post Sim", percentage: "97%"},
          // {name: "Sarah Johnson", subject: "Chemistry", simulation:"Post Sim", percentage: "95%"},
          // {name: "Mike Rodriguez", subject: "Biology", simulation:"Pre Sim", percentage: "92%"},
          // {name: "Emma Wison", subject: "Mathematics", simulation:"Pre Sim", percentage: "90%"},
        ]
      },
      "Schoolmates": {
       headings: ["Name", "Subject", "Simulation", "Percentage"],
        data: [
          // {name: "Alex Chen", subject: "Physics", simulation:"Post Sim", percentage: "97%"},
          // {name: "Sarah Johnson", subject: "Chemistry", simulation:"Post Sim", percentage: "95%"},
          // {name: "Mike Rodriguez", subject: "Biology", simulation:"Pre Sim", percentage: "92%"},
          // {name: "Emma Wison", subject: "Mathematics", simulation:"Pre Sim", percentage: "90%"},
        ]
      },
      "Nationwide users": {
        headings: ["Name", "Subject", "Simulation", "Percentage"],
         data: [
          // {name: "Alex Chen", subject: "Physics", simulation:"Post Sim", percentage: "99%"},
          // {name: "Sarah Johnson", subject: "Chemistry", simulation:"Post Sim", percentage: "98%"},
          // {name: "Mike Rodriguez", subject: "Biology", simulation:"Pre Sim", percentage: "98%"},
          // {name: "Emma Wison", subject: "Mathematics", simulation:"Pre Sim", percentage: "97%"},
        ]
      }
    };
  
    // Get current table data based on active filter
    const getCurrentTableData = () => {
      return tableConfig[activeFilter as keyof typeof tableConfig];
    };
  
    const currentData = getCurrentTableData();


  return(  <div className="p-4 space-y-4">
      <WelcomeBanner firstName={firstName || ""} />
      
      <div>
        <h2 className="font-bold text-lg mb-2">Leaderboard</h2>
        
        <FilterButton 
          filters={filters}
          onFilterChange={setActiveFilter}
          activeFilter={activeFilter}
        />
        
        <div className="mt-4">
          <ReportTable 
            headings={currentData.headings}
            data={currentData.data}
            totalItems={currentData.data.length}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLeaderboardPage;
