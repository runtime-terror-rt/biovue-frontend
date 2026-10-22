declare module "react-google-recaptcha-v3" {
  import * as React from "react";

  export interface IGoogleReCaptchaConsumerProps {
    executeRecaptcha?: (action?: string) => Promise<string>;
    container?: string | HTMLElement;
  }

  export interface IGoogleReCaptchaProviderProps {
    reCaptchaKey: string;
    useEnterprise?: boolean;
    useRecaptchaNet?: boolean;
    scriptProps?: {
      nonce?: string;
      defer?: boolean;
      async?: boolean;
      appendTo?: "head" | "body";
      id?: string;
      onLoadCallbackName?: string;
    };
    language?: string;
    container?: {
      element?: string | HTMLElement;
      parameters?: Record<string, any>;
    };
    children?: React.ReactNode;
  }

  export interface IGoogleReCaptchaProps {
    action?: string;
    onVerify?: (token: string) => void | Promise<void>;
    refreshReCaptcha?: boolean | number | string;
  }

  export const GoogleReCaptchaProvider: React.FC<IGoogleReCaptchaProviderProps>;
  export const GoogleReCaptchaConsumer: React.Consumer<IGoogleReCaptchaConsumerProps>;
  export const GoogleReCaptchaContext: React.Context<IGoogleReCaptchaConsumerProps>;
  export const GoogleReCaptcha: React.FC<IGoogleReCaptchaProps>;

  export function useGoogleReCaptcha(): IGoogleReCaptchaConsumerProps;

  export function withGoogleReCaptcha<P extends { googleReCaptchaProps?: IGoogleReCaptchaConsumerProps }>(
    Component: React.ComponentType<P>
  ): React.ComponentType<Omit<P, "googleReCaptchaProps">>;
}
