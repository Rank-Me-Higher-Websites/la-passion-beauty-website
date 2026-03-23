import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Scissors, Palette, Cable } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import hairStylingImage from "@/assets/hair-styling.jpg";
import hairColoringImage from "@/assets/hair-coloring.jpg";
import hairExtensionsImage from "@/assets/hair-extensions.jpg";
import permanentMakeupImage from "@/assets/permanent-makeup.jpg";
import hairTreatmentImage from "@/assets/hair-treatment.jpg";

const services = [
  {
    title: "Hair Services",
    description: "Our professional stylists specialize in personalized haircuts that enhance your natural beauty. Whether you're looking for a fresh new style or a simple trim, we make sure your hair looks flawless and feels its best.",
    image: hairStylingImage,
    icon: Scissors,
    link: "/services#hair",
  },
  {
    title: "Hair Coloring",
    description: "From subtle highlights to bold, vibrant shades, our hair coloring services are tailored to your style and personality. Using professional techniques and quality products, we create colors that look fresh and natural.",
    image: hairColoringImage,
    icon: Palette,
    link: "/services#coloring",
  },
  {
    title: "Hair Extensions",
    description: "Looking for instant length or volume? Our high-quality hair extensions blend seamlessly with your natural hair, giving you a fuller, longer look that feels comfortable and effortless. Available with Kamila Janik and Veronika Dadek.",
    image: hairExtensionsImage,
    icon: Cable,
    link: "/services#extensions",
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-secondary/30">
      <div className="container-custom">
        {/* Section Header - Left Aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-6 md:mb-8"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">What We Offer</p>
          <h2 className="heading-section text-foreground mb-4">Our Services</h2>
          <p className="text-body">
            At La Passion Beauty Salon, we create styles that blend beauty with everyday ease. 
            Our services include expert haircuts, rich and blended hair color, 
            and premium extensions for instant length and volume.
          </p>
        </motion.div>

        {/* Alternating Service Cards */}
        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative group ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="overflow-hidden rounded-xl border border-border">
                  <img
                    src={service.image}
                    alt={`${service.title} at La Passion Beauty Salon`}
                    className="w-full h-72 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-card">
                  <service.icon className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <h3 className="heading-card text-foreground mb-4">{service.title}</h3>
                <p className="text-body mb-6">{service.description}</p>
                <Link
                  to={service.link}
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  Explore {service.title}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8"
        >
          <Button variant="gold" size="lg" asChild>
            <Link to="/services">View All Services</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
