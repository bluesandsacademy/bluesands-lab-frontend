// import React, { useEffect } from 'react'

// const GoogleSignInPage = () => {
//  useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.onload = () => {
//       /* global google */
//       google.accounts.id.initialize({
//         client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//         callback: handleCredentialResponse
//       });
//       google.accounts.id.renderButton(
//         document.getElementById("googleSignInDiv"),
//         { theme: "outline", size: "large" }
//       );
//     };
//     document.body.appendChild(script);
//   }, []);

//   async function handleCredentialResponse(response) {
//     // response.credential is the id_token
//     const res = await fetch(${apiBase}/auth/google, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id_token: response.credential })
//     });
//     const json = await res.json();
//     if (json.ok) {
//       // store token (or rely on HttpOnly cookie returned by backend)
//       console.log("Signed in:", json.user);
//     } else {
//       console.error("Auth failed", json);
//     }
//   }

//   return <div id="googleSignInDiv"></div>;
// }

// export default GoogleSignInPage





// import { GoogleLogin } from '@react-oauth/google';

// export default function LoginPage() {
//   const handleSuccess = async (credentialResponse) => {
//     // Send this token to your backend
//     const { credential } = credentialResponse;
    
//     try {
//       const res = await fetch('YOUR_BACKEND_URL/api/auth/google', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ idToken: credential })
//       });
      
//       const data = await res.json();
//       // Store data.accessToken in localStorage or cookies
//       localStorage.setItem('token', data.accessToken);
      
//       // Redirect to dashboard
//     } catch (error) {
//       console.error('Login failed:', error);
//     }
//   };

//   return (
//     <GoogleLogin
//       onSuccess={handleSuccess}
//       onError={() => console.log('Login Failed')}
//     />
//   );
// }