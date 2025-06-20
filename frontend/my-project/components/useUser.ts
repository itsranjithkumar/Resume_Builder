// Simple React hook to get user info from localStorage (adjust if you use context or other storage)
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
export interface User {
  email: string;
  [key: string]: any;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Try to get user from localStorage (adjust key if needed)
    const token = localStorage.getItem("token");
    const data = jwtDecode(token!);
    console.log(data, "data");
    if (data) {
      try {
        setUser(data as User);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  return user;
}
