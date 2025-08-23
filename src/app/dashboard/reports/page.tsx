"use client";

import React, { useState } from "react";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import FilterButton from "@/services/FilterButton";
import ReportTable from "@/components/Dashboard/ReportTable";
import { useUser } from "@/services/UserContext";

// // specific data types for each report
// interface ExperimentData {
//   index: string;
//   title: string;
//   totalnumber: string;
//   attempted: string;
//   completed: string;
// }

// interface QuizData {
//   index: string;
//   totalnumber: string;
//   averagescore: string;
//   highestscore: string;
// }

// interface CourseData {
//   index: string;
//   title: string;
//   hoursspent: string;
//   completed: string;
//   incomplete: string;
// }

// // overall report data structure
// interface ReportData {
//   headings: string[];
//   data: ExperimentData[] | QuizData[] | CourseData[];
// }

const DashboardReportsPage = () => {
  const { user } = useUser();
  const firstName = user?.fullName?.split(" ")[0];
  
  // Filter options
  const filters = ["Experiments", "Quizzes", "STEM Courses"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  // Table configurations
  const tableConfig = {
    "Experiments": {
      headings: ["Index", "Title", "Total Number", "Attempted", "Completed"],
      data: [
        { index: "1", title: "Biology Lab", totalnumber: "5", attempted: "3", completed: "2" },
        { index: "2", title: "Chemistry Lab", totalnumber: "4", attempted: "4", completed: "3" },
      ]
    },
    "Quizzes": {
      headings: ["Index", "Total Number", "Average Score", "Highest Score"],
      data: [
        { index: "1", totalnumber: "10", averagescore: "85%", highestscore: "95%" },
        { index: "2", totalnumber: "8", averagescore: "78%", highestscore: "92%" },
      ]
    },
    "STEM Courses": {
      headings: ["Index", "Title", "Hours Spent", "Completed", "Incomplete"],
      data: [
        { index: "1", title: "Biology", hoursspent: "40", completed: "80%", incomplete: "20%" },
        { index: "2", title: "Chemistry", hoursspent: "35", completed: "90%", incomplete: "10%" },
      ]
    }
  };

  // Get current table data based on active filter
  const getCurrentTableData = () => {
    return tableConfig[activeFilter as keyof typeof tableConfig];
  };

  const currentData = getCurrentTableData();

  return (
    <div className="p-4 space-y-4">
      <WelcomeBanner firstName={firstName || ""} />
      
      <div>
        <h2 className="font-bold text-lg mb-2">Attempt Reports</h2>
        
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

export default DashboardReportsPage;