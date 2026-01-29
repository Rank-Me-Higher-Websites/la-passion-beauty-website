import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Scissors, Sparkles, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import hairStylingImage from "@/assets/hair-styling.jpg";
import permanentMakeupImage from "@/assets/permanent-makeup.jpg";
import hairTreatmentImage from "@/assets/hair-treatment.jpg";

const services = [
  {
    title: "Hair Services",
    description: "Our professional stylists specialize in personalized hair services that enhance your natural beauty. From sleek blowouts to trend-forward styling, we make sure your hair looks flawless and feels its best.",
    image: hairStylingImage,
    icon: Scissors,
    link: "/services#hair",
  },
  {
    title: "Permanent Makeup",
    description: "Our permanent makeup services enhance your natural beauty with expertly applied brows, eyeliner, and lip blush—customized to your features for soft, long-lasting results that simplify your routine.",
    image: permanentMakeupImage,
    icon: Sparkles,
    link: "/services#permanent-makeup",
  },
  {
    title: "Hair Treatments",
    description: "Our nourishing hair treatments are designed to repair, hydrate, and restore shine from root to tip. Using professional-grade formulas, we target dryness, damage, and frizz to leave your hair stronger, smoother, and healthier.",
    image: hairTreatmentImage,
    icon: Heart,
    link: "/services#treatments",
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">What We Offer</p>
          <h2 className="heading-section text-foreground mb-4">Our Services</h2>
          <p className="text-body">
            At La Passion Beauty Salon, we create styles that blend beauty with everyday ease. 
            Our services include custom cuts, rich, blended hair color, and restorative treatments 
            that bring back softness, shine, and strength.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group h-full overflow-hidden border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={`${service.title} at La Passion Beauty Salon`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="heading-card text-foreground mb-3">{service.title}</h3>
                  <p className="text-small flex-1 mb-4">{service.description}</p>
                  <Link
                    to={service.link}
                    className="inline-flex items-center text-primary font-medium text-sm hover:gap-2 transition-all group/link"
                  >
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
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
