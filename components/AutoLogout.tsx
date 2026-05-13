"use client";

import { useEffect, useRef, useCallback } from "react";

export default function AutoLogout() {
  const INACTIVITY_LIMIT = 5 * 60 * 1000;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }, []);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      logoutUser();
    }, INACTIVITY_LIMIT);
  }, [logoutUser]);

  useEffect(() => {
    const events = ["mousemove", "keypress", "click", "scroll"];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // start timer

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [resetTimer]);

  return null;
}