import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { 
  Shield
} from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const footerColumns = [
  {
    title: "Platform",
    links: [
      { label: "Find a Craftsman", href: "/find-craftsmen" },
      { label: "Become a Craftsman", href: "/become-craftsman" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Trust & Safety", href: "/trust" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Report an Issue", href: "/report" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

// Added explicit label for accessibility
const socialLinks = [
  { icon: FaFacebook, label: "Facebook", href: "https://facebook.com" },
  { icon: FaTwitter, label: "Twitter", href: "https://twitter.com" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Top Grid - 5 Columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          
          {/* Platform Column (Includes Brand) */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">Ustacik</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-xs">
              Connecting homeowners with verified craftsmen across Northern Cyprus.
            </p>
          </div>

          {/* Loop through Platform, Company, Support, Legal */}
          {footerColumns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Socials Column */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Socials
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                    {/* Use explicit label for screen readers */}
                    <span className="sr-only">{social.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-8" />

        {/* Bottom Row */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {currentYear} Ustacik. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Made with <span className="text-red-500 animate-pulse">❤</span> in Northern Cyprus
          </p>
        </div>

      </div>
    </footer>
  );
}