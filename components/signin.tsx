"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { getGoogleOAuthURL } from "@/lib/google";
import { useEffect } from "react";

export function SignInWithGoogle() {
  const router = useRouter();
  const googeOAuthUrl = getGoogleOAuthURL();

  useEffect(() => {
    if (localStorage.getItem("gdrive-chat")) {
      router.push("/");
    }
  }, []);

  return (
    <Button
      type="button"
      className="mt-5"
      onClick={async () => router.push(googeOAuthUrl)}
    >
      Sign in using Google
    </Button>
  );
}
