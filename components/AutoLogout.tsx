// "use client";

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

// export default function AutoLogout() {
//   const router = useRouter();
  
//   const INACTIVITY_LIMIT = 5 * 60 * 1000; 

//   useEffect(() => {
//     let timeout;

//     const logoutUser = async () => {
//       try {
//         await axios.post('/api/logout'); 
//       } catch (error) {
//         console.error("Logout failed", error);
//       }
      
//       localStorage.removeItem('token'); 
      
//       router.push('/login');
//       router.refresh();
//     };

//     const resetTimer = () => {
//       if (timeout) clearTimeout(timeout);
//       timeout = setTimeout(logoutUser, INACTIVITY_LIMIT);
//     };

//     window.addEventListener('mousemove', resetTimer);
//     window.addEventListener('keypress', resetTimer);
//     window.addEventListener('click', resetTimer);
//     window.addEventListener('scroll', resetTimer);

//     resetTimer();

//     return () => {
//       if (timeout) clearTimeout(timeout);
//       window.removeEventListener('mousemove', resetTimer);
//       window.removeEventListener('keypress', resetTimer);
//       window.removeEventListener('click', resetTimer);
//       window.removeEventListener('scroll', resetTimer);
//     };
//   }, [router]);

//   return null;
// }



"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AutoLogout() {
  const router = useRouter();
  
  const INACTIVITY_LIMIT = 5 * 60 * 1000; 

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const logoutUser = async () => {
      try {
        await axios.post('/api/logout'); 
      } catch (error) {
        console.error("Logout failed", error);
      }
      
      localStorage.removeItem('token'); 
      
      router.push('/login');
      router.refresh();
    };

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(logoutUser, INACTIVITY_LIMIT);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    resetTimer();

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [router]);

  return null;
}
