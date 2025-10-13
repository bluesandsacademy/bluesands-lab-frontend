"use client"

import ReportTable from "@/components/Dashboard/ReportTable";
import TeacherFilterButton from "@/components/Teacher/TeacherFilterButton";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";

const TeacherLeaderboardPage = () => {

    const filters = ["Class", "School"];
      const [activeFilter, setActiveFilter] = useState(filters[0]);
    
      // Table configurations
      const tableConfig = {
        Class: {
          headings: ["#", "Student Name", "Class", "Subject","Percentage"],
          data: [
            // {name: "Alex Chen", subject: "Physics", simulation:"Post Sim", percentage: "97%"},
            // {name: "Sarah Johnson", subject: "Chemistry", simulation:"Post Sim", percentage: "95%"},
            // {name: "Mike Rodriguez", subject: "Biology", simulation:"Pre Sim", percentage: "92%"},
            // {name: "Emma Wison", subject: "Mathematics", simulation:"Pre Sim", percentage: "90%"},
          ],
        },
        School: {
          headings: ["#", "Student Name", "Class", "Subject","Percentage"],
          data: [
            // {name: "Alex Chen", subject: "Physics", simulation:"Post Sim", percentage: "97%"},
            // {name: "Sarah Johnson", subject: "Chemistry", simulation:"Post Sim", percentage: "95%"},
            // {name: "Mike Rodriguez", subject: "Biology", simulation:"Pre Sim", percentage: "92%"},
            // {name: "Emma Wison", subject: "Mathematics", simulation:"Pre Sim", percentage: "90%"},
          ],
        },
      };
    
      // Get current table data based on active filter
      const getCurrentTableData = () => {
        return tableConfig[activeFilter as keyof typeof tableConfig];
      };
    
      const currentData = getCurrentTableData();
    

  return (
    <div>
        <div className="flex flex-col gap-4 p-2 lg:p-4">
              <div className="flex justify-between p-2 md:p-3 bg-white rounded-md">
                <div>
                  <p className="font-semibold text-blue-950 lg:text-lg">Leaderboard</p>
                  <p className="text-xs text-slate-500">
                    Top performing students in school / class
                  </p>
                </div>
                <div>
                  <button className="flex items-center gap-1 rounded-md p-2 px-3 text-xs md:text-sm text-white bg-blue-950  ">
                    <FaDownload />
                    Export
                  </button>
                </div>
              </div>
        
              <TeacherFilterButton filters={filters} onFilterChange={setActiveFilter} activeFilter={activeFilter} />
        
               <div className="mt-4">
                  <ReportTable 
                    headings={currentData.headings}
                    data={currentData.data}
                    totalItems={currentData.data.length}
                  />
                </div>
            </div>
    </div>
  )
}

export default TeacherLeaderboardPage