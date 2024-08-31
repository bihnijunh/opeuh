"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  await signOut();
};

// Client-side logout function
export const clientLogout = async () => {
  // Clear any client-side state (e.g., localStorage, Redux store, etc.)
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
   
  }
  
  // Call the server-side logout action
  await logout();
  
  // Redirect to the home page or login page
  window.location.href = '/auth/login';
};
