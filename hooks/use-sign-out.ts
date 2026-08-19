// lib/use-sign-out.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; 
import { authClient } from "@/lib/auth-client";

export function useSignOut() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
    setIsLoading(true);
    
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/");
          },
          onError: (error) => {
            console.error("Logout failed:", error);
            toast.error("Failed to log out, try again.");
            setIsLoading(false); // Reset loading on error
          },
        },
      });
      
    } catch (error) {
      // This catches network errors or other exceptions
      console.error("Logout failed:", error);
      toast.error("Failed to log out, try again.");
      setIsLoading(false); // Reset loading on error
    }
  };

  return { signOut, isLoading };
}