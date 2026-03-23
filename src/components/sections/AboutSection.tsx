import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import aboutImage from "@/assets/about-salon.jpg";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-cream-dark overflow-hidden">
      <div className="grid lg:grid-cols-2 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden"
        >
          <img
            src={aboutImage}
            alt="La Passion Beauty Salon interior in Lemont, IL"
            className="w-full h-72 lg:h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-20"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">About Us</p>
          <h2 className="heading-section text-foreground mb-4">
            About Us
          </h2>
          <p className="text-body mb-6">
            At La Passion Beauty Salon, every visit is about more than just great hair — it's about 
            feeling amazing. Our stylists specialize in precision haircuts, dimensional color, 
            and premium hair extensions that enhance your natural 
            beauty and keep your hair healthy. Located in Lemont, IL, we blend creativity with 
            personalized care to deliver results that make you look and feel your absolute best.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="gold" size="lg" asChild>
              <a href="https://maps.app.goo.gl/rz34qNsMxhEowymC8" target="_blank" rel="noopener noreferrer">
                <MapPin className="h-4 w-4 mr-2" />
                Visit Us
              </a>
            </Button>
            <Button variant="gold-outline" size="lg" asChild>
              <a href="tel:+13313188113">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
