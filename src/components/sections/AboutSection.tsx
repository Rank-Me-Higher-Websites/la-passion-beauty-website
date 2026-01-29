import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import aboutImage from "@/assets/about-salon.jpg";

const highlights = [
  "Expert stylists with advanced training",
  "Exclusive Kérastase haircare products",
  "Personalized styles for every client",
  "Restorative treatments for shine and strength",
  "A modern, clean, and relaxing salon",
  "Honest advice and guidance",
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-cream-dark">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elevated">
              <img
                src={aboutImage}
                alt="La Passion Beauty Salon interior in Lemont, IL"
                className="w-full h-auto"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border-4 border-primary/30 rounded-2xl -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">About Us</p>
            <h2 className="heading-section text-foreground mb-6">
              Masters of Hair and Timeless Beauty
            </h2>
            <p className="text-body mb-6">
              At La Passion Beauty Salon, every visit is about more than just great hair — it's about 
              feeling amazing. Our stylists specialize in precision haircuts, dimensional color, 
              nourishing hair treatments, and expert permanent makeup that enhance your natural 
              beauty and keep your hair healthy.
            </p>
            <p className="text-body mb-8">
              Located in Lemont, IL, we blend creativity with personalized care to deliver results 
              that make you look and feel your absolute best. Our team works exclusively with 
              <strong className="text-foreground"> Kérastase</strong>, the world's leading luxury haircare brand.
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
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
      </div>
    </section>
  );
};

export default AboutSection;
