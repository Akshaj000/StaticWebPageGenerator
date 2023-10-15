import React, { useCallback } from "react";
import { IoLogoGoogle } from "react-icons/io";
import clsx from "clsx";

const GoogleOAuthButton = () => {
  const handleGoogleOAuth2 = useCallback(() => {
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const scope = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" ");

    const params = {
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID,
      redirect_uri: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/google/`,
      prompt: "select_account",
      access_type: "offline",
      scope,
      state: `${window?.location?.origin}`,
    };

    // @ts-ignore
    const urlParams = new URLSearchParams(params).toString();
    window.location.href = `${googleAuthUrl}?${urlParams}`;
  }, []);

  return (
    <button
      onClick={handleGoogleOAuth2}
      className={clsx(
        "flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-base",
        "font-medium rounded-md text-white bg-neutral-800 hover:bg-neutral-700 w-full"
      )}
    >
      <IoLogoGoogle className="text-2xl" />
      <span>Login with Google</span>
    </button>
  );
};

export default GoogleOAuthButton;
