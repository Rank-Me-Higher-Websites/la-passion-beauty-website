import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-4">Get In Touch</p>
          <h2 className="heading-section text-primary-foreground mb-3">
            Contact Us
          </h2>
          <p className="text-sm text-primary-foreground/70 mb-4 max-w-2xl mx-auto">
            Experience the luxury of personalized beauty care at La Passion Beauty Salon. 
            Our expert stylists are ready to help you look and feel your absolute best.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="cta" size="xl" asChild>
              <Link to="/booking">
                <Calendar className="h-5 w-5 mr-2" />
                Book Appointment
              </Link>
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              asChild
            >
              <a href="tel:+13313188113">
                <Phone className="h-5 w-5 mr-2" />
                Call +1 331-318-8113
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
