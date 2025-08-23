// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import NProgress from "nprogress";
// import { countries, workPositions } from "@/lib/data";
// import { useRouter } from "next/navigation";
// import { registerNewSchool, SchoolObject } from "@/services/auth-service";
// import { toast } from "react-toastify";

// export default function RegisterSchoolAccount() {
//   useEffect(() => {
//     document.title =
//       "Create your Account | Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences";
//   }, []);

//   const [fullName, setFullName] = useState("");
//   const [schoolName, setSchoolName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhoneNumber] = useState("");
//   const [position, setPosition] = useState("");
//   const [totalStudents, setTotalStudents] = useState("");
//   const [country, setCountry] = useState("");
//   const [password, setPassword] = useState("");
//   const [couponCode, setCouponCode] = useState("");
//   const [domain, setDomain] = useState("");
//   const [rememberPassword, setRememberPassword] = useState<boolean>(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   const payload: SchoolObject = {
//     fullName,
//     schoolName,
//     email,
//     phone,
//     position,
//     totalStudents,
//     country,
//     password,
//     domain,
//     couponCode,
//   };

//   function handleRememberPassword() {
//     setRememberPassword(!rememberPassword);
//   }

//   const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault(); // Prevent default form submission

//     if (isSubmitting) return; // Prevent multiple submissions
//     setIsSubmitting(true); // Set submitting state to true
//     NProgress.start(); // Start the loading bar

//     try {
//       await registerNewSchool(payload);
//       toast.success("User created successfully.");
//       router.push("/auth/login");
//     } catch (err: any) {
//       if (err.response?.status === 409) {
//         toast.warning("User already exists. Try logging in instead.");
//       } else {
//         toast.error(
//           "Registration failed. Please check your details and try again."
//         );
//       }
//       console.error("Registration failed", err);
//     } finally {
//       NProgress.done();
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <section className="min-h-screen p-3 mb-10">
//         <div className="w-full flex justify-center relative z-0">
//           <img
//             src="/images/bg/cover.png"
//             className="w-full object-contain z-0"
//             alt=""
//           />
//           <div className="absolute flex flex-col items-center justify-center  top-1 md:top-0 text-center text-white max-w-lg md:bottom-28 lg:bottom-36 bottom-5 space-y-1 lg:space-y-3">
//             <h1 className="text-xl md:text-2xl lg:text-4xl font-normal">
//               Create your Account
//             </h1>
//             <p className="font-thin text-xs md:text-sm lg:text-lg md:max-w-lg max-w-xs">
//               Transforming Education Through Innovation with Cutting-Edge STEM
//               Learning Experiences
//             </p>
//           </div>
//         </div>
//         <form
//           className="border max-w-2xl mx-auto flex flex-col gap-y-5 py-5 px-3 md:px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white"
//           onSubmit={handleRegister}
//         >
//           <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
//             <label
//               htmlFor="fullName"
//               className="font-medium text-gray-700 text-sm md:text-md"
//             >
//               Full Name
//             </label>
//             <input
//               type="text"
//               className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
//               id="fullName"
//               value={fullName}
//               required
//               onChange={(e) => setFullName(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
//             <label
//               htmlFor="schoolName"
//               className="font-medium text-gray-700 text-sm md:text-md"
//             >
//               School Name
//             </label>
//             <input
//               type="text"
//               className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
//               id="schoolName"
//               value={schoolName}
//               required
//               onChange={(e) => setSchoolName(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
//             <label
//               htmlFor="emailAddress"
//               className="font-medium text-gray-700 text-sm md:text-md"
//             >
//               School Email Address
//             </label>
//             <input
//               type="text"
//               className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
//               id="emailAddress"
//               value={email}
//               required
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
//             <label
//               htmlFor="phoneNumber"
//               className="font-medium text-gray-700 text-sm md:text-md"
//             >
//               Phone Number
//             </label>
//             <input
//               type="text"
//               className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
//               id="phoneNumber"
//               value={phone}
//               required
//               onChange={(e) => setPhoneNumber(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
//             <label
//               htmlFor="position"
//               className="font-medium text-gray-700 text-sm md:text-md"
//             >
//               Position
//             </label>
//             <select
//               className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
//               id="position"
//               value={position}
//               required
//               onChange={(e) => setPosition(e.target.value)}
//             >
//               {workPositions.map((option, index) => (
//                 <option value={option} key={index}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
//             <label
//               htmlFor="totalNoOfStudents"
//               className="font-medium text-gray-700 text-sm md:text-md"
//             >
//               Total Number of Students
//             </label>
//             <input
//               type="number"
//               placeholder="Number of Students"
//               className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
//               id="totalNoOfStudents"
//               min={0}
//               value={totalStudents}
//               required
//               onChange={(e) => setTotalStudents(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
//             <label
//               htmlFor="country"
//               className="font-medium text-gray-700 text-sm md:text-md"
//             >
//               Country
//             </label>
//             <select
//               className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
//               id="country"
//               value={country}
//               required
//               onChange={(e) => setCountry(e.target.value)}
//             >
//               {countries.map((option, index) => (
//                 <option value={option} key={index}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
//             <label
//               htmlFor="password"
//               className="font-medium text-gray-700 text-sm md:text-md"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base lg:text-lg"
//               id="password"
//               value={password}
//               required
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
//             <label
//               htmlFor="couponCode"
//               className="font-medium text-gray-700 text-sm md:text-md"
//             >
//               Domain
//             </label>
//             <input
//               type="text"
//               className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
//               id="couponCode"
//               value={domain}
//               onChange={(e) => setDomain(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
//             <label
//               htmlFor="couponCode"
//               className="font-medium text-gray-700 text-sm md:text-md"
//             >
//               Coupon Code
//             </label>
//             <input
//               type="text"
//               className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
//               id="couponCode"
//               value={couponCode}
//               onChange={(e) => setCouponCode(e.target.value)}
//             />
//           </div>
//           <div className="w-full flex gap-x-3 items-center">
//             <input
//               type="checkbox"
//               className="w-4 h-4 md:w-5 md:h-5"
//               id="rememberPassword"
//             />
//             <label
//               htmlFor="rememberPassword"
//               className="font-medium text-gray-700 text-sm md:text-md"
//             >
//               Remember Password
//             </label>
//           </div>
//           <div className="w-full flex flex-col gap-y-1 md:gap-y-3">
//             <button
//               type="submit"
//               className={`text-center text-sm md:text-base rounded-md py-2 md:py-3 lg:py-5 bg-bgBlue text-white w-full lg:text-lg`}
//             >
//               Sign Up
//             </button>
//             <p className="text-gray-500 text-center text-sm md:text-base">
//               Already have an account?{" "}
//               <Link
//                 href="/auth/login"
//                 className="text-blue-500 underline font-normal"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </form>
//       </section>
//     </>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import NProgress from "nprogress";
import { countries, workPositions } from "@/lib/data";
import { useRouter } from "next/navigation";
import { registerNewSchool, SchoolObject } from "@/services/auth-service";
import { toast } from "react-toastify";

export default function RegisterSchoolAccount() {
  useEffect(() => {
    document.title =
      "Create your Account | Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences";
  }, []);

  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [position, setPosition] = useState("");
  const [totalStudents, setTotalStudents] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [subdomainInput, setSubdomainInput] = useState(""); // User input for domain
  const [subdomain, setSubdomain] = useState(""); // Full domain with suffix
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const DOMAIN_SUFFIX = ".bluesandstemlabs.com";
  const MAX_DOMAIN_LENGTH = 20; // Maximum length for the domain prefix

  const payload: SchoolObject = {
    fullName,
    schoolName,
    email,
    phone,
    position,
    totalStudents,
    country,
    password,
    subdomain,
    couponCode,
  };

  function handleRememberPassword() {
    setRememberPassword(!rememberPassword);
  }

  // Handle domain input changes
  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove whitespace
    value = value.replace(/\s/g, "");
    
    // Convert to lowercase for consistency
    value = value.toLowerCase();
    
    // Limit length
    if (value.length <= MAX_DOMAIN_LENGTH) {
      setSubdomainInput(value);
      
      // Update the full domain
      if (value.trim()) {
        setSubdomain(value + DOMAIN_SUFFIX);
      } else {
        setSubdomain("");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Set submitting state to true
    NProgress.start(); // Start the loading bar

    try {
      await registerNewSchool(payload);
      toast.success("User created successfully.");
      router.push("/auth/login");
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.warning("User already exists. Try logging in instead.");
      } else {
        toast.error(
          "Registration failed. Please check your details and try again."
        );
      }
      console.error("Registration failed", err);
    } finally {
      NProgress.done();
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="min-h-screen p-3 mb-10">
        <div className="w-full flex justify-center relative z-0">
          <img
            src="/images/bg/cover.png"
            className="w-full object-contain z-0"
            alt=""
          />
          <div className="absolute flex flex-col items-center justify-center  top-1 md:top-0 text-center text-white max-w-lg md:bottom-28 lg:bottom-36 bottom-5 space-y-1 lg:space-y-3">
            <h1 className="text-xl md:text-2xl lg:text-4xl font-normal">
              Create your Account
            </h1>
            <p className="font-thin text-xs md:text-sm lg:text-lg md:max-w-lg max-w-xs">
              Transforming Education Through Innovation with Cutting-Edge STEM
              Learning Experiences
            </p>
          </div>
        </div>
        <form
          className="border max-w-2xl mx-auto flex flex-col gap-y-5 py-5 px-3 md:px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white"
          onSubmit={handleRegister}
        >
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="fullName"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Full Name
            </label>
            <input
              type="text"
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="fullName"
              value={fullName}
              required
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="schoolName"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              School Name
            </label>
            <input
              type="text"
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="schoolName"
              value={schoolName}
              required
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="emailAddress"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              School Email Address
            </label>
            <input
              type="text"
              className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="emailAddress"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="phoneNumber"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Phone Number
            </label>
            <input
              type="text"
              className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="phoneNumber"
              value={phone}
              required
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="position"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Position
            </label>
            <select
              className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="position"
              value={position}
              required
              onChange={(e) => setPosition(e.target.value)}
            >
              {workPositions.map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="totalNoOfStudents"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Total Number of Students
            </label>
            <input
              type="number"
              placeholder="Number of Students"
              className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="totalNoOfStudents"
              min={0}
              value={totalStudents}
              required
              onChange={(e) => setTotalStudents(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="country"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Country
            </label>
            <select
              className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="password"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Password
            </label>
            <input
              type="password"
              className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base lg:text-lg"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="subdomain"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Subdomain
            </label>
            <div className="relative">
              <input
                type="text"
                className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base pr-40"
                id="subdomain"
                value={subdomainInput}
                placeholder="Enter subdomain"
                onChange={handleSubdomainChange}
                maxLength={MAX_DOMAIN_LENGTH}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm md:text-base">
                {DOMAIN_SUFFIX}
              </span>
            </div>
            {subdomain && (
              <p className="text-sm text-gray-600 mt-1">
                Your domain will be: <span className="font-medium text-blue-600">{subdomain}</span>
              </p>
            )}
            <p className="text-xs text-gray-500">
              Maximum {MAX_DOMAIN_LENGTH} characters. Only letters, numbers, and hyphens allowed.
            </p>
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="couponCode"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Coupon Code
            </label>
            <input
              type="text"
              className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="couponCode"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>
          <div className="w-full flex gap-x-3 items-center">
            <input
              type="checkbox"
              className="w-4 h-4 md:w-5 md:h-5"
              id="rememberPassword"
            />
            <label
              htmlFor="rememberPassword"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Remember Password
            </label>
          </div>
          <div className="w-full flex flex-col gap-y-1 md:gap-y-3">
            <button
              type="submit"
              className={`text-center text-sm md:text-base rounded-md py-2 md:py-3 lg:py-5 bg-bgBlue text-white w-full lg:text-lg`}
            >
              Sign Up
            </button>
            <p className="text-gray-500 text-center text-sm md:text-base">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-500 underline font-normal"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </section>
    </>
  );
}