import SchoolRoleCard from "./SchoolRoleCard";

const SchoolRolesContainer = () => {
  const fetchedRoles = [
    {
      title: "Administrator",
      description: "Full system access and management capabilities",
      access: ["User Management", "System Settings", "Analytics"],
      color: "red",
    },
    {
      title: "Teacher",
      description: "Course and student management within assigned classes",
      access: ["Course Management", "Grade Students", "Grade Students"],
      color: "blue",
    },
    {
      title: "Student",
      description: "Access to enrolled course and personal data",
      access: ["View Courses", "Submit Assignments", "View Grades"],
      color: "green",
    },
  ];
  return (
    <div className=" flex flex-wrap gap-4">
      {fetchedRoles.map((role, index) => (
        <SchoolRoleCard
          key={index}
          title={role.title}
          description={role.description}
          access={role.access}
          color={role.color}
        />
      ))}
    </div>
  );
};

export default SchoolRolesContainer;
