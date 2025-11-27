"use client";

import { useAuth } from "@/hooks/UseAuth";



export default function AuthInitializer() {
  // This component just ensures useAuth is called in a client-safe way
  // The actual auth logic is handled in the useAuth hook
  useAuth();
  
  return null; // This component doesn't render anything
}




// "use client";

// import axios from "@/services/axios-instance";
// import { useUser } from "./UserContext";
// import { useEffect } from "react";

// // import { useAuth } from "@/hooks/UseAuth";
// // export default function AuthInitializer() {
// //   useAuth();
// //   return null;
// // }

// export default function AuthInitializer() {
//   const { setUser, setIsLoggedIn } = useUser();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("/auth/me", { withCredentials: true });
//         if (res.data?.user) {
//           setUser(res.data.user);
//           setIsLoggedIn(true);
//         }
//       } catch (err) {
//         console.log("Not authenticated or session expired");
//         setUser(null);
//         setIsLoggedIn(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return null;
// }
