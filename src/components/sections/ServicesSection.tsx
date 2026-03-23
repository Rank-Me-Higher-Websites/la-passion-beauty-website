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
    <section ref={ref} className="bg-cream-dark overflow-hidden">
      <div className="grid lg:grid-cols-2 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-20"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">What We Offer</p>
          <h2 className="heading-section text-foreground mb-6">Our Services</h2>

          <div className="mb-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.04 }}
                className="flex items-center justify-between py-3 border-b border-black/10 last:border-b-0"
              >
                <span className="font-serif text-lg text-foreground">{service.title}</span>
                <span className="text-sm font-semibold text-primary ml-4 whitespace-nowrap">{service.price}</span>
              </motion.div>
            ))}
          </div>

          <Button variant="gold" size="lg" asChild>
            <Link to="/booking">
              Book an Appointment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden"
        >
          <img
            src={hairStylingImage}
            alt="Hair styling at La Passion Beauty Salon"
            className="w-full h-72 lg:h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
