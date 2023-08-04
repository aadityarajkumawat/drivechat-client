import { SignUpWithGoogle } from "@/components/signup";

export default function SignUp() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <form className="text-center">
        <h1 className="text-xl">Welcome to Drive Chat</h1>
        <p className="text-muted-foreground">
          Connect the google account you want to allow reading files from.
        </p>

        <SignUpWithGoogle />

        <p className="mt-3 text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
