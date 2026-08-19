import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { RequestHeader } from "@/components/request-job/request-header";
import { RequestJobContainer } from "@/components/request-job/request-job-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Request a Job",
  description: "Submit a direct job request to a verified local craftsman.",
  robots: { index: false, follow: false },
};

interface RequestJobPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestJobPage({ params }: RequestJobPageProps) {
  const { id } = await params;
  const session = await getServerSession();

  if (!session?.user) {
    redirect(`/sign-in?redirect=${encodeURIComponent(`/craftsmen/${id}/request`)}`);
  }

  // Fetch craftsman profile directly from Prisma using select
  const profile = await prisma.craftsmanProfile.findUnique({
    where: { id },
    select: {
      id: true,
      businessName: true,
      bio: true,
      verificationLevel: true,
      priceRangeMin: true,
      priceRangeMax: true,
      totalJobsCompleted: true,
      workmanshipGuarantee: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      region: {
        select: {
          id: true,
          name: true,
        },
      },
      categories: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      subServices: {
        select: {
          subService: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  // Handle craftsman role restriction
  if (session.user.role === "CRAFTSMAN") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar user={session.user} />
        <main className="flex-1 container mx-auto max-w-3xl px-4 py-12">
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader className="text-center">
              <AlertCircle className="size-10 text-amber-500 mx-auto mb-2" />
              <CardTitle>Craftsman Account Detected</CardTitle>
              <CardDescription>
                You are currently signed in as a Craftsman. Job requests are intended for customers seeking services.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4 pt-2">
              <Button variant="outline" asChild>
                <Link href={`/craftsmen/${profile.id}`}>
                  <ArrowLeft className="mr-2 size-4" /> Back to Craftsman Profile
                </Link>
              </Button>
              <Button asChild>
                <Link href="/craftsman/dashboard">Go to Craftsman Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Query all categories & sub-services to populate form dropdowns
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      subServices: {
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const formattedCraftsman = {
    id: profile.id,
    name: profile.user.name,
    businessName: profile.businessName,
    image: profile.user.image,
    bio: profile.bio,
    verificationLevel: profile.verificationLevel,
    region: profile.region.name,
    categories: profile.categories.map((c) => ({
      id: c.category.id,
      name: c.category.name,
    })),
    subServices: profile.subServices.map((s) => ({
      id: s.subService.id,
      name: s.subService.name,
    })),
    priceMin: profile.priceRangeMin ? Number(profile.priceRangeMin) : null,
    priceMax: profile.priceRangeMax ? Number(profile.priceRangeMax) : null,
    totalJobsCompleted: profile.totalJobsCompleted,
    workmanshipGuarantee: profile.workmanshipGuarantee,
  };

  const primaryCategory = formattedCraftsman.categories[0]?.name;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar user={session.user} />
      <main className="flex-1">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-12 space-y-8">
          <RequestHeader
            craftsmanId={profile.id}
            craftsmanName={profile.user.name}
            category={primaryCategory}
          />
          <RequestJobContainer craftsman={formattedCraftsman} categories={categories} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
