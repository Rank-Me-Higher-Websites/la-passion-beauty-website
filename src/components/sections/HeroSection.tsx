import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ChevronRight, Star } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
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
        <img src={heroBg} alt="La Passion Beauty Salon" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-white/10" />

      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          {/* Left - Copy */}
          <div className="lg:col-span-3">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight text-foreground mb-6"
            >
              Chicago's Top-Rated{" "}
              <span className="text-primary italic">Beauty & Hair Salon</span>{" "}
              in Lemont, IL
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-2xl md:text-3xl text-muted-foreground mb-6 max-w-2xl font-light"
            >
              Exceptional Hair. Stunning Color. Timeless Beauty.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl"
            >
              Elevating beauty in Chicago, La Passion offers expert haircuts, stunning color,
              and premium extensions — all in one luxurious beauty salon experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Button variant="outline" size="lg" asChild className="border-2 border-foreground text-foreground hover:bg-foreground/5">
                <a href="tel:+13313188113" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call +1 331-318-8113
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center gap-6 mt-8"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">5.0</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">5.0</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-foreground">100% Quality</span>
              </div>
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
                      className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-background/60 text-foreground border-black/15 hover:border-primary/50 hover:bg-background"
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
