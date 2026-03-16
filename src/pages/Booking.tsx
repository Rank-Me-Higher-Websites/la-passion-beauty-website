import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Clock, User, CalendarIcon, Phone, Mail, ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { addBooking } from "@/lib/bookings-store";
import {
  services,
  staffMembers,
  serviceCategories,
  getStaffTimeSlots,
  type Service,
  type StaffMember,
  staffWorksOnDate,
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
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [currentStep, setCurrentStep] = useState<Step>("service");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState(user?.name || "");
  const [clientPhone, setClientPhone] = useState(user?.phone || "");
  const [clientEmail, setClientEmail] = useState(user?.email || "");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setClientName(user.name);
      setClientPhone(user.phone);
      setClientEmail(user.email);
    }
  }, [user]);

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  const availableStaff = selectedService
    ? staffMembers.filter((s) => s.services.includes(selectedService.category))
    : staffMembers;

  const staffTimeSlots = useMemo(
    () => (selectedDate && selectedStaff ? getStaffTimeSlots(selectedStaff, selectedDate) : []),
    [selectedDate, selectedStaff]
  );

  const goNext = () => {
    const next = steps[currentStepIndex + 1];
    if (next) setCurrentStep(next.key);
  };

  const goBack = () => {
    const prev = steps[currentStepIndex - 1];
    if (prev) setCurrentStep(prev.key);
  };

  const handleSubmit = async () => {
    const bookingData = {
      clientName,
      clientPhone,
      clientEmail,
      serviceId: selectedService?.id || "",
      staffId: selectedStaff?.id || "",
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      time: selectedTime || "",
      status: "pending",
      notes: notes || null,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        setIsSubmitted(true);
        return;
      }
    } catch {}
    addBooking({
      id: `b_${Date.now()}`,
      clientName,
      clientPhone,
      clientEmail,
      serviceId: selectedService?.id || "",
      staffId: selectedStaff?.id || "",
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      time: selectedTime || "",
      status: "pending",
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-custom max-w-lg pt-8 pb-20">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <Home className="h-4 w-4" /> Back to Home
          </Link>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom max-w-2xl pt-8 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {steps.map((step, i) => (
                <div key={step.key} className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors border-2",
                      i <= currentStepIndex
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-black"
                    )}
                  >
                    {i < currentStepIndex ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "hidden sm:block w-12 md:w-20 h-0.5 mx-1",
                        i < currentStepIndex ? "bg-primary" : "bg-black/30"
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
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors border-2 whitespace-nowrap",
                        !selectedCategory
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-black hover:bg-muted/80"
                      )}
                    >
                      All
                    </button>
                    {serviceCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-colors border-2 whitespace-nowrap",
                          selectedCategory === cat.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-foreground border-black hover:bg-muted/80"
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
                          "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                          selectedService?.id === service.id
                            ? "border-primary bg-primary/5"
                            : "border-black hover:border-primary bg-card"
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
                          "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                          selectedStaff?.id === staff.id
                            ? "border-primary bg-primary/5"
                            : "border-black hover:border-primary bg-card"
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
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-black hover:border-primary bg-card transition-all text-left"
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

                  <div className="bg-card rounded-xl border-2 border-black p-4 mb-6">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      disabled={(date) =>
                        date < new Date() || date.getDay() === 0 || (selectedStaff ? !staffWorksOnDate(selectedStaff, date) : date.getDay() === 1)
                      }
                      className="p-0 pointer-events-auto w-full"
                      classNames={{
                        months: "flex flex-col w-full",
                        month: "space-y-4 w-full",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full justify-between",
                        head_cell: "text-muted-foreground rounded-md flex-1 text-center font-normal text-[0.8rem]",
                        row: "flex w-full justify-between mt-2",
                        cell: "flex-1 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground",
                        day_outside: "day-outside text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-50",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-border",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                      }}
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <p className="font-medium text-foreground mb-3">
                        Available times for {format(selectedDate, "EEEE, MMM d")}
                      </p>
                      {staffTimeSlots.length === 0 ? (
                        <p className="text-muted-foreground text-sm">{selectedStaff?.name} is not available on this day</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {staffTimeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={cn(
                                "py-2.5 px-2 rounded-lg text-sm font-medium transition-all",
                                selectedTime === time
                                  ? "bg-primary text-primary-foreground shadow-glow"
                                  : "bg-card border border-border hover:border-primary text-foreground"
                              )}
                            >
                              {time}
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
                          className="pl-10 border-2 border-black"
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
                          className="pl-10 border-2 border-black"
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
                          className="pl-10 border-2 border-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Notes (optional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special requests..."
                        className="flex w-full rounded-md border-2 border-black bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
                      />
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border-2 border-black p-4 mt-6">
                    <p className="text-sm font-semibold text-foreground mb-3">Your Booking Summary</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-medium text-foreground">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stylist</span>
                        <span className="font-medium text-foreground">{selectedStaff?.name || "No Preference"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium text-foreground">
                          {selectedDate ? format(selectedDate, "EEE, MMM d, yyyy") : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium text-foreground">{selectedTime || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-semibold text-primary">{selectedService?.price}</span>
                      </div>
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

                  <div className="bg-card rounded-xl border-2 border-black p-5 space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Service</span>
                      <span className="font-medium text-foreground">{selectedService?.name}</span>
                    </div>
                    <div className="border-t border-black/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Stylist</span>
                      <span className="font-medium text-foreground">
                        {selectedStaff?.name || "No Preference"}
                      </span>
                    </div>
                    <div className="border-t border-black/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Date</span>
                      <span className="font-medium text-foreground">
                        {selectedDate && format(selectedDate, "EEE, MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="border-t border-black/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Time</span>
                      <span className="font-medium text-foreground">{selectedTime}</span>
                    </div>
                    <div className="border-t border-black/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Duration</span>
                      <span className="font-medium text-foreground">{selectedService?.duration} min</span>
                    </div>
                    <div className="border-t border-black/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Price</span>
                      <span className="font-semibold text-primary text-lg">{selectedService?.price}</span>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border-2 border-black p-5 space-y-2 mb-6">
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
    </div>
  );
};

export default Booking;
