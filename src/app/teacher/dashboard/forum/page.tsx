import { FaDotCircle } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { MdSearch } from "react-icons/md";

const TeachersForumsPage = () => {
  return (
    <div>
      <div className="flex flex-col border-b border-gray-300 items-center justify-center p-2 gap-2">
        <p className="font-semibold lg:text-lg">Teacher Community</p>
        <p className="text-sm text-gray-500">
          A space where teachers learn from teachers
        </p>
        <div className="bg-white rounded-md flex items-center gap-3 pl-2 md:w-[28rem]">
          <MdSearch className="text-gray-400 text-lg" />
          <input
            type="search"
            className="p-2 text-sm md:w-96"
            placeholder="Search discussions, resources or tips"
          />
        </div>
      </div>
      <div className="flex">
        <div className="flex p-4 border-r border-gray-400">
          <div className="w-60 h-max rounded-md bg-white flex flex-col gap-2 p-2">
            <p className="text-[#3749A6] font-semibold">Quick Stats</p>
            <div className="text-sm flex justify-between">
              <p className="font-semibold">Active Teachers</p>
              <p>1,246</p>
            </div>

            <div className="text-sm flex justify-between">
              <p className="font-semibold">Discussions</p>
              <p>2,320</p>
            </div>

            <div className="text-sm flex justify-between">
              <p className="font-semibold">Resources shared</p>
              <p>3,150</p>
            </div>
          </div>
        </div>

        
        <div className="w-full flex flex-col h-screen overflow-scroll p-4 gap-4">
            {/* What's on your mind */}
          <form action="" className="flex flex-col gap-3 w-full p-2 bg-white rounded-md">
             {/* dp and name section */}
            <div className="flex gap-1">
              <div className="rounded-full bg-gray-400 h-10 w-10"></div>
            </div>
            <div className="flex flex-col gap-1">
                <textarea name="post" id="post" placeholder="What do you want to talk about?"></textarea>
                <div className="flex justify-between">
                    <div>attachments</div>
                    <button className="bg-slate-200 rounded-full text-slate-600 p-1.5 px-3 text-xs">post</button>
                </div>
            </div>
          </form>

         {/* Other people's Post */}
          <div className="flex flex-col gap-3 w-full p-2 bg-white rounded-md">

             {/* dp and name section */}
            <div className="flex gap-1">
              <div className="rounded-full bg-gray-400 h-10 w-10"></div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Name Surname</p>
                <div className="text-xs flex gap-1 items-center">
                  <p>7th Grade math</p>{" "}
                  <p className="flex items-center">
                    <GoDotFill /> 2 hours ago
                  </p>
                </div>
              </div>
            </div>

            {/* Topic and desc */}
            <div className="flex flex-col gap-1 text-slate-700">
              <p className="font-semibold">
                How do you keep your students engaged during virtual lessons?
              </p>
              <p className="text-xs">
                Just discovered some fantastic online tools and printables that
                make fraction concepts click for students...
              </p>
            </div>

            {/* tags & reactions */}
            <div className="flex justify-between items-center">
              <div>
                <p className="rounded-full bg-gray-200 text-gray-600 text-xs p-2">
                  Class management
                </p>
              </div>
              <div>Likes section</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-4 gap-4 border-l border-gray-400">
          <div className="w-60 h-64 rounded-md bg-white flex flex-col gap-2 p-2">
            <p className="text-[#3749A6] font-semibold">Trending Topics</p>
            <div className="text-sm">
              <p className="font-semibold">Best Free Math Resources</p>
              <p>{"(149 discussions this week)"}</p>
            </div>

            <div className="text-sm">
              <p className="font-semibold">Best Free Math Resources</p>
              <p>{"(149 discussions this week)"}</p>
            </div>

            <div className="text-sm">
              <p className="font-semibold">Best Free Math Resources</p>
              <p>{"(149 discussions this week)"}</p>
            </div>
          </div>

          <div className="w-60 h-64 rounded-md bg-white flex flex-col gap-2 p-2">
            <p className=" font-semibold">Categories</p>
            <div className="text-sm flex justify-between text-gray-600">
              <p className="text-gray-600">Classroom Management</p>
              <p>{"49 Post(s)"}</p>
            </div>

            <div className="text-sm flex justify-between text-gray-600">
              <p className="text-gray-600">Lesson Planning</p>
              <p>{"49 Post(s)"}</p>
            </div>

            <div className="text-sm flex justify-between text-gray-600">
              <p className="text-gray-600">Technology</p>
              <p>{"49 Post(s)"}</p>
            </div>

            <div className="text-sm flex justify-between text-gray-600">
              <p className="text-gray-600">Assessment</p>
              <p>{"49 Post(s)"}</p>
            </div>

            <div className="text-sm flex justify-between text-gray-600">
              <p className="text-gray-600">Development</p>
              <p>{"49 Post(s)"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachersForumsPage;
