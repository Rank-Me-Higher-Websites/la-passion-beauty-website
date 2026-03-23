import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Scissors, Palette, Cable } from "lucide-react";
import { Button } from "@/components/ui/button";
import hairStylingImage from "@/assets/hair-styling.jpg";
import hairColoringImage from "@/assets/hair-coloring.jpg";
import hairExtensionsImage from "@/assets/hair-extensions.jpg";

const allServices = [
  {
    title: "Haircut",
    price: "$45+",
    duration: "60 min",
    description: "Our professional stylists specialize in personalized haircuts that enhance your natural beauty. Whether you're looking for a fresh new style or a simple trim, we make sure your hair looks flawless and feels its best.",
    image: hairStylingImage,
    icon: Scissors,
    link: "/services#hair",
  },
  {
    title: "Root Touch-Up",
    price: "$85+",
    duration: "90 min",
    description: "Keep your color looking fresh with a seamless root touch-up. We carefully match your existing shade to blend new growth naturally, leaving you with vibrant, even color from root to tip.",
    image: hairColoringImage,
    icon: Palette,
    link: "/services#coloring",
  },
  {
    title: "Full Color",
    price: "$110+",
    duration: "120 min",
    description: "Transform your look with a full, all-over color application. From rich brunettes and warm blondes to bold fashion shades, our colorists create stunning, long-lasting results tailored to your skin tone.",
    image: hairColoringImage,
    icon: Palette,
    link: "/services#coloring",
  },
  {
    title: "Full Color + Cut",
    price: "$140+",
    duration: "150 min",
    description: "The ultimate combo — a complete color transformation paired with a precision haircut. Save time and leave the salon with a fully refreshed look, from color to shape.",
    image: hairColoringImage,
    icon: Palette,
    link: "/services#coloring",
  },
  {
    title: "Partial Highlights",
    price: "$120+",
    duration: "120 min",
    description: "Add dimension and brightness with strategically placed partial highlights. Perfect for a subtle, sun-kissed effect that adds depth without committing to a full head of highlights.",
    image: hairColoringImage,
    icon: Palette,
    link: "/services#coloring",
  },
  {
    title: "Full Highlights",
    price: "$160+",
    duration: "150 min",
    description: "Make a statement with full highlights that add multi-tonal dimension throughout your entire head. Our colorists use expert foiling techniques to create natural movement and gorgeous depth.",
    image: hairColoringImage,
    icon: Palette,
    link: "/services#coloring",
  },
  {
    title: "Highlights + Cut + Toner",
    price: "$190+",
    duration: "180 min",
    description: "Our most comprehensive color package — full highlights refined with a custom toner for the perfect shade, finished with a precision cut. Walk out with a completely polished, salon-fresh look.",
    image: hairColoringImage,
    icon: Palette,
    link: "/services#coloring",
  },
  {
    title: "Extensions",
    price: "Quote",
    duration: "Consultation",
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">What We Offer</p>
          <h2 className="heading-section text-foreground mb-4">Our Services</h2>
          <p className="text-body">
            At La Passion Beauty Salon, we create styles that blend beauty with everyday ease. 
            Expert haircuts, rich color, and premium extensions — all in one place.
          </p>
        </motion.div>

        <div className="space-y-8">
          {allServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={`grid lg:grid-cols-5 items-stretch rounded-2xl border border-black/15 bg-card overflow-hidden shadow-soft`}
            >
              <div className={`relative group lg:col-span-2 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="overflow-hidden h-full">
                  <img
                    src={service.image}
                    alt={`${service.title} at La Passion Beauty Salon`}
                    className="w-full h-56 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className={`flex flex-col justify-center p-8 lg:p-10 lg:col-span-3 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                    <service.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="heading-card text-foreground">{service.title}</h3>
                </div>
                <div className="flex items-center gap-3 mb-4 ml-12">
                  <span className="text-sm font-semibold text-primary">{service.price}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{service.duration}</span>
                </div>
                <p className="text-body mb-5">{service.description}</p>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  Book {service.title}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <Button variant="gold" size="lg" asChild>
            <Link to="/booking">Book an Appointment</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
