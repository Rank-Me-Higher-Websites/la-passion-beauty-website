import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Phone, ChevronRight, ChevronLeft, Scissors, Palette, Sparkles, Cable, PenTool, CalendarIcon } from "lucide-react";
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState<"service" | "date">("service");

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : [];

  const handleBook = () => {
    const params = new URLSearchParams();
    if (selectedService) params.set("service", selectedService);
    else if (selectedCategory) params.set("category", selectedCategory);
    if (selectedDate) params.set("date", format(selectedDate, "yyyy-MM-dd"));
    navigate(`/booking${params.toString() ? `?${params}` : ""}`);
  };

  const canPickDate = !!selectedService;

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
              {step === "service" ? (
                <>
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

                  {/* Next / Book Button */}
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      if (canPickDate) {
                        setStep("date");
                      } else {
                        handleBook();
                      }
                    }}
                  >
                    {canPickDate ? (
                      <>
                        Pick a Date
                        <CalendarIcon className="h-4 w-4 ml-1" />
                      </>
                    ) : selectedCategory ? (
                      <>
                        Select a Service
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Browse All Services
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* Date Step */}
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setStep("service")}
                      className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h3 className="font-serif text-2xl font-semibold text-foreground">
                        Pick a Date
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {services.find((s) => s.id === selectedService)?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || date.getDay() === 0;
                      }}
                      className={cn("p-3 pointer-events-auto rounded-lg border border-border")}
                    />
                  </div>

                  {selectedDate && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-center text-muted-foreground mb-3"
                    >
                      Selected: <span className="font-medium text-foreground">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                    </motion.p>
                  )}

                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full"
                    disabled={!selectedDate}
                    onClick={handleBook}
                  >
                    Continue Booking
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
