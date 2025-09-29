"use client";
import StatCards from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import { courseStats } from "@/lib/data";
import { useUser } from "@/services/UserContext";
import Link from "next/link";
import { BiSolidEraser } from "react-icons/bi";
import { IoMdStar } from "react-icons/io";
import { LuNotebookPen } from "react-icons/lu";

const DashboardStemCoursesPage = () => {
  const { user } = useUser();
  const firstName = user?.fullName?.split(" ")[0];
  const description =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates suscipit molestiae quos hic quod maiores, nihil nemo similique expedita provident neque possimus ea corrupti deserunt, accusantium quo soluta illum amet facere? Corrupti sunt consequuntur facilis, ab fuga, culpa id, fugiat quis aut nulla ratione eius? Fuga numquam magni quidem unde.";
  const truncatedDesc = description.split(" ").slice(0, 15).join(" ") + "...";

  return (
    <div className="m-1">
      <WelcomeBanner firstName={firstName ? firstName : ""} />
      <StatCards stats={courseStats} />
      <div className="m-4 mt-6 lg:mt-12 flex flex-col md:flex-row flex-wrap gap-5">
        {/* <p className="text-sm lg:text-base font-semibold lg:ml-4">STEM Courses Coming Soon...</p> */}
        <div className="rounded-md overflow-hidden flex flex-col w-56 bg-white">
          <div className=" bg-blue-300 text-slate-700 py-16 w-full rounded-md flex items-center justify-center">
            {" "}
            Example Course
          </div>
          <div className="p-2 flex flex-col gap-3">
            <div className="flex justify-between text-xs items-center">
              <p className="p-0.5 px-1 bg-blue-200 rounded text-blue-600">
                Dummy Course
              </p>
              <strong className="text-blue-600">Price</strong>
            </div>
            <p className=" text-xs">
              {description.length < 16 ? description : truncatedDesc}
            </p>
            <div className="flex justify-between text-xs md:text-sm">
              <strong className="flex items-center">
                <IoMdStar className="text-bgBlue" />
                5.0
              </strong>
              <p>
                <strong>500k+ </strong>Students
              </p>
            </div>
            <div className="flex justify-between text-xs">
              <Link href="/dashboard/stem-courses/overview">
                <button className="p-1 px-3 rounded-md bg-bgBlue text-white flex gap-1">
                  <LuNotebookPen />
                  Enroll
                </button>
              </Link>

              <button className="p-1 px-3 rounded-md flex bg-blue-50 text-blue-600 hover:bg-blue-100 gap-1">
                <BiSolidEraser /> UnEnroll
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStemCoursesPage;
