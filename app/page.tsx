// app/page.tsx
import Link from "next/link";
import { Shield, CheckCircle, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { en: "Plumbing & Water Systems", tr: "Su Tesisatı" },
  { en: "Electrical", tr: "Elektrik" },
  { en: "HVAC & Refrigeration", tr: "Klima & Soğutma" },
  { en: "Appliance & Electronics Repair", tr: "Beyaz Eşya & Elektronik Tamir" },
  { en: "Painting & Plastering", tr: "Boya & Alçı" },
  { en: "Carpentry & Furniture", tr: "Marangoz & Mobilya" },
  { en: "Aluminium, PVC & Glass", tr: "Alüminyum, PVC & Cam" },
  { en: "Garden & Pool Maintenance", tr: "Bahçe & Havuz Bakımı" },
];

const trustLevels = [
  { level: "Registered", desc: "Phone verified · category · region" },
  { level: "Verified", desc: "ID seen · two previous customers called · photos of past work" },
  { level: "Approved Craftsman", desc: "Verified + business registration + written workmanship guarantee" },
];

export default function Home() {
  const currentYear = new Date().getFullYear(); // still okay, but you could hardcode

  return (
    <div className="flex min-h-screen w-full flex-col bg-white dark:bg-black">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-black/80">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span>ustacik</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/become-craftsman">List Your Service</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Find a craftsman you can <span className="text-primary">trust</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              ustacik.com connects people in Northern Cyprus who need a job done
              with craftsmen who can do it – with verified profiles, honest reviews,
              and no hidden fees.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/craftsmen">Find a Craftsman</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/become-craftsman">Become a Craftsman</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free for customers · Craftsmen pay only after trust is built
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto w-full max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">Services we cover</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Eight categories, hundreds of jobs – all in one place.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <div
                key={cat.en}
                className="rounded-xl border bg-white p-4 text-center transition hover:shadow-md dark:bg-black"
              >
                <p className="font-medium">{cat.en}</p>
                <p className="text-sm text-muted-foreground">{cat.tr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Model */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">Our trust model</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Three levels of verification – so you know who you&apos;re hiring.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {trustLevels.map((item) => (
              <div key={item.level} className="rounded-xl border p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{item.level}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Every verification is recorded. If a badge is disputed, we can show our work.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto w-full max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">How it works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Users className="h-5 w-5 text-primary" />
                For Customers
              </h3>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>1. Describe your job and choose a category</li>
                <li>2. Get matched with verified craftsmen</li>
                <li>3. Compare profiles, past work, and reviews</li>
                <li>4. Hire with confidence – no commission, no hidden fees</li>
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Star className="h-5 w-5 text-primary" />
                For Craftsmen
              </h3>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>1. Create your profile – free, always</li>
                <li>2. Get verified – we’ll call your past customers</li>
                <li>3. Receive job requests from customers nearby</li>
                <li>4. Build your reputation with honest reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews preview */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold">Real reviews from real jobs</h2>
          <p className="mt-2 text-muted-foreground">
            No anonymous reviews. Only customers who hired through ustacik can rate.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border p-6 text-left">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-500">{"★".repeat(4)}☆</div>
                  <span className="text-sm text-muted-foreground">4.5</span>
                </div>
                <p className="mt-2 text-sm">
                  “Great work – arrived on time, finished quickly, and cleaned up after.”
                </p>
                <p className="mt-4 text-xs text-muted-foreground">– Customer, Nicosia</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-primary/5 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-2 text-muted-foreground">
            Whether you need a job done or you&apos;re a craftsman looking for work,
            join ustacik today.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/craftsmen">Find a Craftsman</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/become-craftsman">List Your Service</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8 dark:bg-black">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">ustacik.com</span>
              <span className="text-sm text-muted-foreground">· Northern Cyprus</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {currentYear} Ata Bilişim Teknolojileri
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/terms" className="hover:underline">Terms</Link>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}