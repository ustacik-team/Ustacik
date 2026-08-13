import { getServerSession } from "@/lib/get-session";

export default async function CustomerSavedPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Saved Craftsmen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your saved craftsmen will appear here.
        </p>
      </div>
    </div>
  );
}
