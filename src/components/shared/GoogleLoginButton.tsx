"use client";

import { GoogleLogin } from "@react-oauth/google";
// import axios from "axios"

export default function GoogleLoginButton() {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const token = credentialResponse.credential;

        // const response = await axios.post(
        //   "https://your-api.com/auth/google",
        //   {
        //     token,
        //   }
        // );

        // console.log(response.data);
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}