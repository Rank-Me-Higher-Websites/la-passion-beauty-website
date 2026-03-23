import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Scissors, Palette, Cable } from "lucide-react";
import { Button } from "@/components/ui/button";
import hairStylingImage from "@/assets/hair-styling.jpg";
import rootTouchupImage from "@/assets/root-touchup.jpg";
import fullColorImage from "@/assets/full-color.jpg";
import partialHighlightsImage from "@/assets/partial-highlights.jpg";
import fullHighlightsImage from "@/assets/full-highlights.jpg";
import highlightsCutTonerImage from "@/assets/highlights-cut-toner.jpg";
import hairExtensionsImage from "@/assets/hair-extensions.jpg";

const allServices = [
  {
    title: "Haircut",
    price: "$45+",
    description: "Personalized cuts that enhance your natural beauty — from fresh new styles to simple trims.",
    image: hairStylingImage,
    icon: Scissors,
  },
  {
    title: "Root Touch-Up",
    price: "$85+",
    description: "Seamless root coverage matched to your existing shade for vibrant, even color.",
    image: rootTouchupImage,
    icon: Palette,
  },
  {
    title: "Full Color",
    price: "$110+",
    description: "All-over color transformation — rich brunettes, warm blondes, or bold fashion shades.",
    image: fullColorImage,
    icon: Palette,
  },
  {
    title: "Full Color + Cut",
    price: "$140+",
    description: "Complete color and precision cut in one session. Leave fully refreshed.",
    image: hairStylingImage,
    icon: Palette,
  },
  {
    title: "Partial Highlights",
    price: "$120+",
    description: "Strategic highlights for a subtle, sun-kissed effect with natural dimension.",
    image: partialHighlightsImage,
    icon: Palette,
  },
  {
    title: "Full Highlights",
    price: "$160+",
    description: "Multi-tonal dimension throughout — expert foiling for natural movement and depth.",
    image: fullHighlightsImage,
    icon: Palette,
  },
  {
    title: "Highlights + Cut + Toner",
    price: "$190+",
    description: "Our most comprehensive package — highlights, custom toner, and a precision cut.",
    image: highlightsCutTonerImage,
    icon: Palette,
  },
  {
    title: "Extensions",
    price: "Quote",
    description: "Instant length and volume that blends seamlessly. Available with select stylists.",
    image: hairExtensionsImage,
    icon: Cable,
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref}>
      <div className="py-12 bg-secondary/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">What We Offer</p>
            <h2 className="heading-section text-foreground mb-4">Our Services</h2>
          </motion.div>
        </div>
      </div>

      {allServices.map((service, index) => (
        <motion.div
          key={service.title}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className={`grid lg:grid-cols-2 items-stretch border-b border-black/10 ${index % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}`}
        >
          <div className={`relative group ${index % 2 === 1 ? 'lg:order-2' : ''} overflow-hidden`}>
            <img
              src={service.image}
              alt={`${service.title} at La Passion Beauty Salon`}
              className="w-full h-48 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className={`flex items-center px-8 py-8 lg:px-16 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">{service.title}</h3>
                <span className="text-lg font-semibold text-primary">{service.price}</span>
              </div>
              <p className="text-base text-muted-foreground mb-4">{service.description}</p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
              >
                Book Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      ))}

      <div className="py-10 bg-secondary/30 text-center">
        <Button variant="gold" size="lg" asChild>
          <Link to="/booking">Book an Appointment</Link>
        </Button>
      </div>
    </section>
  );
};

export default ServicesSection;
