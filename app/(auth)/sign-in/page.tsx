import type { Metadata } from "next";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignIn() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 bg-(image:--page-bg) bg-cover bg-center bg-fixed">
      <SignInForm />
    </main>
  );
}
