"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CompleteAuth() {
  const query = useSearchParams();
  const router = useRouter();

  const token = query.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("gdrive-chat", token);
      router.push("/");
    }
  }, [token]);

  return <div></div>;
}
