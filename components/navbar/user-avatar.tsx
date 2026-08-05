"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar() {
  // TODO: Fetch user image and name from database/auth session
  return (
    <Avatar className="h-9 w-9">
      <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
}