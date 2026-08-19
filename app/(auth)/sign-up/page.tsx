import type { Metadata } from "next";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

export default function SignUp() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 bg-(image:--page-bg) bg-cover bg-center bg-fixed">
      <SignUpForm />
    </main>
  );
}
