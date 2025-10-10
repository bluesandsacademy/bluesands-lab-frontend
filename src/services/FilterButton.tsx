import { useUser } from "./UserContext";

interface FilterButtonProps {
  filters: string[];
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

const FilterButton = ({ filters, onFilterChange, activeFilter }: FilterButtonProps) => {
  const {user} = useUser();

  return (
    <div className="flex flex-wrap gap-2 lg:gap-4 mx-auto lg:mx-0 bg-white rounded-md mt-4 p-3">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`p-1 lg:p-2 px-4 lg:px-6 text-xs lg:text-sm rounded-md transition-colors ${
            activeFilter === filter && (user?.role === "student" || user?.role === "Student")
              ? "bg-bgBlue text-white" : activeFilter === filter && (user?.role === "schoolAdmin" || user?.role === "SchoolAdmin") 
              ? "bg-blue-950 text-white"
              : `bg-blue-50 ${user?.role === "schoolAdmin" || user?.role === "SchoolAdmin" ? "text-blue-950": "text-blue-600"} hover:bg-blue-100`
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterButton;