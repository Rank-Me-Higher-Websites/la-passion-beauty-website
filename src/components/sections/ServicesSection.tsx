import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import storefrontImage from "@/assets/services-storefront.png";

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
    <section ref={ref} className="bg-background overflow-hidden">
      <div className="grid lg:grid-cols-2 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col justify-center px-4 py-6 md:px-8 md:py-16 lg:px-16 lg:py-20 order-2 lg:order-1"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-xs md:text-sm mb-2">What We Offer</p>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-serif font-semibold text-foreground mb-4">Our Services</h2>

          <div className="mb-4 md:mb-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.04 }}
                className="flex items-center justify-between py-2.5 md:py-3 border-b border-black/10 last:border-b-0"
              >
                <span className="font-serif text-sm md:text-lg text-foreground">{service.title}</span>
                <span className="text-xs md:text-sm font-semibold text-primary ml-4 whitespace-nowrap">{service.price}</span>
              </motion.div>
            ))}
          </div>

          <Button variant="gold" size="lg" asChild className="text-sm h-10 md:h-11">
            <a href="tel:+13313188113">
              <Phone className="mr-2 h-4 w-4" />
              Call +1 331-318-8113
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center p-4 md:p-8 lg:p-12 order-1 lg:order-2"
        >
          <img
            src={storefrontImage}
            alt="La Passion Beauty Salon storefront"
            className="w-full h-auto object-contain rounded-xl md:rounded-2xl opacity-90 border-2 border-black/15"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
