// "use client";
// import React, { useState } from "react";

// const ChangePassword = () => {
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordMatch, setPasswordMatch] = useState(false);

//   const comparePasswords = () => {
//     if (newPassword === confirmPassword) {
//       setPasswordMatch(true);
//     }
//   };

//   return (
//     <div className="m-3 flex flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-12 rounded-md">
//       <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">
//         Security Settings
//       </p>
//       {/* <div className="flex flex-col gap-4 mx-auto md:w-40">
//             <Image src={"/images/avatar/user01.png"} alt="profile-avatar" className="w-20 md:w-24 lg:w-40 mx-auto rounded-full" width={160} height={160}/>
//             <p className="text-bgBlue text-sm lg:text-base mx-auto">Change profile photo</p>
//         </div> */}
//       <form action="submit" className="flex flex-col gap-8">
//         <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
//           <label
//             htmlFor="oldPassword"
//             className="font-medium text-gray-700 text-sm md:text-md"
//           >
//             Current Password
//           </label>
//           <input
//             type="text"
//             className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-600 text-sm md:text-base"
//             value={oldPassword}
//             id="oldPassword"
//             onChange={(e) => setOldPassword(e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
//           <label
//             htmlFor="newPassword"
//             className="font-medium text-gray-700 text-sm md:text-md"
//           >
//             New Password
//           </label>
//           <input
//             type="text"
//             className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-600 text-sm md:text-base"
//             value={newPassword}
//             required
//             id="email"
//             onChange={(e) => setNewPassword(e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
//           <label
//             htmlFor="confirmPassword"
//             className="font-medium text-gray-700 text-sm md:text-md"
//           >
//             confirmPassword
//           </label>
//           <input
//             type="text"
//             className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-600 text-sm md:text-base"
//             value={confirmPassword}
//             required
//             id="phone"
//             onChange={(e) => {
//               setConfirmPassword(e.target.value);
//               comparePasswords();
//             }}
//           />
//         </div>

//         <div className="flex gap-2 lg:gap-4 mx-auto w-full">
//           <button
//             className="bg-bgBlue w-full p-1 lg:p-2 text-white rounded-md text-xs lg:text-sm"
//             disabled={!passwordMatch}
//             onClick={() => alert("done")}
//           >
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChangePassword;


"use client";
import React, { useState, useEffect } from "react";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);

  useEffect(() => {
    setPasswordMatch(
      newPassword !== "" &&
      confirmPassword !== "" &&
      newPassword === confirmPassword
    );
  }, [newPassword, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password change submitted!");
  };

  return (
    <div className="m-3 flex flex-col gap-6 md:gap-8 lg:gap-12 bg-white p-4 lg:p-12 rounded-md shadow-sm">
      <h2 className="text-base md:text-lg lg:text-xl font-semibold text-bgBlue">
        Security Settings
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Current Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="oldPassword" className="text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="rounded-md border px-3 py-2 w-full text-gray-700 text-sm"
            required
          />
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="rounded-md border px-3 py-2 w-full text-gray-700 text-sm"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`rounded-md border px-3 py-2 w-full text-sm ${
              confirmPassword && !passwordMatch ? "border-red-500" : "border-gray-300"
            } text-gray-700`}
            required
            aria-invalid={!passwordMatch}
          />
          {confirmPassword && !passwordMatch && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!passwordMatch}
          className={`w-full p-2 rounded-md text-sm font-medium ${
            passwordMatch ? "bg-bgBlue text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
