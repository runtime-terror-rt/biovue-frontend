"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentToken } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function AutoLogout() {
  const INACTIVITY_LIMIT = 5 * 60 * 1000;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const router = useRouter();

  const logoutUser = useCallback(() => {
    if (token) {
      dispatch(logout());
      toast.error("Session expired due to inactivity. Please login again.", {
        id: "auto-logout-toast",
      });
      router.push("/login");
    }
  }, [dispatch, token, router]);


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