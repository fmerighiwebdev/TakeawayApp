"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "../loader/loader";

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");

    if (!authToken) {
      router.push("/admin");
      return;
    }

    async function validateToken() {
      try {
        await axios.post("/api/validate-token", { token: authToken });
        setLoading(false);
      } catch (error) {
        localStorage.removeItem("auth-token");
        router.push("/admin");
        setLoading(false);
      }
    }

    validateToken();
  }, [router]);

  return loading ? <Loader fullscreen /> : children;
}