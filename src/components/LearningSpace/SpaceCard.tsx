// import { getLearningSpaceById } from "@/services/learningSpaceService";
// import { useUser } from "@/services/UserContext";
// import React, { useEffect, useState } from "react";
// import { IoMdCalendar } from "react-icons/io";
// import { LuClock3 } from "react-icons/lu";

import { getLearningSpaceById } from "@/services/learningSpaceService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import { IoMdCalendar } from "react-icons/io";
import { LuClock3 } from "react-icons/lu";

type SpaceData = {
    id: string;
  title: string;
  url: string;
  description: string;
};

// const SpaceCard = ({ lesson }: { lesson: SpaceData }) => {
//     const {token} = useUser();
//     const [loading, setLoading] = useState(false)
//     const [spaceData, setSpaceData] = useState<SpaceData>()

// useEffect(() => {
//     async function fetchSpaceById() {
//       setLoading(true);
//       try {
//         const data = await getLearningSpaceById(lesson.id, token);
//         setSpaceData(data.items || []);
//       } catch (err) {
//         console.error("Error fetching space:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchSpaceById();
//   }, [token]);

//   const handleClick = () => {
   
//   };

//   function truncateDesc(str: string) {
//   const words = str.split(/\s+/);
//   // Slice the first 16 words and join them back into a string
//   const wordStr = words.slice(0, 20).join(' ');
//   return wordStr + "..."
// }
//   return (
//     <div className="flex flex-col gap-2 rounded overflow-hidden w-80 bg-white">
//       <div className="flex items-center justify-center w-full bg-gray-400 text-white rounded-sm">
//         <img src="\images\pictures\lab-img.jpg" alt="lab-image" />
//       </div>
//       <div className="flex flex-col gap-2 px-2">
//         <p className="text-xs md:text-sm font-semibold">{lesson.title}</p>
//         <p className="text-xs">
//               {lesson.description.length < 20 ? lesson.description : truncateDesc(lesson.description)}
//             </p>
//         {/* <p className="text-xs">{lab.description}</p> */}
//         <div className="flex justify-between">
//           <div className="flex flex-col gap-1">
//             <p className="text-xs text-gray-600 flex items-center gap-1">
//               {" "}
//               <LuClock3 className="text-blue-600" /> {"90 Mins"}
//             </p>
//             <p className="text-xs text-gray-600 flex items-center gap-1">
//               {" "}
//               <IoMdCalendar className="text-blue-600" />
//             </p>
//           </div>
//           <p className="text-xs md:text-sm flex items-center gap-2">
//             {" "}
//             {/* <FaQuestionCircle className="text-blue-600" /> Unattempt */}
//           </p>
//         </div>
//         <button
//           className="bg-bgBlue text-white w-full p-2 rounded-md text-sm"
//           onClick={handleClick}
//         >
//           Go to space
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SpaceCard;


type SpaceCardProps = {
  lesson: SpaceData;
  onOpenSpace?: (spaceId: string) => void; // optional prop
};

const SpaceCard = ({ lesson, onOpenSpace }: SpaceCardProps) => {
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const [spaceData, setSpaceData] = useState<SpaceData>();

  useEffect(() => {
    async function fetchSpaceById() {
      setLoading(true);
      try {
        const data = await getLearningSpaceById(lesson.id, token);
        setSpaceData(data.items || []);
      } catch (err) {
        console.error("Error fetching space:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSpaceById();
  }, [token, lesson.id]);

  const handleClick = () => {
    if (onOpenSpace) {
      onOpenSpace(lesson.id); // call the parent’s popup function
    }
  };

  function truncateDesc(str: string) {
    const words = str.split(/\s+/);
    const wordStr = words.slice(0, 20).join(" ");
    return wordStr + "...";
  }

  return (
    <div className="flex flex-col gap-2 rounded overflow-hidden w-80 bg-white">
      <div className="flex items-center justify-center w-full bg-gray-400 text-white rounded-sm">
        <img src="\images\pictures\lab-img.jpg" alt="lab-image" />
      </div>
      <div className="flex flex-col gap-2 px-2">
        <p className="text-xs md:text-sm font-semibold">{lesson.title}</p>
        <p className="text-xs">
          {lesson.description.length < 20
            ? lesson.description
            : truncateDesc(lesson.description)}
        </p>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <LuClock3 className="text-blue-600" /> 90 Mins
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <IoMdCalendar className="text-blue-600" />
            </p>
          </div>
        </div>
        <button
          className="bg-bgBlue text-white w-full p-2 rounded-md text-sm"
          onClick={handleClick}
        >
          Go to space
        </button>
      </div>
    </div>
  );
};

export default SpaceCard;
