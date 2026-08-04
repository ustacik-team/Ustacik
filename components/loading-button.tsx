import * as React from "react";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading: boolean;
}

export function LoadingButton({
  loading,
  disabled,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button aria-busy={loading} disabled={loading || disabled} {...props}>
      {loading ? (
        <>
          <Loader2 aria-hidden="true" className="animate-spin" />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
