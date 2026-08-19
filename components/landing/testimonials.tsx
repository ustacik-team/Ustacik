import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export interface TestimonialItem {
  id: string | number;
  name: string;
  avatar: string | null;
  review: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

const fallbackTestimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&c=force",
    review: "Ustacik made finding a plumber incredibly easy. The professional arrived on time, fixed the issue quickly, and the price was fair. Highly recommend!",
    rating: 5,
  },
  {
    id: 2,
    name: "David Karim",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&c=force",
    review: "I needed my entire house painted. Found an amazing painter here. The quality of work was outstanding, and the communication was perfect throughout.",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rossi",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&c=force",
    review: "After my HVAC broke down in the middle of summer, Ustacik connected me with a technician who fixed it within hours. Absolute lifesaver.",
    rating: 4,
  },
  {
    id: 4,
    name: "Marios Papas",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&c=force",
    review: "Great platform for finding reliable workers. The electrician we hired was incredibly professional and knowledgeable. Will definitely use again.",
    rating: 5,
  },
  {
    id: 5,
    name: "Ayesha Khan",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&c=force",
    review: "The verification system puts me at ease. I hired a carpenter for custom shelves, and the craftsmanship was exceptional. Highly trusted service.",
    rating: 5,
  },
  {
    id: 6,
    name: "Omar Al-Hassan",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&c=force",
    review: "I've used Ustacik for both plumbing and appliance repair. Every time, the job gets done professionally without any hidden charges.",
    rating: 5,
  },
];

export function Testimonials({ testimonials }: TestimonialsProps) {
  const items = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section className="py-12 md:py-16 bg-muted/20">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Real reviews from homeowners who trusted Ustacik to get the job done right.
          </p>
        </div>

        {/* Responsive Grid: 3 Columns Desktop, 2 Tablet, 1 Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="p-6 flex flex-col h-full gap-4">
                
                {/* Avatar & Customer Name Row */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-background">
                    <AvatarImage src={testimonial.avatar ?? undefined} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    {/* Ratings */}
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < testimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &quot;{testimonial.review}&quot;
                  </p>
                </div>
                
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}