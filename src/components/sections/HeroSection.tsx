import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-salon.jpg";
import { services } from "@/lib/booking-data";

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleBook = () => {
    const params = new URLSearchParams();
    if (selectedService) params.set("service", selectedService);
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
              Exceptional Hair. Stunning Color. Timeless Beauty.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl"
            >
              Elevating beauty in Chicago, La Passion offers expert haircuts, stunning color,
              and premium extensions — all in one luxurious beauty salon experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Button variant="outline" size="lg" asChild className="border-2 border-black">
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
            <div className="bg-card/90 backdrop-blur-md rounded-2xl border-2 border-black p-6 shadow-elevated">
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-1">
                Book Now
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select a service to get started
              </p>

              <div className="flex flex-col gap-1.5 mb-4">
                {services.map((service) => {
                  const isActive = selectedService === service.id;
                  return (
                    <button
                      key={service.id}
                      data-testid={`hero-service-${service.id}`}
                      onClick={() => setSelectedService(isActive ? null : service.id)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-background/60 text-foreground border-black/20 hover:border-primary/50 hover:bg-background"
                      }`}
                    >
                      <span className="text-left">{service.name}</span>
                      <span className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {service.price}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Button
                variant="gold"
                size="lg"
                className="w-full"
                data-testid="hero-book-now"
                onClick={handleBook}
              >
                Book Now
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
