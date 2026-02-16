import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ChevronRight, Scissors, Palette, Sparkles, Cable, PenTool } from "lucide-react";
import heroImage from "@/assets/hero-salon.jpg";
import { serviceCategories, services } from "@/lib/booking-data";

const categoryIcons: Record<string, React.ElementType> = {
  hair: Scissors,
  coloring: Palette,
  treatments: Sparkles,
  extensions: Cable,
  "permanent-makeup": PenTool,
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : [];

  const handleBook = () => {
    const params = new URLSearchParams();
    if (selectedService) params.set("service", selectedService);
    else if (selectedCategory) params.set("category", selectedCategory);
    navigate(`/booking${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="La Passion Beauty Salon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          {/* Left - Copy */}
          <div className="lg:col-span-3">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="heading-hero text-foreground mb-6"
            >
              Chicago's Top-Rated{" "}
              <span className="text-primary italic">Beauty & Hair Salon</span>{" "}
              in Lemont, IL
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-xl text-muted-foreground mb-6 max-w-2xl"
            >
              Exceptional Hair. Luxurious Treatments. Timeless Beauty.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl"
            >
              Elevating beauty in Chicago, La Passion offers expert hair care, nourishing treatments,
              and flawless permanent makeup — all in one luxurious beauty salon experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Button variant="outline" size="lg" asChild>
                <a href="tel:+13313188113" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call +1 331-318-8113
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Right - Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border p-6 shadow-elevated">
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-1">
                Book Now
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Select a service to get started
              </p>

              {/* Category Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {serviceCategories.map((cat) => {
                  const Icon = categoryIcons[cat.id] || Scissors;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(isActive ? null : cat.id);
                        setSelectedService(null);
                      }}
                      className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-background/60 text-foreground border-border hover:border-primary/50 hover:bg-background"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-left leading-tight">{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Service List */}
              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Choose a service
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {filteredServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() =>
                          setSelectedService(
                            selectedService === service.id ? null : service.id
                          )
                        }
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                          selectedService === service.id
                            ? "bg-primary/10 border-primary text-foreground"
                            : "bg-transparent border-transparent hover:bg-muted/50 text-foreground"
                        }`}
                      >
                        <span className="text-left">{service.name}</span>
                        <span className="text-muted-foreground text-xs font-medium whitespace-nowrap ml-2">
                          {service.price} · {service.duration}min
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Book Button */}
              <Button
                variant="gold"
                size="lg"
                className="w-full"
                onClick={handleBook}
              >
                {selectedService
                  ? "Continue Booking"
                  : selectedCategory
                  ? "Book This Category"
                  : "Browse All Services"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
