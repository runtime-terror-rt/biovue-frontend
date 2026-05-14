"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import ReduxProvider from "../redux/provider";
import { Toaster } from "sonner";
import React from "react";
import AutoLogout from "./AutoLogout";


export default function Providers({ children }: { children: React.ReactNode }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const useEnterprise =
    process.env.NEXT_PUBLIC_RECAPTCHA_USE_ENTERPRISE === "true";
  const useRecaptchaNet =
    process.env.NEXT_PUBLIC_RECAPTCHA_USE_RECAPTCHA_NET === "true";

  React.useEffect(() => {
    if (!recaptchaKey) {
      console.error("reCAPTCHA Error: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing from environment variables.");
    }
  }, [recaptchaKey]);

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey || ""}
      useEnterprise={useEnterprise}
      useRecaptchaNet={useRecaptchaNet}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      <ReduxProvider>
        {children}
        <AutoLogout />
        <Toaster position="top-right" richColors />
      </ReduxProvider>

    </GoogleReCaptchaProvider>
  );
}
