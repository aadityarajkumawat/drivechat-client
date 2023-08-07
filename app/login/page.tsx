import { SignInWithGoogle } from "@/components/signin";

export default function Home() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <form className="text-center">
        <h1 className="text-xl">Welcome to Llama Drive</h1>
        <p className="text-muted-foreground">
          Connect the google account you want to allow reading files from.
        </p>

        <SignInWithGoogle />

        <p className="mt-3 text-muted-foreground">
          New to Llama drive?{" "}
          <a href="/signup" className="text-primary underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
