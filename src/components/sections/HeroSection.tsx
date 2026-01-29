import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock } from "lucide-react";
import heroImage from "@/assets/hero-salon.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Split Layout - Content Left, Image Right */}
      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-left"
          >
            <p className="text-primary uppercase tracking-[0.25em] text-sm mb-4 font-medium">
              Lemont, IL Beauty Destination
            </p>
            
            <h1 className="heading-hero text-foreground mb-6">
              Where Beauty{" "}
              <span className="text-primary italic">Becomes</span>{" "}
              Your Signature
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Experience personalized hair styling, transformative treatments, and 
              flawless permanent makeup at Chicago's most trusted beauty salon.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="gold" size="xl" asChild>
                <Link to="/contact">Book Your Visit</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="tel:+13313188113" className="gap-2">
                  <Phone className="h-4 w-4" />
                  (331) 318-8113
                </a>
              </Button>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-xs text-muted-foreground">Lemont, IL 60439</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Hours</p>
                  <p className="text-xs text-muted-foreground">Mon-Sat: 9AM-7PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Image with Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl -z-10" />
              <img
                src={heroImage}
                alt="La Passion Beauty Salon interior - luxury hair salon in Lemont, IL"
                className="w-full h-[600px] object-cover rounded-2xl shadow-elevated"
              />
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card border border-border"
              >
                <p className="text-4xl font-serif font-semibold text-primary">10+</p>
                <p className="text-sm text-muted-foreground">Years of Excellence</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Hero Image */}
      <div className="lg:hidden absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="La Passion Beauty Salon"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
      </div>
    </section>
  );
};

export default HeroSection;
