import { useUser } from "@/services/UserContext";
import React from "react";

const EditPreferences = () => {
  const {user} = useUser()
  return (
    <div className="m-3 flex flex-col gap-4 md:gap-6 bg-white p-2 lg:p-12 rounded-md">
      <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">
        Preferences
      </p>
      <div className="w-full flex flex-col gap-2">
        <p className="font-semibold text-sm">Prefered Language</p>
        <select
          name="language-select"
          id=""
          className="text-sm w-full bg-slate-100 p-2 rounded-md"
        >
          <option value="english">English</option>
          <option value="hausa">Hausa</option>
          <option value="igbo">Igbo</option>
          <option value="yoruba">Yoruba</option>
          <option value="pidgin">Pidgin</option>
        </select>
      </div>
      <div className="flex flex-row w-full justify-between items-center">
        <div>
          <p className="font-bold">Online Status</p>
          <p className="text-sm">Show your online status to others</p>
        </div>
        <div>
            <input type="checkbox" name="online-status" id="" />
        </div>
      </div>
    </div>
  );
};

export default EditPreferences;
