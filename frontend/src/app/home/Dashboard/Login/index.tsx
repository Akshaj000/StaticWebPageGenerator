import React from "react";
import GoogleOAuthButton from "@/app/home/Dashboard/Login/GoogleOAuthButton";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID || "";

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-neutral-950 bg-opacity-50 z-50 p-3 md-p-0">
      <div className="bg-neutral-900 max-w-md w-full px-4 py-6 sm:px-6 lg:px-8 rounded-md shadow-md flex flex-col justify-center items-center relative">
        <div className="">
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleOAuthButton />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default Login;
