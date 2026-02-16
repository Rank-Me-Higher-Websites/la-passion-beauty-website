import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Users, Award, BadgeCheck, Headphones } from "lucide-react";
import heroImage from "@/assets/hero-salon.jpg";

const stats = [
  { value: "1K+", label: "Happy Clients", icon: Users },
  { value: "10+", label: "Year Experience", icon: Award },
  { value: "100%", label: "Certified", icon: BadgeCheck },
  { value: "24/7", label: "Customers Support", icon: Headphones },
];

const HeroSection = () => {
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
        <div className="max-w-3xl">
          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3 bg-card/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-border"
              >
                <stat.icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-serif text-lg font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="heading-hero text-foreground mb-6"
          >
            Chicago's Top-Rated{" "}
            <span className="text-primary italic">Beauty & Hair Salon</span>{" "}
            in Lemont, IL
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl"
          >
            Exceptional Hair. Luxurious Treatments. Timeless Beauty.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg text-muted-foreground mb-10 max-w-2xl"
          >
            Elevating beauty in Chicago, La Passion offers expert hair care, nourishing treatments, 
            and flawless permanent makeup — all in one luxurious beauty salon experience.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="gold" size="xl" asChild>
              <Link to="/booking">Book Now</Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="tel:+13313188113" className="gap-2">
                <Phone className="h-4 w-4" />
                Call Now
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
