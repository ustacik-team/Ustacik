import Link from "next/link";
import { getServerSession } from "@/lib/get-session";

// ─── UI Components ──────────────────────────────────────────────────────
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustStats } from "@/components/landing/trust-stats";
import { Categories } from "@/components/landing/categories";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturedCraftsmen, FeaturedCraftsman } from "@/components/landing/featured-craftsmen";
import { TrustSection } from "@/components/landing/trust-section";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

// ─── Mock Data (Strictly typed!) ──────────────────────────────────────
const mockCraftsmen: FeaturedCraftsman[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    businessName: "Yılmaz Plumbing & Heating Solutions",
    image: null,
    verificationLevel: "APPROVED",
    rating: 4.9,
    reviewCount: 128,
    category: "Plumbing & Water Systems",
    subServices: ["Pipe Installation", "Water Heater Repair", "Drain Cleaning"], // ✅ Added
    region: "Nicosia",
    priceMin: 250,
    priceMax: 1500,
    jobsCompleted: 345,
  },
  {
    id: "2",
    name: "Mehmet Demir",
    businessName: "Demir Electrical Services Ltd.",
    image: "/craftsmen/mehmet.jpg",
    verificationLevel: "VERIFIED",
    rating: 4.8,
    reviewCount: 95,
    category: "Electrical",
    subServices: ["Wiring & Lighting", "Panel Upgrades", "Home Automation"], // ✅ Added
    region: "Kyrenia",
    priceMin: 300,
    priceMax: 2000,
    jobsCompleted: 210,
  },
  {
    id: "3",
    name: "Ayşe Kaya",
    businessName: "Kaya Creative Painting & Decor",
    image: null,
    verificationLevel: "REGISTERED",
    rating: 4.7,
    reviewCount: 42,
    category: "Painting & Plastering",
    subServices: ["Interior Painting", "Drywall & Plaster"], // ✅ Added
    region: "Famagusta",
    priceMin: 150,
    priceMax: 1200,
    jobsCompleted: 88,
  },
  {
    id: "4",
    name: "Mustafa Çelik",
    businessName: "Çelik Master Carpentry",
    image: "/craftsmen/mustafa.jpg",
    verificationLevel: "VERIFIED",
    rating: 4.9,
    reviewCount: 150,
    category: "Carpentry & Furniture",
    subServices: ["Custom Furniture", "Door Installation", "Flooring"], // ✅ Added
    region: "Larnaca",
    priceMin: 400,
    priceMax: 5000,
    jobsCompleted: 412,
  },
  {
    id: "5",
    name: "Fatma Şahin",
    businessName: "Şahin Cooling & HVAC Specialists",
    image: null,
    verificationLevel: "APPROVED",
    rating: 4.6,
    reviewCount: 77,
    category: "HVAC & Refrigeration",
    subServices: ["AC Installation", "AC Repair", "Ventilation"], // ✅ Added
    region: "Nicosia",
    priceMin: 350,
    priceMax: 2500,
    jobsCompleted: 195,
  },
];

// ─── Landing Page ──────────────────────────────────────────────────────
export default async function Home() {
  const session = await getServerSession();
  const user = session?.user || null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 1. Navbar */}
      <Navbar user={user} />

      {/* 2. Main Content */}
      <main className="flex-1">
        <Hero />
        <TrustStats />
        <Categories />
        <HowItWorks />
        {/* Data passed via props with full type safety */}
        <FeaturedCraftsmen craftsmen={mockCraftsmen} />
        <TrustSection />
        <Testimonials />
        <CtaSection />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}