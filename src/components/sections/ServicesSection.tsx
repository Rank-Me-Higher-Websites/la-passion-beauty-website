import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hairStylingImage from "@/assets/hair-styling.jpg";

const services = [
  { title: "Haircut", price: "$45+" },
  { title: "Root Touch-Up", price: "$85+" },
  { title: "Full Color", price: "$110+" },
  { title: "Full Color + Cut", price: "$140+" },
  { title: "Partial Highlights", price: "$120+" },
  { title: "Full Highlights", price: "$160+" },
  { title: "Highlights + Cut + Toner", price: "$190+" },
  { title: "Extensions", price: "Quote" },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-cream-dark">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 items-stretch rounded-2xl border border-black/15 bg-card overflow-hidden shadow-soft"
        >
          <div className="relative group overflow-hidden">
            <img
              src={hairStylingImage}
              alt="Hair styling at La Passion Beauty Salon"
              className="w-full h-72 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-col justify-center p-8 lg:p-10">
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">What We Offer</p>
            <h2 className="heading-section text-foreground mb-6">Our Services</h2>

            <div className="space-y-0 mb-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.04 }}
                  className="flex items-center justify-between py-3 border-b border-black/10 last:border-b-0"
                >
                  <span className="font-serif text-lg text-foreground">{service.title}</span>
                  <span className="text-sm font-semibold text-primary ml-4 whitespace-nowrap">{service.price}</span>
                </motion.div>
              ))}
            </div>

            <Button variant="gold" size="lg" asChild className="w-full">
              <Link to="/booking">
                Book an Appointment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
