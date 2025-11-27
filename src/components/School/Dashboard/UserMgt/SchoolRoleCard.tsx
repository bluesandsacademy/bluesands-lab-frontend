interface SchoolRoleCardProps {
  title: string;
  description: string;
  access: string[];
  color: string;
}

const SchoolRoleCard = ({
  title,
  description,
  access,
  color,
}: SchoolRoleCardProps) => {
  return (
    <div className=" flex flex-col w-[30rem] bg-white rounded-md gap-2 p-2">
      <p className="font-semibold">{title}</p>
      <p className="text-sm">{description}</p>
      <div className="flex flex-wrap gap-3">
        {access.map((access, index) => (
          <p
            key={index}
            className={`flex items-center justify-center p-2.5 rounded-full bg-${color}-200 text-${color}-600 text-xs`}
          >
            {access}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SchoolRoleCard;
