"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AiApi = createApi({
  reducerPath: "AiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ai.biovuedigitalwellness.com/api/v1",
    prepareHeaders: (headers, { getState }: any) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["FindMatch"],
  endpoints: () => ({}),
});
