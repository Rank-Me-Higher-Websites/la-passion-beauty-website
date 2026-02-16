import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Check, Clock, User, CalendarIcon, Phone, Mail, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  services,
  staffMembers,
  serviceCategories,
  generateTimeSlots,
  type Service,
  type StaffMember,
  type TimeSlot,
} from "@/lib/booking-data";

type Step = "service" | "staff" | "datetime" | "details" | "confirm";

const steps: { key: Step; label: string }[] = [
  { key: "service", label: "Service" },
  { key: "staff", label: "Stylist" },
  { key: "datetime", label: "Date & Time" },
  { key: "details", label: "Your Info" },
  { key: "confirm", label: "Confirm" },
];

const Booking = () => {
  const [currentStep, setCurrentStep] = useState<Step>("service");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  const availableStaff = selectedService
    ? staffMembers.filter((s) => s.services.includes(selectedService.category))
    : staffMembers;

  const timeSlots = useMemo(
    () => (selectedDate ? generateTimeSlots(selectedDate) : []),
    [selectedDate]
  );

  const goNext = () => {
    const next = steps[currentStepIndex + 1];
    if (next) setCurrentStep(next.key);
  };

  const goBack = () => {
    const prev = steps[currentStepIndex - 1];
    if (prev) setCurrentStep(prev.key);
  };

  const handleSubmit = () => {
    // In production, this would POST to your Replit backend
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen bg-background">
          <div className="container-custom max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <h1 className="heading-section text-foreground mb-4">Booking Confirmed!</h1>
              <p className="text-body mb-2">
                Thank you, <strong>{clientName}</strong>. Your appointment has been booked.
              </p>
              <div className="bg-card rounded-xl p-6 mt-6 text-left space-y-3 shadow-card">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-foreground">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stylist</span>
                  <span className="font-medium text-foreground">{selectedStaff?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">
                    {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-foreground">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold text-primary">{selectedService?.price}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                A confirmation email will be sent to {clientEmail}
              </p>
              <Button variant="gold" size="lg" className="mt-6" asChild>
                <a href="/">Back to Home</a>
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-28 pb-16 min-h-screen bg-background">
        <div className="container-custom max-w-2xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {steps.map((step, i) => (
                <div key={step.key} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                      i <= currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {i < currentStepIndex ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "hidden sm:block w-12 md:w-20 h-0.5 mx-1",
                        i < currentStepIndex ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Step {currentStepIndex + 1} of {steps.length}: <strong>{steps[currentStepIndex].label}</strong>
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step 1: Service */}
              {currentStep === "service" && (
                <div>
                  <h2 className="heading-card text-foreground mb-2">Choose a Service</h2>
                  <p className="text-body text-sm mb-6">Select the service you'd like to book</p>

                  {/* Category filter */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                        !selectedCategory
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      All
                    </button>
                    {serviceCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                          selectedCategory === cat.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {filteredServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => {
                          setSelectedService(service);
                          goNext();
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                          selectedService?.id === service.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        )}
                      >
                        <div>
                          <p className="font-medium text-foreground">{service.name}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {service.duration} min
                            </span>
                            <span className="font-semibold text-primary">{service.price}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Staff */}
              {currentStep === "staff" && (
                <div>
                  <h2 className="heading-card text-foreground mb-2">Choose Your Stylist</h2>
                  <p className="text-body text-sm mb-6">Select who you'd like to see</p>

                  <div className="space-y-3">
                    {availableStaff.map((staff) => (
                      <button
                        key={staff.id}
                        onClick={() => {
                          setSelectedStaff(staff);
                          goNext();
                        }}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                          selectedStaff?.id === staff.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        )}
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-semibold text-lg">{staff.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{staff.name}</p>
                          <p className="text-sm text-muted-foreground">{staff.role}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setSelectedStaff(null);
                        goNext();
                      }}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 bg-card transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">No Preference</p>
                        <p className="text-sm text-muted-foreground">Any available stylist</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {currentStep === "datetime" && (
                <div>
                  <h2 className="heading-card text-foreground mb-2">Pick Date & Time</h2>
                  <p className="text-body text-sm mb-6">Choose your preferred appointment time</p>

                  <div className="bg-card rounded-xl border border-border p-4 mb-6">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      disabled={(date) =>
                        date < new Date() || date.getDay() === 0
                      }
                      className="p-0 pointer-events-auto mx-auto"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <p className="font-medium text-foreground mb-3">
                        Available times for {format(selectedDate, "EEEE, MMM d")}
                      </p>
                      {timeSlots.length === 0 ? (
                        <p className="text-muted-foreground text-sm">Closed on this day</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.time}
                              disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              className={cn(
                                "py-2.5 px-2 rounded-lg text-sm font-medium transition-all",
                                selectedTime === slot.time
                                  ? "bg-primary text-primary-foreground shadow-glow"
                                  : slot.available
                                  ? "bg-card border border-border hover:border-primary text-foreground"
                                  : "bg-muted text-muted-foreground/40 cursor-not-allowed line-through"
                              )}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={goBack} className="flex-1">
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Button
                      variant="gold"
                      onClick={goNext}
                      disabled={!selectedDate || !selectedTime}
                      className="flex-1"
                    >
                      Next <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Client Details */}
              {currentStep === "details" && (
                <div>
                  <h2 className="heading-card text-foreground mb-2">Your Information</h2>
                  <p className="text-body text-sm mb-6">We'll send your confirmation here</p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Jane Smith"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="(312) 555-0100"
                          type="tel"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="jane@example.com"
                          type="email"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Notes (optional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special requests..."
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={goBack} className="flex-1">
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Button
                      variant="gold"
                      onClick={goNext}
                      disabled={!clientName || !clientPhone || !clientEmail}
                      className="flex-1"
                    >
                      Review <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Confirm */}
              {currentStep === "confirm" && (
                <div>
                  <h2 className="heading-card text-foreground mb-2">Review & Confirm</h2>
                  <p className="text-body text-sm mb-6">Please confirm your appointment details</p>

                  <div className="bg-card rounded-xl border border-border p-5 space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Service</span>
                      <span className="font-medium text-foreground">{selectedService?.name}</span>
                    </div>
                    <div className="border-t border-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Stylist</span>
                      <span className="font-medium text-foreground">
                        {selectedStaff?.name || "No Preference"}
                      </span>
                    </div>
                    <div className="border-t border-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Date</span>
                      <span className="font-medium text-foreground">
                        {selectedDate && format(selectedDate, "EEE, MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="border-t border-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Time</span>
                      <span className="font-medium text-foreground">{selectedTime}</span>
                    </div>
                    <div className="border-t border-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Duration</span>
                      <span className="font-medium text-foreground">{selectedService?.duration} min</span>
                    </div>
                    <div className="border-t border-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Price</span>
                      <span className="font-semibold text-primary text-lg">{selectedService?.price}</span>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-5 space-y-2 mb-6">
                    <p className="text-sm font-medium text-foreground">{clientName}</p>
                    <p className="text-sm text-muted-foreground">{clientPhone}</p>
                    <p className="text-sm text-muted-foreground">{clientEmail}</p>
                    {notes && <p className="text-sm text-muted-foreground italic">"{notes}"</p>}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={goBack} className="flex-1">
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Button variant="cta" size="lg" onClick={handleSubmit} className="flex-1">
                      <Check className="h-5 w-5 mr-2" /> Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
