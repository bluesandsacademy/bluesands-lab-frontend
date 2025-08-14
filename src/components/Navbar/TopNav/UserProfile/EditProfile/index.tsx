import { useState } from "react"
import Image from "next/image";


const EditProfile = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("")
   

  return (
    <div className="m-5 flex flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-3 lg:p-12 rounded-md">
        <div className="flex flex-col gap-4 mx-auto md:w-40">
            <Image src={"/images/avatar/user01.png"} alt="profile-avatar" className="w-20 md:w-24 lg:w-40 mx-auto rounded-full" width={160} height={160}/>
            <p className="text-bgBlue text-sm lg:text-base mx-auto">Change profile photo</p>
        </div>
        <form action="submit" className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
            <label
              htmlFor="firstName"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              First Name
            </label>
            <input
              type="text"
              className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-600 text-sm md:text-base"
              value={firstName}
              id="firstName"
              onChange={(e) => setFirstName(e.target.value)}
            />
            </div>

            <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
            <label
              htmlFor="lastName"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Last Name
            </label>
            <input
              type="text"
              className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-600 text-sm md:text-base"
              value={lastName}
              required
              id="lastName"
              onChange={(e) => setLastName(e.target.value)}
            />
            </div>

            <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
            <label
              htmlFor="email"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Email Address
            </label>
            <input
              type="text"
              className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-600 text-sm md:text-base"
              value={email}
              required
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>

             <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
            <label
              htmlFor="phone"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Phone Number
            </label>
            <input
              type="text"
              className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-600 text-sm md:text-base"
              value={phone}
              required
              id="phone"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
            
            <div className="flex gap-2 lg:gap-4 mx-auto lg:mx-0">
                <button className="bg-bgBlue p-1 lg:p-2 text-white rounded-md text-xs lg:text-sm">Save Changes</button>
                <button className="bg-[#f5f6fa]  p-1 lg:p-2 px-4 lg:px-6 text-bgBlue text-xs lg:text-sm rounded-md">Cancel</button>
            </div>
        </form>
    </div>
  )
}

export default EditProfile