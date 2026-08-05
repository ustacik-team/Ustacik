"use client";

import type { ComponentProps } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface UserAvatarProps extends ComponentProps<typeof Avatar> {
  user: {
    email: string;
    name?: string | null;
    image?: string | null;
  };
}

export function UserAvatar({
  user,
  className,
  ...props
}: UserAvatarProps) {
  const displayName = user.name ?? user.email;

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <Avatar className={cn(className)} {...props}>
      <AvatarImage
        src={user.image ?? undefined}
        alt={displayName}
        className="aspect-square object-cover"
      />
      <AvatarFallback className="border">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}